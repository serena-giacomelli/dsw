import {Request, Response} from 'express'
import { orm } from '../shared/db/orm.js';
import { Pedido } from '../models/pedido.entity.js';
import { LineaPed } from '../models/lineaPed.entity.js';
import { Pago } from '../models/pago.entity.js';
import { Producto } from '../models/prod.entity.js';
import { Usuario } from '../models/usuarios.entity.js';
import { Transportista } from '../models/transportista.entity.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { EmailService } from '../services/emailService.js';

const em  = orm.em

async function findAll(req: AuthRequest, res: Response) {
    try {
        let pedidos;
        if (req.user?.tipoUsuario === 'admin') {
            // Admin: ver todos los pedidos
            pedidos = await em.find(Pedido, {}, { 
                populate: ['usuarios', 'lineasPed', 'lineasPed.productos', 'pagos', 'transportista'],
                orderBy: { fecha_pedido: 'DESC' }
            });
        } else {
            // Usuario común: solo sus pedidos
            pedidos = await em.find(Pedido, { usuarios: req.user?.id }, { 
                populate: ['usuarios', 'lineasPed', 'lineasPed.productos', 'pagos', 'transportista'],
                orderBy: { fecha_pedido: 'DESC' }
            });
        }
        res.status(200).json({ message: 'found pedidos', data: pedidos })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
}}


async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const pedido = await em.findOneOrFail(Pedido, { id }) 
        res.status(200).json({ message: 'found one pedido', data: pedido })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }}

async function add(req: Request, res: Response) {
    try {
        const pedido = em.create(Pedido, req.body)
        await em.flush()
        res.status(201).json({ message: 'pedido created', data: pedido })
    } 
    catch (error:any) {
        res.status(500).json({ message: error.message })
    }}

 async function update(req: AuthRequest, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const pedido = await em.findOneOrFail(Pedido, { id }, { 
            populate: ['usuarios', 'transportista', 'pagos'] 
        });

        // Verificar permisos: solo admin o el usuario propietario puede actualizar
        if (req.user?.tipoUsuario !== 'admin') {
            const esUsuarioPropietario = pedido.usuarios.getItems().some(usuario => usuario.id === req.user?.id);
            if (!esUsuarioPropietario) {
                return res.status(403).json({ message: 'No tienes permisos para actualizar este pedido' });
            }
        }

        const estadoAnterior = pedido.estado;
        let emailEnviado = false;

        // --- CANCELACIÓN DE PEDIDO ---
        if (req.body.estado === 'cancelado') {
            // Solo permitir cancelar si está pendiente o pago_aprobado
            if (pedido.estado !== 'pendiente' && pedido.estado !== 'pago_aprobado') {
                return res.status(400).json({ message: 'Solo se pueden cancelar pedidos pendientes o con pago aprobado' });
            }
            pedido.estado = 'cancelado';
            pedido.fecha_cancelacion = new Date();
            pedido.motivo_cancelacion = req.body.motivo_cancelacion || '';

            // Si el pedido tenía pago aprobado, marcar para reembolso
            let requiereReembolso = false;
            if (pedido.pagos && pedido.pagos.getItems().some(p => p.estado === 'aprobado')) {
                requiereReembolso = true;
                // Aquí podrías crear una solicitud de reembolso en tu sistema
            }

            // Enviar email de cancelación
            try {
                const usuario = pedido.usuarios.getItems()[0];
                if (usuario && usuario.mail) {
                    emailEnviado = await EmailService.enviarEmailCancelacionPedido(
                        usuario.mail,
                        pedido.id,
                        pedido.motivo_cancelacion || '',
                        requiereReembolso
                    );
                }
            } catch (emailError) {
                console.error('❌ Error al enviar email de cancelación:', emailError);
            }

            await em.flush();

            // Recargar para respuesta
            const pedidoActualizado = await em.findOneOrFail(Pedido, { id }, { 
                populate: ['usuarios', 'lineasPed', 'lineasPed.productos', 'pagos', 'transportista'] 
            });

            return res.status(200).json({ 
                message: 'pedido cancelado', 
                data: pedidoActualizado,
                emailEnviado,
                requiereReembolso
            });
        }

        // Si se está asignando un transportista, cambiar estado a 'entregado'
        if (req.body.transportista) {
            const transportista = await em.findOneOrFail(Transportista, { id: req.body.transportista });
            pedido.transportista = transportista;
            pedido.estado = 'entregado'; // Cuando se asigna transportista, pasa a entregado
            
            // Enviar email de notificación de envío
            try {
                const usuario = pedido.usuarios.getItems()[0];
                if (usuario && usuario.mail) {
                    emailEnviado = await EmailService.enviarEmailEstadoPedido(
                        usuario.mail,
                        pedido.id,
                        'entregado',
                        { nombre: transportista.nombre, contacto: transportista.contacto }
                    );
                }
            } catch (emailError) {
                console.error('❌ Error al enviar email de estado:', emailError);
            }
        }

        // Actualizar otros campos
        if (req.body.estado) {
            // Si el estado se cambia a 'completado' desde 'pago_aprobado', significa que se aprobó retiro en sucursal
            if (req.body.estado === 'completado' && estadoAnterior === 'pago_aprobado') {
                // Enviar email de confirmación de retiro en sucursal
                try {
                    const usuario = pedido.usuarios.getItems()[0];
                    if (usuario && usuario.mail) {
                        emailEnviado = await EmailService.enviarEmailEstadoPedido(
                            usuario.mail,
                            pedido.id,
                            'retiro_aprobado'
                        );
                    }
                } catch (emailError) {
                    console.error('❌ Error al enviar email de retiro:', emailError);
                }
            }
            
            pedido.estado = req.body.estado;
            
            // Enviar email si el estado cambió (y no se envió ya por transportista)
            if (estadoAnterior !== req.body.estado && !emailEnviado) {
                try {
                    const usuario = pedido.usuarios.getItems()[0];
                    if (usuario && usuario.mail) {
                        emailEnviado = await EmailService.enviarEmailEstadoPedido(
                            usuario.mail,
                            pedido.id,
                            req.body.estado
                        );
                    }
                } catch (emailError) {
                    console.error('❌ Error al enviar email de estado:', emailError);
                }
            }
        }

        await em.flush()
        
        // Recargar con todas las relaciones para la respuesta
        const pedidoActualizado = await em.findOneOrFail(Pedido, { id }, { 
            populate: ['usuarios', 'lineasPed', 'lineasPed.productos', 'pagos', 'transportista'] 
        });

        res.status(200).json({ 
            message: 'pedido updated', 
            data: pedidoActualizado,
            emailEnviado: emailEnviado 
        })
    }   catch (error:any) {
        res.status(500).json({ message: error.message })
    }  
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const pedido = em.getReference(Pedido, id)
        await em.removeAndFlush(pedido)
        res.status(200).send({ message: 'pedido removed' })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }
}

