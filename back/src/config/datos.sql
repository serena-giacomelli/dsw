-- Usuarios
INSERT INTO Usuario (nombre, apellido, dni, fecha_nacimiento, mail)
VALUES 
('Juan', 'Pérez', '12345678', '1985-06-15', 'juan.perez@example.com'),
('Ana', 'Gómez', '87654321', '1990-03-22', 'ana.gomez@example.com'),
('Luis', 'Martínez', '11223344', '1975-12-10', 'luis.martinez@example.com');

-- Transportistas
INSERT INTO Transportista (nombre, contacto)
VALUES 
('Transportes Rapidos', '1234-567890'),
('Envíos Seguros', '5678-123456'),
('Movilidad Express', '8765-432198');

-- Tipos de Productos
INSERT INTO TipoProducto (nombre, descripcion)
VALUES 
('Muebles de oficina', 'Muebles para oficina como escritorios, sillas, estantes, etc.'),
('Muebles de hogar', 'Muebles para el hogar como sofás, camas, mesas, etc.'),
('Muebles exteriores', 'Muebles para uso en jardines y patios.');

-- Productos
INSERT INTO Producto (nombre, descripcion, cantidad, id_tipo_producto)
VALUES 
('Escritorio Moderno', 'Escritorio de madera para oficina', 10, 1),
('Sofá de cuero', 'Sofá de cuero para sala de estar', 5, 2),
('Mesa de jardín', 'Mesa para exteriores, resistente al agua', 12, 3);

-- Empresas
INSERT INTO Empresa (nombre_emp, razon_social, cuil, sitio_web)
VALUES 
('Muebles Internacionales', 'Muebles S.A.', '30-12345678-9', 'www.mueblesint.com'),
('Hogar y Estilo', 'Estilos Hogar S.R.L.', '30-87654321-7', 'www.hogaryestilo.com');

-- Provincias
INSERT INTO Provincia (nombre)
VALUES 
('Buenos Aires'),
('Córdoba'),
('Santa Fe');

-- Localidades
INSERT INTO Localidad (nombre, id_provincia)
VALUES 
('Mar del Plata', 1),
('Córdoba Capital', 2),
('Rosario', 3);

-- Marcas
INSERT INTO Marca (nombre_mar, cuil, telefono, id_emp)
VALUES 
('Estilo Moderno', '30-12312312-9', '1234-5678', 1),
('Confort y Diseño', '30-98798798-7', '4321-8765', 2);

-- Sucursales
INSERT INTO Sucursal (direccion, contacto, id_localidad, id_mar)
VALUES 
('Av. Colón 1234, Mar del Plata', 'contacto1@muebles.com', 1, 1),
('Calle Principal 4321, Córdoba Capital', 'contacto2@muebles.com', 2, 2);

-- Pedidos
INSERT INTO Pedido (fecha_pedido, total, tipo_entrega, estado, id_usuario, id_transportista)
VALUES 
('2023-09-15', 1500.00, 'Envío a domicilio', 'Pendiente', 1, 1),
('2023-09-20', 2000.00, 'Retiro en sucursal', 'Completado', 2, 2);

-- Pagos
INSERT INTO Pago (metodo_pago, estado, id_usuario, id_pedido)
VALUES 
('Tarjeta de Crédito', 'Aprobado', 1, 1),
('Efectivo', 'Completado', 2, 2);

-- Líneas de Pedido
INSERT INTO LineaPedido (cant, precio_unitario, id_pedido, id_producto)
VALUES 
(2, 750.00, 1, 1),
(1, 2000.00, 2, 2);


##########nuevos datos
-- Nuevos Usuarios
INSERT INTO Usuario (nombre, apellido, dni, fecha_nacimiento, mail)
VALUES 
('Carlos', 'López', '33445566', '1982-11-03', 'carlos.lopez@example.com'),
('Marta', 'Rodríguez', '55443322', '1995-08-17', 'marta.rodriguez@example.com'),
('Sofía', 'Fernández', '66557788', '2000-02-10', 'sofia.fernandez@example.com');

-- Nuevos Transportistas
INSERT INTO Transportista (nombre, contacto)
VALUES 
('Logística Total', '5555-666677'),
('Entregas Rápidas', '6666-777788'),
('Distribución Global', '7777-888899');

