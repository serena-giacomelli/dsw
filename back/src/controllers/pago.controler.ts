import {Request, Response} from 'express'
import { orm } from '../shared/db/orm.js';
import { Pago } from '../models/pago.entity.js';
import { Pedido } from '../models/pedido.entity.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { EmailService } from '../services/emailService.js';

const em  = orm.em

async function findAll(req: Request, res: Response) {
    try {
        const pagos = await em.find(Pago, {}, { 
            populate: ['pedidos', 'usuarios'] 
        })
        res.status(200).json({ message: 'found all pagos', data: pagos })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
}}


async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const pago = await em.findOneOrFail(Pago, { id }, { 
            populate: ['pedidos', 'usuarios'] 
        }) 
        res.status(200).json({ message: 'found one pago', data: pago })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }}

async function add(req: Request, res: Response) {
    try {
        const pago = em.create(Pago, req.body)
        await em.flush()
        res.status(201).json({ message: 'pago created', data: pago })
    } 
    catch (error:any) {
        res.status(500).json({ message: error.message })
    }}

 async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const pago = em.getReference(Pago, id)
        em.assign(pago, req.body)
        await em.flush()
        res.status(200).json({ message: 'pago updated', data: pago })
    }   catch (error:any) {
        res.status(500).json({ message: error.message })
    }  
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const pago = em.getReference(Pago, id)
        await em.removeAndFlush(pago)
        res.status(200).send({ message: 'pago removed' })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }
}

// Obtener pagos pendientes para administradores
async function obtenerPagosPendientes(req: AuthRequest, res: Response) {
    try {
        // Verificar que el usuario es admin
        if (req.user?.tipoUsuario !== 'admin') {
            return res.status(403).json({ message: 'Solo los administradores pueden ver los pagos pendientes' });
        }

        const pagosPendientes = await em.find(Pago, 
            { estado: 'pendiente' }, 
            { 
                populate: ['pedidos', 'usuarios', 'pedidos.usuarios'],
                orderBy: { fecha_pago: 'DESC' }
            }
        );

        res.status(200).json({ 
            message: 'Pagos pendientes obtenidos', 
            data: pagosPendientes 
        });
    } catch (error: any) {
        console.error('Error al obtener pagos pendientes:', error);
        res.status(500).json({ message: error.message });
    }
}

// Aprobar un pago
async function aprobarPago(req: AuthRequest, res: Response) {
    try {
        // Verificar que el usuario es admin
        if (req.user?.tipoUsuario !== 'admin') {
            return res.status(403).json({ message: 'Solo los administradores pueden aprobar pagos' });
        }

        const pagoId = Number.parseInt(req.params.id);
        const { comentarios } = req.body;

        const pago = await em.findOneOrFail(Pago, { id: pagoId }, { 
            populate: ['pedidos', 'usuarios', 'pedidos.usuarios'] 
        });

        // Actualizar el estado del pago
        pago.estado = 'aprobado';
        pago.comentarios_admin = comentarios || 'Pago aprobado por el administrador';
        pago.fecha_aprobacion = new Date();

        // Actualizar los pedidos relacionados al aprobar el pago
        for (const pedido of pago.pedidos.getItems()) {
            if (pedido.estado === 'pendiente') {
                pedido.estado = 'pago_aprobado'; // Estado intermedio: pago aprobado, pendiente de gestión de entrega
            }
        }

        await em.flush();

        // Enviar notificación por email al usuario
        try {
            const usuario = pago.usuarios.getItems()[0];
            const pedido = pago.pedidos.getItems()[0];
            
            if (usuario && usuario.mail && pedido) {
                await EmailService.enviarEmailEstadoPago(
                    usuario.mail,
                    pedido.id,
                    'aprobado',
                    comentarios
                );
            }
        } catch (emailError) {
            console.error('❌ Error al enviar email de aprobación:', emailError);
        }

        res.status(200).json({ 
            message: 'Pago aprobado exitosamente', 
            data: pago 
        });
    } catch (error: any) {
        console.error('Error al aprobar pago:', error);
        res.status(500).json({ message: error.message });
    }
}

// Rechazar un pago
async function rechazarPago(req: AuthRequest, res: Response) {
    try {
        // Verificar que el usuario es admin
        if (req.user?.tipoUsuario !== 'admin') {
            return res.status(403).json({ message: 'Solo los administradores pueden rechazar pagos' });
        }

        const pagoId = Number.parseInt(req.params.id);
        const { comentarios } = req.body;

        if (!comentarios) {
            return res.status(400).json({ 
                message: 'Los comentarios son obligatorios al rechazar un pago' 
            });
        }

        const pago = await em.findOneOrFail(Pago, { id: pagoId }, { 
            populate: ['pedidos', 'usuarios', 'pedidos.usuarios'] 
        });

        // Actualizar el estado del pago
        pago.estado = 'rechazado';
        pago.comentarios_admin = comentarios;
        pago.fecha_aprobacion = new Date();

        // Actualizar los pedidos relacionados al rechazar el pago
        for (const pedido of pago.pedidos.getItems()) {
            if (pedido.estado === 'pendiente') {
                pedido.estado = 'cancelado'; // El pedido se cancela cuando se rechaza el pago
            }
        }

        await em.flush();

        // Enviar notificación por email al usuario
        try {
            const usuario = pago.usuarios.getItems()[0];
            const pedido = pago.pedidos.getItems()[0];
            
            if (usuario && usuario.mail && pedido) {
                await EmailService.enviarEmailEstadoPago(
                    usuario.mail,
                    pedido.id,
                    'rechazado',
                    comentarios
                );
            }
        } catch (emailError) {
            console.error('❌ Error al enviar email de rechazo:', emailError);
        }

        res.status(200).json({ 
            message: 'Pago rechazado', 
            data: pago 
        });
    } catch (error: any) {
        console.error('Error al rechazar pago:', error);
        res.status(500).json({ message: error.message });
    }
}


export {findAll, findOne, add, update, remove, obtenerPagosPendientes, aprobarPago, rechazarPago}