async function finalizarPedido(req: AuthRequest, res: Response) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Usuario no autorizado' });
        }

        const { datosEnvio, datosPago, productos, total, tipoEntrega, sucursalId } = req.body;
        
        console.log('📋 === DATOS RECIBIDOS EN finalizarPedido ===');
        console.log('📋 datosEnvio:', JSON.stringify(datosEnvio, null, 2));
        console.log('📋 productos:', productos?.length || 0, 'productos');
        console.log('📋 total:', total);
        
        // Validar datos requeridos
        if (!datosEnvio || !datosPago || !productos || !total) {
            console.error('❌ Faltan datos requeridos');
            return res.status(400).json({ message: 'Faltan datos requeridos para procesar el pedido' });
        }

        // Validar email
        if (!datosEnvio.email) {
            console.error('❌ Email no presente en datosEnvio');
            return res.status(400).json({ message: 'El email es requerido para enviar la confirmación' });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(datosEnvio.email)) {
            console.error('❌ Formato de email inválido:', datosEnvio.email);
            return res.status(400).json({ message: 'El formato del email es inválido' });
        }

        // Validar dominios comunes para detectar errores de tipeo
        const emailLower = datosEnvio.email.toLowerCase();
        const dominiosCorrectos = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'];
        const dominioEmail = emailLower.split('@')[1];
        
        // Detectar errores comunes como "gmai.com" en lugar de "gmail.com"
        if (dominioEmail === 'gmai.com') {
            console.error('❌ Posible error de tipeo en email:', datosEnvio.email, '- ¿Quisiste decir gmail.com?');
            return res.status(400).json({ 
                message: 'Posible error en el email. ¿Quisiste decir gmail.com en lugar de gmai.com?',
                sugerencia: datosEnvio.email.replace('gmai.com', 'gmail.com')
            });
        }

        console.log('✅ Validaciones pasadas, email válido:', datosEnvio.email);

        // Obtener la entidad Usuario real desde la base de datos
        const usuarioEntity = await em.findOneOrFail(Usuario, { id: req.user.id });

        // Crear el pedido
        const pedido = new Pedido();
        pedido.fecha_pedido = new Date();
        pedido.total = total;
        pedido.tipo_entrega = tipoEntrega || datosEnvio.tipoEntrega || 'domicilio';
        pedido.estado = 'pendiente';
        pedido.usuarios.add(usuarioEntity);

        await em.persistAndFlush(pedido);

        // Crear las líneas de pedido y preparar datos para el email
        const productosEmail = [];
        for (const producto of productos) {
            const productoEntity = await em.findOneOrFail(Producto, { id: producto.id });
            
            const lineaPedido = new LineaPed();
            lineaPedido.cantidad = producto.cantidad.toString();
            lineaPedido.precio_unitario = producto.precio;
            lineaPedido.productos.add(productoEntity);
            lineaPedido.pedido = pedido;
            
            await em.persistAndFlush(lineaPedido);

            // Agregar datos del producto para el email
            productosEmail.push({
                nombre: productoEntity.nombre,
                cantidad: producto.cantidad,
                precio: producto.precio,
                imagen: productoEntity.imagen || undefined
            });
        }

        // Crear el pago con información más detallada
        const metodoPagoNumerico = datosPago.metodoPago === 'transferencia' ? 1 : 2; // 1 = transferencia, 2 = tarjeta
        const pago = new Pago();
        pago.estado = 'pendiente';
        pago.metodo_pago = metodoPagoNumerico;
        pago.monto = total;
        pago.fecha_pago = new Date();
        
        // Agregar información específica según el método de pago
        if (datosPago.metodoPago === 'transferencia') {
            pago.numero_referencia = `TRANSF-${pedido.id}-${Date.now()}`;
        } else if (datosPago.metodoPago === 'tarjeta') {
            // Para tarjetas, podríamos agregar información adicional si es necesario
            pago.numero_referencia = `CARD-${pedido.id}-${Date.now()}`;
        }
        
        pago.pedidos.add(pedido);
        pago.usuarios.add(usuarioEntity);

        await em.persistAndFlush(pago);

        // Recargar el pedido con todas las relaciones
        const pedidoCompleto = await em.findOneOrFail(Pedido, { id: pedido.id }, { 
            populate: ['usuarios', 'lineasPed', 'lineasPed.productos', 'pagos'] 
        });

        // Enviar email de confirmación
        let emailEnviado = false;
        try {
            console.log('📧 Intentando enviar email de confirmación...');
            console.log('📧 Datos del pedido:', {
                pedidoId: pedido.id,
                total: pedido.total,
                usuario: usuarioEntity.nombre + ' ' + usuarioEntity.apellido
            });
            console.log('📧 Datos de envío:', {
                nombre: datosEnvio.nombre,
                apellido: datosEnvio.apellido,
                email: datosEnvio.email,
                tipoEntrega: datosEnvio.tipoEntrega
            });
            console.log('📧 Productos para email:', productosEmail.length, 'productos');
            
            emailEnviado = await EmailService.enviarEmailConfirmacionPedido(
                usuarioEntity,
                pedidoCompleto,
                productosEmail,
                datosEnvio
            );
            
            if (emailEnviado) {
                console.log('✅ Email de confirmación enviado exitosamente');
            } else {
                console.log('⚠️ No se pudo enviar el email de confirmación');
            }
        } catch (emailError) {
            console.error('❌ Error al enviar email:', emailError);
            // No fallar la operación si el email falla
        }

        res.status(201).json({ 
            message: 'Pedido procesado exitosamente', 
            data: {
                pedido: pedidoCompleto,
                datosEnvio: datosEnvio,
                emailEnviado: emailEnviado
            }
        });
    } catch (error: any) {
        console.error('Error al procesar pedido:', error);
        res.status(500).json({ message: error.message });
    }
}