-- Nuevos Tipos de Productos
INSERT INTO TipoProducto (nombre, descripcion)
VALUES 
('Muebles de cocina', 'Muebles como alacenas, mesadas, islas de cocina.'),
('Muebles de dormitorio', 'Muebles como camas, mesas de luz, roperos.');

-- Nuevos Productos
INSERT INTO Producto (nombre, descripcion, cantidad, id_tipo_producto)
VALUES 
('Alacena de madera', 'Alacena de madera para cocina', 8, 4),
('Cama matrimonial', 'Cama matrimonial con somier incluido', 6, 5),
('Mesa de luz', 'Mesa de luz con dos cajones', 15, 5);

-- Nuevas Empresas
INSERT INTO Empresa (nombre_emp, razon_social, cuil, sitio_web)
VALUES 
('Muebles Innovadores', 'Innovadores S.R.L.', '30-54321098-1', 'www.innovadores.com'),
('Diseños Vanguardistas', 'Vanguardia S.A.', '30-23456789-0', 'www.vanguardia.com');

-- Nuevas Provincias
INSERT INTO Provincia (nombre)
VALUES 
('Mendoza'),
('Salta');

-- Nuevas Localidades
INSERT INTO Localidad (nombre, id_provincia)
VALUES 
('Mendoza Capital', 4),
('Salta Capital', 5);

-- Nuevas Marcas
INSERT INTO Marca (nombre_mar, cuil, telefono, id_emp)
VALUES 
('Vanguardia Moderna', '30-99887766-5', '1234-9999', 3),
('Estilo Contemporáneo', '30-55667788-4', '5678-8888', 4);

-- Nuevas Sucursales
INSERT INTO Sucursal (direccion, contacto, id_localidad, id_mar)
VALUES 
('Calle Las Heras 4321, Mendoza Capital', 'contacto3@muebles.com', 4, 3),
('Av. Belgrano 9876, Salta Capital', 'contacto4@muebles.com', 5, 4);

-- Nuevos Pedidos
INSERT INTO Pedido (fecha_pedido, total, tipo_entrega, estado, id_usuario, id_transportista)
VALUES 
('2023-09-25', 3200.00, 'Envío a domicilio', 'Pendiente', 3, 3),
('2023-10-01', 4800.00, 'Retiro en sucursal', 'Completado', 4, 4);

-- Nuevos Pagos
INSERT INTO Pago (metodo_pago, estado, id_usuario, id_pedido)
VALUES 
('Transferencia Bancaria', 'Aprobado', 3, 3),
('Tarjeta de Débito', 'Completado', 4, 4);

-- Nuevas Líneas de Pedido
INSERT INTO LineaPedido (cant, precio_unitario, id_pedido, id_producto)
VALUES 
(1, 3200.00, 3, 3),
(2, 2400.00, 4, 5);

-- Más Usuarios
INSERT INTO Usuario (nombre, apellido, dni, fecha_nacimiento, mail)
VALUES 
('Ricardo', 'González', '77889900', '1992-04-08', 'ricardo.gonzalez@example.com'),
('Laura', 'Suárez', '99112233', '1987-09-21', 'laura.suarez@example.com'),
('Federico', 'Ramírez', '44332211', '1970-06-12', 'federico.ramirez@example.com');

-- Más Transportistas
INSERT INTO Transportista (nombre, contacto)
VALUES 
('Envios Premium', '8888-777711'),
('Delivery Fácil', '9999-222211'),
('Cargas Rápidas', '1010-333344');

-- Más Tipos de Productos
INSERT INTO TipoProducto (nombre, descripcion)
VALUES 
('Muebles infantiles', 'Muebles para niños, como camas, escritorios, y estantes.'),
('Muebles de sala', 'Muebles como mesas de centro, estanterías, y sillones.');

-- Más Productos
INSERT INTO Producto (nombre, descripcion, cantidad, id_tipo_producto)
VALUES 
('Cama infantil', 'Cama para niños con baranda de seguridad', 7, 6),
('Escritorio infantil', 'Escritorio para niños con cajoneras', 10, 6),
('Mesa de centro', 'Mesa de centro de madera para sala de estar', 12, 7),
('Estantería modular', 'Estantería modular para sala de estar', 6, 7);

