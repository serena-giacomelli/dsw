# Gestión de Pagos - Guía para Administradores

## Descripción General

El sistema de gestión de pagos permite a los administradores aprobar o rechazar pagos de pedidos, tanto para transferencias bancarias como para pagos con tarjeta.

## Características Principales

### Estados de Pago
- **Pendiente** ⏳: Pago recién creado que requiere revisión
- **Aprobado** ✅: Pago verificado y aprobado por el administrador
- **Rechazado** ❌: Pago rechazado por el administrador con motivo

### Métodos de Pago Soportados
1. **Transferencia Bancaria** (ID: 1)
   - Los clientes reciben datos bancarios por email
   - Deben enviar comprobante de transferencia
   - Requiere verificación manual del administrador

2. **Tarjeta de Crédito/Débito** (ID: 2)
   - Procesamiento automático inicial
   - Puede requerir verificación adicional
   - Administrador puede aprobar/rechazar según políticas de la empresa

## Flujo de Trabajo

### Para Transferencias Bancarias
1. **Cliente realiza pedido**: Selecciona transferencia como método de pago
2. **Email automático**: Cliente recibe datos bancarios (CBU, Alias, etc.)
3. **Cliente transfiere**: Realiza la transferencia y puede enviar comprobante
4. **Administrador revisa**: Verifica el comprobante y monto
5. **Aprobación de pago**: Admin aprueba el pago → Pedido pasa a "Pago Aprobado"
6. **Gestión de entrega**: 
   - Si es **domicilio**: Admin asigna transportista → Pedido pasa a "Entregado"
   - Si es **sucursal**: Admin aprueba retiro → Pedido pasa a "Completado"
7. **Notificación**: Cliente recibe email en cada paso

### Para Pagos con Tarjeta
1. **Cliente realiza pedido**: Selecciona tarjeta como método de pago
2. **Procesamiento inicial**: Sistema procesa la información
3. **Administrador revisa**: Verifica si es necesario según políticas
4. **Aprobación de pago**: Admin aprueba el pago → Pedido pasa a "Pago Aprobado"
5. **Gestión de entrega**: Mismo proceso que transferencias
6. **Notificación**: Cliente recibe email en cada paso

## Estados de Pedidos

- **Pendiente** ⏳: Esperando confirmación/aprobación de pago
- **Pago Aprobado** 💜: Pago confirmado, requiere gestión de entrega
- **Entregado** 🚚: Asignado a transportista, en camino al cliente
- **Completado** ✅: Finalizado (retiro confirmado o entrega confirmada por cliente)
- **Cancelado** ❌: Cancelado por cliente o por rechazo de pago

## Cómo Usar la Interfaz de Administración

### Acceder a Gestión de Pagos
1. Ingresar al panel de administración
2. Ir a "Gestión de Pedidos"
3. Hacer clic en "Mostrar Gestión de Pagos"
4. Aparecerá la sección con pagos pendientes

### Revisar un Pago
Cada tarjeta de pago muestra:
- **ID del pago** y estado actual
- **Método de pago** (Transferencia/Tarjeta)
- **Monto** a pagar
- **Fecha** del pago
- **Información del pedido** asociado
- **Datos del cliente**
- **Número de referencia** (si aplica)

### Aprobar un Pago
1. Hacer clic en "✅ Aprobar"
2. Agregar comentarios opcionales
3. Confirmar la acción
4. El sistema:
   - Cambia el estado del pago a "aprobado"
   - Actualiza el pedido a "completado"
   - Envía email de confirmación al cliente

### Rechazar un Pago
1. Hacer clic en "❌ Rechazar"
2. **OBLIGATORIO**: Escribir el motivo del rechazo
3. Confirmar la acción
4. El sistema:
   - Cambia el estado del pago a "rechazado"
   - Cancela el pedido automáticamente
   - Envía email explicativo al cliente

## Datos Bancarios Configurados

Los clientes reciben esta información para transferencias:

```
Banco: Banco Nación
CBU: 1234567890123456789012
Alias: TIENDA.LUSECHI.MP
Titular: Lusechi S.A.
CUIT: 30-12345678-9
```

⚠️ **Importante**: Actualizar estos datos en el archivo `emailService.ts` según la información real de la empresa.

## Consejos para Administradores

### ✅ Buenas Prácticas
- **Verificar montos**: Asegurarse que el monto transferido coincida exactamente
- **Revisar comprobantes**: Validar que los comprobantes sean legítimos
- **Comentarios claros**: Al rechazar, explicar claramente el motivo
- **Respuesta rápida**: Procesar pagos dentro de 24-48 horas
- **Comunicación**: Mantener al cliente informado del proceso

### ⚠️ Casos que Requieren Atención
- **Montos incorrectos**: Diferencia entre lo pedido y lo transferido
- **Comprobantes dudosos**: Imágenes poco claras o información inconsistente
- **Transferencias tardías**: Pagos realizados mucho después del pedido
- **Datos incorrectos**: Información del transferente que no coincide

### 🚨 Motivos Comunes de Rechazo
- "Monto transferido incorrecto - se esperaba $X, se recibió $Y"
- "Comprobante de transferencia no válido o ilegible"
- "No se encontró la transferencia en el sistema bancario"
- "Datos del transferente no coinciden con el cliente"
- "Transferencia realizada fuera del plazo establecido"

## Notificaciones por Email

### Email de Aprobación
- ✅ Confirmación de pago aprobado
- Información del pedido que será procesado
- Comentarios del administrador (si los hay)
- Próximos pasos en el proceso

### Email de Rechazo
- ❌ Notificación de pago rechazado
- Motivo detallado del rechazo
- Información de contacto para consultas
- Invitación a realizar una nueva compra

## Resolución de Problemas

### Si un Cliente No Recibe Emails
1. Verificar que el email esté configurado en `.env`
2. Revisar la bandeja de spam del cliente
3. Confirmar que el email del cliente sea correcto
4. Usar la función de "Test de Email" en el sistema

### Si No Aparecen Pagos Pendientes
1. Verificar que hay pedidos con pagos pendientes
2. Actualizar la página
3. Revisar que el usuario tenga permisos de administrador
4. Verificar la conexión con la base de datos

### Si Hay Errores al Aprobar/Rechazar
1. Verificar conexión a internet
2. Revisar permisos de administrador
3. Recargar la página e intentar nuevamente
4. Verificar logs del servidor para errores específicos

## Configuración Técnica

### Variables de Entorno Requeridas
```
GMAIL_USER=tu-email@gmail.com
GMAIL_APP_PASSWORD=tu-contraseña-de-aplicacion
```

### Permisos Necesarios
- Usuario debe tener `tipoUsuario = 'admin'` en la base de datos
- Token de autenticación válido
- Acceso a las rutas protegidas del backend

## Contacto de Soporte

Para problemas técnicos o consultas sobre el sistema:
- 📧 Email: soporte@lusechi.com
- 📱 WhatsApp: +54 9 11 1234-5678
- 🌐 Portal de soporte: https://soporte.lusechi.com
