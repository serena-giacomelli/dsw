-- Script SQL para actualizar la tabla de pagos con los nuevos campos
-- Ejecutar este script para añadir los campos de gestión de pagos

-- Añadir nuevos campos a la tabla pago
ALTER TABLE pago 
ADD COLUMN monto DECIMAL(10,2) NULL,
ADD COLUMN fecha_pago DATETIME NULL,
ADD COLUMN comprobante_transferencia TEXT NULL,
ADD COLUMN numero_referencia VARCHAR(255) NULL,
ADD COLUMN comentarios_admin TEXT NULL,
ADD COLUMN fecha_aprobacion DATETIME NULL;

-- Actualizar el comentario de la tabla para documentar los cambios
ALTER TABLE pago COMMENT = 'Tabla de pagos con campos ampliados para gestión administrativa';

-- Crear índices para mejorar el rendimiento de las consultas
CREATE INDEX idx_pago_estado ON pago(estado);
CREATE INDEX idx_pago_metodo ON pago(metodo_pago);
CREATE INDEX idx_pago_fecha ON pago(fecha_pago);
CREATE INDEX idx_pago_referencia ON pago(numero_referencia);

-- Insertar algunos datos de ejemplo para testing (opcional)
-- Descomentar las siguientes líneas si quieres datos de prueba

/*
-- Ejemplo de pago por transferencia pendiente
INSERT INTO pago (estado, metodo_pago, monto, fecha_pago, numero_referencia) 
VALUES ('pendiente', 1, 150.00, NOW(), 'TRANSF-001-20250803');

-- Ejemplo de pago por tarjeta pendiente
INSERT INTO pago (estado, metodo_pago, monto, fecha_pago, numero_referencia) 
VALUES ('pendiente', 2, 225.50, NOW(), 'CARD-002-20250803');

-- Ejemplo de pago aprobado
INSERT INTO pago (estado, metodo_pago, monto, fecha_pago, numero_referencia, comentarios_admin, fecha_aprobacion) 
VALUES ('aprobado', 1, 89.99, DATE_SUB(NOW(), INTERVAL 1 DAY), 'TRANSF-003-20250802', 'Comprobante verificado correctamente', NOW());

-- Ejemplo de pago rechazado
INSERT INTO pago (estado, metodo_pago, monto, fecha_pago, numero_referencia, comentarios_admin, fecha_aprobacion) 
VALUES ('rechazado', 1, 320.00, DATE_SUB(NOW(), INTERVAL 2 DAY), 'TRANSF-004-20250801', 'Comprobante no válido - monto incorrecto', NOW());
*/

-- Verificar que los cambios se aplicaron correctamente
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'pago' 
ORDER BY ORDINAL_POSITION;