// Función para probar la configuración de email
async function testEmailConfig(req: AuthRequest, res: Response) {
    try {
        console.log('🧪 Iniciando test de configuración de email...');
        
        const configuracionOK = await EmailService.verificarConfiguracion();
        
        if (configuracionOK) {
            res.status(200).json({ 
                message: 'Configuración de email verificada correctamente',
                configurado: true,
                smtp: {
                    servicio: 'Gmail',
                    usuario: process.env.GMAIL_USER ? process.env.GMAIL_USER.substring(0, 3) + '***' : 'No configurado'
                }
            });
        } else {
            res.status(500).json({ 
                message: 'Error en la configuración de email',
                configurado: false,
                solucion: 'Verificar variables GMAIL_USER y GMAIL_APP_PASSWORD en .env'
            });
        }
    } catch (error: any) {
        console.error('❌ Error en test de email:', error);
        res.status(500).json({ 
            message: 'Error al verificar configuración de email',
            error: error.message,
            configurado: false
        });
    }
}

// Función para enviar email de prueba
async function testEmailSend(req: AuthRequest, res: Response) {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                message: 'Email requerido',
                ejemplo: { email: 'test@gmail.com' }
            });
        }

        console.log('🧪 Enviando email de prueba a:', email);
        
        const emailEnviado = await EmailService.enviarEmailPrueba(email);
        
        if (emailEnviado) {
            res.status(200).json({ 
                message: 'Email de prueba enviado exitosamente',
                destinatario: email,
                enviado: true
            });
        } else {
            res.status(500).json({ 
                message: 'Error al enviar email de prueba',
                destinatario: email,
                enviado: false
            });
        }
    } catch (error: any) {
        console.error('❌ Error en envío de prueba:', error);
        res.status(500).json({ 
            message: 'Error al enviar email de prueba',
            error: error.message,
            enviado: false
        });
    }
}



export {findAll, findOne, add, update, remove, finalizarPedido, testEmailConfig, testEmailSend}
