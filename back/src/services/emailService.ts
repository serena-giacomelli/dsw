import nodemailer from 'nodemailer';
import { Usuario } from '../models/usuarios.entity.js';
import { Pedido } from '../models/pedido.entity.js';
import { LineaPed } from '../models/lineaPed.entity.js';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD 
  },
  debug: true, // Habilitar debug
  logger: true // Habilitar logs detallados
});

// Datos de transferencia bancaria (configúralos según tu empresa)
const DATOS_TRANSFERENCIA = {
  banco: 'Banco Nación',
  cbu: '1234567890123456789012',
  alias: 'TIENDA.LUSECHI.MP',
  titular: 'Lusechi S.A.',
  cuit: '30-12345678-9'
};

interface DatosEnvio {
  nombre: string;
  apellido: string;
  email: string;
  direccion?: string;
  ciudad?: string;
  telefono?: string;
  tipoEntrega: 'domicilio' | 'sucursal';  // Cambiado a minúsculas para coincidir con frontend
}

interface ProductoEmail {
  nombre: string;
  cantidad: number;
  precio: number;
  imagen?: string;
}

export class EmailService {
  static async verificarConfiguracion(): Promise<boolean> {
    try {
      console.log('🔍 Verificando configuración de email...');
      console.log('📧 Usuario Gmail:', process.env.GMAIL_USER || 'NO CONFIGURADO');
      console.log('🔑 Contraseña:', process.env.GMAIL_APP_PASSWORD ? 'CONFIGURADA (longitud: ' + process.env.GMAIL_APP_PASSWORD.length + ')' : 'NO CONFIGURADA');
      
      await transporter.verify();
      console.log('✅ Configuración de email verificada correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error en configuración de email:', error);
      
      // Dar más información específica del error
      if (error instanceof Error) {
        if (error.message.includes('Invalid login')) {
          console.error('🚨 ERROR: Credenciales inválidas. Verifica:');
          console.error('  - Email correcto');
          console.error('  - Contraseña de aplicación (no la contraseña normal)');
          console.error('  - Verificación en 2 pasos habilitada');
        } else if (error.message.includes('Missing credentials')) {
          console.error('🚨 ERROR: Faltan credenciales en .env');
        }
      }
      
      return false;
    }
  }