-- Más Empresas
INSERT INTO Empresa (nombre_emp, razon_social, cuil, sitio_web)
VALUES 
('Muebles Clásicos', 'Clásicos Hogar S.A.', '30-55556666-7', 'www.clasicoshogar.com'),
('Diseños Funcionales', 'Funcionales S.A.', '30-22221111-3', 'www.funcionales.com');

-- Más Provincias
INSERT INTO Provincia (nombre)
VALUES 
('Neuquén'),
('Tucumán');

-- Más Localidades
INSERT INTO Localidad (nombre, id_provincia)
VALUES 
('Neuquén Capital', 6),
('San Miguel de Tucumán', 7);

-- Más Marcas
INSERT INTO Marca (nombre_mar, cuil, telefono, id_emp)
VALUES 
('Diseño y Confort', '30-12345432-9', '9876-1234', 5),
('Innovación Estilo', '30-87654322-5', '4321-5678', 6);

-- Más Sucursales
INSERT INTO Sucursal (direccion, contacto, id_localidad, id_mar)
VALUES 
('Ruta 22 km 1234, Neuquén Capital', 'contacto5@muebles.com', 6, 5),
('Av. Sarmiento 5566, San Miguel de Tucumán', 'contacto6@muebles.com', 7, 6);

-- Más Pedidos
INSERT INTO Pedido (fecha_pedido, total, tipo_entrega, estado, id_usuario, id_transportista)
VALUES 
('2023-10-05', 2200.00, 'Envío a domicilio', 'Pendiente', 5, 5),
('2023-10-08', 3800.00, 'Retiro en sucursal', 'Completado', 6, 6),
('2023-10-10', 1500.00, 'Envío a domicilio', 'Pendiente', 7, 4);

-- Más Pagos
INSERT INTO Pago (metodo_pago, estado, id_usuario, id_pedido)
VALUES 
('Tarjeta de Crédito', 'Aprobado', 5, 5),
('Efectivo', 'Completado', 6, 6),
('Transferencia Bancaria', 'Aprobado', 7, 7);

-- Más Líneas de Pedido
INSERT INTO LineaPedido (cant, precio_unitario, id_pedido, id_producto)
VALUES 
(1, 2200.00, 5, 7),
(2, 1900.00, 6, 9),
(1, 1500.00, 7, 8);



####mas datos
-- Nuevos Tipos de Productos
INSERT INTO TipoProducto (nombre, descripcion)
VALUES 
('Muebles de baño', 'Muebles diseñados para uso en baños, como vanidades y estanterías.'),
('Muebles de almacenamiento', 'Muebles diseñados para el almacenamiento, como baúles y estanterías.');

-- Nuevos Productos
INSERT INTO Producto (nombre, descripcion, cantidad, id_tipo_producto)
VALUES 
('Vanidad de baño', 'Vanidad de baño con lavabo incluido', 10, 6),
('Estantería de almacenamiento', 'Estantería alta para almacenamiento', 15, 7),
('Baúl decorativo', 'Baúl decorativo de madera para almacenamiento', 8, 7),
('Mueble de baño moderno', 'Mueble de baño contemporáneo con espejo', 5, 6);

-- Nuevos Pedidos
INSERT INTO Pedido (fecha_pedido, total, tipo_entrega, estado, id_usuario, id_transportista)
VALUES 
('2023-10-20', 3500.00, 'Envío a domicilio', 'Pendiente', 1, 1),
('2023-10-22', 2700.00, 'Retiro en sucursal', 'Completado', 2, 2),
('2023-10-25', 4000.00, 'Envío a domicilio', 'Pendiente', 3, 3);

INSERT INTO Pago (metodo_pago, estado, id_usuario, id_pedido)
VALUES 
('Efectivo', 'Pendiente', 1, 1), 
('Tarjeta de Crédito', 'Aprobado', 2, 2), 
('Transferencia Bancaria', 'Aprobado', 3, 3); 

-- Nuevas Líneas de Pedido
INSERT INTO LineaPedido (cant, precio_unitario, id_pedido, id_producto)
VALUES 
(2, 1750.00, 10, 11),  
(1, 2700.00, 7, 12),  
(3, 1000.00, 2, 13);  