  static generarHTMLPedido(
    usuario: Usuario,
    pedido: Pedido,
    productos: ProductoEmail[],
    datosEnvio: DatosEnvio
  ): string {
    const total = pedido.total;
    const fechaPedido = new Date(pedido.fecha_pedido).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const productosHTML = productos.map(producto => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 15px; border-right: 1px solid #eee;">
          <div style="display: flex; align-items: center;">
            ${producto.imagen ? 
              `<img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 15px; border-radius: 5px;">` : 
              `<div style="width: 50px; height: 50px; background-color: #f0f0f0; margin-right: 15px; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #666;">Sin imagen</div>`
            }
            <strong>${producto.nombre}</strong>
          </div>
        </td>
        <td style="padding: 15px; text-align: center; border-right: 1px solid #eee;">${producto.cantidad}</td>
        <td style="padding: 15px; text-align: center; border-right: 1px solid #eee;">$${producto.precio.toFixed(2)}</td>
        <td style="padding: 15px; text-align: center; font-weight: bold;">$${(producto.cantidad * producto.precio).toFixed(2)}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Pedido - Lusechi</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <!-- Header -->
        <div style="background-color: #2c3e50; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">¡Pedido Confirmado!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Gracias por tu compra en Lusechi</p>
        </div>

        <!-- Información del pedido -->
        <div style="background-color: #f8f9fa; padding: 25px; border-left: 4px solid #27ae60;">
          <h2 style="margin-top: 0; color: #2c3e50;">Detalles de tu Pedido</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <p><strong>Número de Pedido:</strong> #${pedido.id}</p>
            <p><strong>Fecha:</strong> ${fechaPedido}</p>
            <p><strong>Cliente:</strong> ${datosEnvio.nombre} ${datosEnvio.apellido}</p>
            <p><strong>Email:</strong> ${datosEnvio.email}</p>
            <p><strong>Tipo de Entrega:</strong> ${datosEnvio.tipoEntrega === 'domicilio' ? 'Entrega a domicilio' : 'Retiro en sucursal'}</p>
            ${datosEnvio.tipoEntrega === 'domicilio' && datosEnvio.direccion ? 
              `<p><strong>Dirección:</strong> ${datosEnvio.direccion}, ${datosEnvio.ciudad || ''}</p>` : ''
            }
          </div>
        </div>

        <!-- Productos -->
        <div style="background-color: white; padding: 25px; border: 1px solid #ddd;">
          <h3 style="margin-top: 0; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Productos Pedidos</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <thead>
              <tr style="background-color: #f1f2f6;">
                <th style="padding: 15px; text-align: left; border-bottom: 2px solid #ddd;">Producto</th>
                <th style="padding: 15px; text-align: center; border-bottom: 2px solid #ddd;">Cantidad</th>
                <th style="padding: 15px; text-align: center; border-bottom: 2px solid #ddd;">Precio Unit.</th>
                <th style="padding: 15px; text-align: center; border-bottom: 2px solid #ddd;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${productosHTML}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px; text-align: right;">
            <h3 style="margin: 0; color: #27ae60; font-size: 24px;">Total: $${total.toFixed(2)}</h3>
          </div>
        </div>

        <!-- Datos de transferencia -->
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 25px; border-radius: 5px; margin-top: 20px;">
          <h3 style="margin-top: 0; color: #856404; display: flex; align-items: center;">
            💳 Datos para Transferencia Bancaria
          </h3>
          <div style="background-color: white; padding: 20px; border-radius: 5px; border: 1px solid #ffd32a;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <p style="margin: 5px 0;"><strong>Banco:</strong> ${DATOS_TRANSFERENCIA.banco}</p>
              <p style="margin: 5px 0;"><strong>Titular:</strong> ${DATOS_TRANSFERENCIA.titular}</p>
              <p style="margin: 5px 0;"><strong>CBU:</strong> ${DATOS_TRANSFERENCIA.cbu}</p>
              <p style="margin: 5px 0;"><strong>Alias:</strong> ${DATOS_TRANSFERENCIA.alias}</p>
              <p style="margin: 5px 0;"><strong>CUIT:</strong> ${DATOS_TRANSFERENCIA.cuit}</p>
              <p style="margin: 5px 0;"><strong>Importe:</strong> <span style="font-size: 18px; color: #27ae60; font-weight: bold;">$${total.toFixed(2)}</span></p>
            </div>
          </div>
          <div style="margin-top: 15px; padding: 15px; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px;">
            <p style="margin: 0; color: #721c24; font-weight: bold;">⚠️ Importante:</p>
            <p style="margin: 5px 0 0 0; color: #721c24;">Una vez realizada la transferencia, envía el comprobante por WhatsApp o email para procesar tu pedido.</p>
          </div>
        </div>

        <!-- Información adicional -->
        <div style="background-color: #e3f2fd; padding: 20px; border-radius: 5px; margin-top: 20px;">
          <h3 style="margin-top: 0; color: #1565c0;">📋 Próximos Pasos</h3>
          <ol style="color: #1565c0; padding-left: 20px;">
            <li>Realiza la transferencia bancaria por el monto exacto</li>
            <li>Envía el comprobante de transferencia</li>
            <li>Nos pondremos en contacto contigo para coordinar la entrega</li>
            <li>¡Disfruta tu compra!</li>
          </ol>
        </div>

        <!-- Footer -->
        <div style="background-color: #2c3e50; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; margin-top: 20px;">
          <p style="margin: 0; font-size: 16px;">Gracias por confiar en nosotros</p>
          <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.8;">
            Si tienes alguna duda, contáctanos: 
            <a href="mailto:ventas@lusechi.com" style="color: #3498db;">ventas@lusechi.com</a> | 
            📱 WhatsApp: +54 9 11 1234-5678
          </p>
        </div>

      </body>
      </html>
    `;
  }

  // Enviar email de confirmación de pedido
  static async enviarEmailConfirmacionPedido(
    usuario: Usuario,
    pedido: Pedido,
    productos: ProductoEmail[],
    datosEnvio: DatosEnvio
  ): Promise<boolean> {
    try {
      console.log('📧 === INICIO ENVÍO EMAIL CONFIRMACIÓN ===');
      console.log('📧 Destinatario:', datosEnvio.email);
      console.log('📧 Pedido ID:', pedido.id);
      console.log('📧 Nombre cliente:', datosEnvio.nombre, datosEnvio.apellido);
      console.log('📧 Tipo entrega:', datosEnvio.tipoEntrega);
      console.log('📧 Total productos:', productos.length);
      
      // Verificar configuración antes de enviar
      const configuracionOK = await this.verificarConfiguracion();
      if (!configuracionOK) {
        console.error('❌ No se puede enviar email: configuración incorrecta');
        return false;
      }

      console.log('📧 Generando HTML del email...');
      const htmlContent = this.generarHTMLPedido(usuario, pedido, productos, datosEnvio);
      console.log('📧 HTML generado, longitud:', htmlContent.length, 'caracteres');

      const mailOptions = {
        from: {
          name: 'Lusechi - Tienda Online',
          address: process.env.GMAIL_USER || 'noreply@lusechi.com'
        },
        to: datosEnvio.email,
        subject: `✅ Confirmación de Pedido #${pedido.id} - Lusechi`,
        html: htmlContent,
        text: `Hola ${datosEnvio.nombre}!\n\nTu pedido #${pedido.id} ha sido confirmado exitosamente.\n\nTotal: $${pedido.total.toFixed(2)}\n\nDatos para transferencia:\nBanco: ${DATOS_TRANSFERENCIA.banco}\nCBU: ${DATOS_TRANSFERENCIA.cbu}\nAlias: ${DATOS_TRANSFERENCIA.alias}\nTitular: ${DATOS_TRANSFERENCIA.titular}\n\nGracias por tu compra!\n\nEquipo Lusechi`
      };

      console.log('📤 Enviando email...');
      console.log('📧 De:', mailOptions.from);
      console.log('📧 Para:', mailOptions.to);
      console.log('📧 Asunto:', mailOptions.subject);

      const info = await transporter.sendMail(mailOptions);
      console.log('✅ === EMAIL ENVIADO EXITOSAMENTE ===');
      console.log('📧 Message ID:', info.messageId);
      console.log('📧 Destinatario confirmado:', datosEnvio.email);
      console.log('📧 Response:', info.response);
      
      return true;
    } catch (error) {
      console.error('❌ === ERROR AL ENVIAR EMAIL ===');
      console.error('❌ Error completo:', error);
      
      // Información más detallada del error
      if (error instanceof Error) {
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
        
        if (error.message.includes('Invalid login')) {
          console.error('🚨 Problema de autenticación - revisa credenciales Gmail');
        } else if (error.message.includes('Recipient address rejected')) {
          console.error('🚨 Email destinatario inválido:', datosEnvio.email);
        } else if (error.message.includes('Connection timeout')) {
          console.error('🚨 Problema de conexión a internet');
        }
      }
      
      return false;
    }
  }

  // Enviar email de notificación de estado de pago
  static async enviarEmailEstadoPago(
    email: string,
    pedidoId: number,
    estadoPago: string,
    comentarios?: string
  ): Promise<boolean> {
    try {
      const configuracionOK = await this.verificarConfiguracion();
      if (!configuracionOK) return false;

      let mensaje = '';
      let asunto = '';
      let htmlContent = '';

      switch (estadoPago.toLowerCase()) {
        case 'aprobado':
          asunto = `✅ Pago Aprobado - Pedido #${pedidoId} - Lusechi`;
          mensaje = `¡Excelente noticia! Tu pago para el pedido #${pedidoId} ha sido aprobado.\n\nTu pedido será procesado y enviado en breve.${comentarios ? `\n\nComentarios del administrador: ${comentarios}` : ''}\n\n¡Gracias por tu compra!`;
          htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 5px; text-align: center;">
                <h2 style="color: #155724; margin-top: 0;">✅ Pago Aprobado</h2>
                <p style="color: #155724; font-size: 16px; margin: 15px 0;">
                  ¡Excelente noticia! Tu pago para el <strong>Pedido #${pedidoId}</strong> ha sido aprobado.
                </p>
                <p style="color: #155724;">Tu pedido será procesado y enviado en breve.</p>
                ${comentarios ? `<div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
                  <p style="color: #495057; margin: 0;"><strong>Comentarios del administrador:</strong></p>
                  <p style="color: #495057; margin: 5px 0 0 0;">${comentarios}</p>
                </div>` : ''}
                <p style="color: #155724; font-weight: bold;">¡Gracias por tu compra!</p>
              </div>
            </div>
          `;
          break;
        case 'rechazado':
          asunto = `❌ Pago Rechazado - Pedido #${pedidoId} - Lusechi`;
          mensaje = `Lamentamos informarte que tu pago para el pedido #${pedidoId} ha sido rechazado.\n\n${comentarios ? `Motivo: ${comentarios}\n\n` : ''}Tu pedido ha sido cancelado. Si consideras que esto es un error, por favor contáctanos.\n\nPuedes realizar una nueva compra cuando desees.`;
          htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 5px; text-align: center;">
                <h2 style="color: #721c24; margin-top: 0;">❌ Pago Rechazado</h2>
                <p style="color: #721c24; font-size: 16px; margin: 15px 0;">
                  Lamentamos informarte que tu pago para el <strong>Pedido #${pedidoId}</strong> ha sido rechazado.
                </p>
                ${comentarios ? `<div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
                  <p style="color: #495057; margin: 0;"><strong>Motivo del rechazo:</strong></p>
                  <p style="color: #495057; margin: 5px 0 0 0;">${comentarios}</p>
                </div>` : ''}
                <p style="color: #721c24;">Tu pedido ha sido cancelado automáticamente.</p>
                <p style="color: #721c24;">Si consideras que esto es un error, por favor contáctanos.</p>
                <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin: 15px 0;">
                  <p style="color: #0c5460; margin: 0;">
                    📞 Contáctanos: <a href="mailto:ventas@lusechi.com" style="color: #0c5460;">ventas@lusechi.com</a><br>
                    📱 WhatsApp: +54 9 11 1234-5678
                  </p>
                </div>
              </div>
            </div>
          `;
          break;
        default:
          return false;
      }

      const mailOptions = {
        from: {
          name: 'Lusechi - Tienda Online',
          address: process.env.GMAIL_USER || 'noreply@lusechi.com'
        },
        to: email,
        subject: asunto,
        html: htmlContent,
        text: mensaje
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Email de estado de pago enviado:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Error al enviar email de estado de pago:', error);
      return false;
    }
  }

  // Enviar email de notificación de estado de pedido
  static async enviarEmailEstadoPedido(
    email: string,
    pedidoId: number,
    nuevoEstado: string,
    transportista?: { nombre: string; contacto?: string }
  ): Promise<boolean> {
    try {
      const configuracionOK = await this.verificarConfiguracion();
      if (!configuracionOK) return false;

      let mensaje = '';
      let asunto = '';

      switch (nuevoEstado.toLowerCase()) {
        case 'entregado':
          asunto = `📦 Tu pedido #${pedidoId} está en camino - Lusechi`;
          mensaje = `Tu pedido #${pedidoId} ha sido enviado y está en camino.${transportista ? `\n\nTransportista: ${transportista.nombre}${transportista.contacto ? `\nContacto: ${transportista.contacto}` : ''}` : ''}\n\n¡Pronto lo tendrás en tus manos!`;
          break;
        case 'completado':
          asunto = `✅ Pedido #${pedidoId} completado - Lusechi`;
          mensaje = `Tu pedido #${pedidoId} ha sido completado exitosamente.\n\n¡Gracias por tu compra!`;
          break;
        case 'retiro_aprobado':
          asunto = `🏪 Pedido #${pedidoId} listo para retiro - Lusechi`;
          mensaje = `¡Excelente noticia! Tu pedido #${pedidoId} está listo para retiro en sucursal.\n\nPuedes pasar a retirarlo en nuestro horario de atención:\n- Lunes a Viernes: 9:00 - 18:00\n- Sábados: 9:00 - 13:00\n\nNo olvides traer tu DNI y el número de pedido.\n\n¡Te esperamos!`;
          break;
        case 'cancelado':
          asunto = `❌ Pedido #${pedidoId} cancelado - Lusechi`;
          mensaje = `Tu pedido #${pedidoId} ha sido cancelado.\n\nSi tienes dudas, contáctanos.`;
          break;
        default:
          return false;
      }

      const mailOptions = {
        from: {
          name: 'Lusechi - Tienda Online',
          address: process.env.GMAIL_USER || 'noreply@lusechi.com'
        },
        to: email,
        subject: asunto,
        text: mensaje
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Email de estado enviado:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Error al enviar email de estado:', error);
      return false;
    }
  }

  // Función específica para test de envío
  static async enviarEmailPrueba(destinatario: string): Promise<boolean> {
    try {
      console.log('🧪 Enviando email de prueba...');
      
      const configuracionOK = await this.verificarConfiguracion();
      if (!configuracionOK) {
        return false;
      }

      const mailOptions = {
        from: {
          name: 'Lusechi - Test',
          address: process.env.GMAIL_USER || 'noreply@lusechi.com'
        },
        to: destinatario,
        subject: '🧪 Test de Email - Lusechi',
        html: `
          <h2>✅ Test de Email Exitoso</h2>
          <p>Si recibes este email, la configuración está funcionando correctamente.</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
          <p><strong>Servidor:</strong> Gmail SMTP</p>
        `,
        text: `Test de Email - Si recibes este mensaje, la configuración está funcionando. Fecha: ${new Date().toLocaleString('es-ES')}`
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Email de prueba enviado:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Error en email de prueba:', error);
      return false;
    }
  }
}
