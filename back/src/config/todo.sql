CREATE USER IF NOT EXISTS 'lasLindas'@'%' IDENTIFIED BY 'Resentidas3';
GRANT ALL PRIVILEGES ON *.* TO 'lasLindas'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

drop schema if exists muebles;
create schema muebles;
use muebles;

CREATE TABLE Usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    dni VARCHAR(20),
    fecha_nacimiento DATE,
    mail VARCHAR(100)
);

CREATE TABLE Transportista (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    contacto VARCHAR(100)
);

CREATE TABLE TipoProducto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    descripcion TEXT
);

CREATE TABLE Producto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    descripcion TEXT,
    cantidad INT,
    precio double,
    id_tipo_producto INT,
    FOREIGN KEY (id_tipo_producto) REFERENCES TipoProducto(id)
);

CREATE TABLE Empresa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_emp VARCHAR(100),
    razon_social VARCHAR(100),
    cuil VARCHAR(20),
    sitio_web VARCHAR(100)
);

CREATE TABLE Provincia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100)
);

CREATE TABLE Localidad (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    id_provincia INT,
    FOREIGN KEY (id_provincia) REFERENCES Provincia(id)
);

CREATE TABLE Marca (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_mar VARCHAR(100),
    cuil VARCHAR(20),
    telefono VARCHAR(20),
    id_emp INT,
    FOREIGN KEY (id_emp) REFERENCES Empresa(id)
);

CREATE TABLE Sucursal (
    id INT PRIMARY KEY AUTO_INCREMENT,
    direccion VARCHAR(200),
    contacto VARCHAR(100),
    id_localidad INT,
    id_mar INT,
    FOREIGN KEY (id_localidad) REFERENCES Localidad(id),
	FOREIGN KEY (id_mar) REFERENCES Marca(id)
);

CREATE TABLE Pedido (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fecha_pedido DATE,
    total DECIMAL(10, 2),
    tipo_entrega VARCHAR(50),
    estado VARCHAR(20),
    id_usuario INT,
    id_transportista INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id),
    FOREIGN KEY (id_transportista) REFERENCES Transportista(id)
);

CREATE TABLE Pago (
    id INT PRIMARY KEY AUTO_INCREMENT,
    metodo_pago VARCHAR(50),
    estado VARCHAR(20),
    id_usuario INT,
    id_pedido INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id),
    FOREIGN KEY (id_pedido) REFERENCES Pedido(id)
);

CREATE TABLE LineaPedido (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cant INT,
    precio_unitario DECIMAL(10, 2),
    id_pedido INT,
    id_producto INT,
    FOREIGN KEY (id_pedido) REFERENCES Pedido(id),
    FOREIGN KEY (id_producto) REFERENCES Producto(id)
);

-- ###############################
-- Sección 1: Inserción de Usuarios
-- ###############################
INSERT INTO Usuario (nombre, apellido, dni, fecha_nacimiento, mail)
VALUES 
('Juan', 'Pérez', '12345678', '1985-06-15', 'juan.perez@example.com'),
('Ana', 'Gómez', '87654321', '1990-03-22', 'ana.gomez@example.com'),
('Luis', 'Martínez', '11223344', '1975-12-10', 'luis.martinez@example.com'),
('Carlos', 'López', '33445566', '1982-11-03', 'carlos.lopez@example.com'),
('Marta', 'Rodríguez', '55443322', '1995-08-17', 'marta.rodriguez@example.com'),
('Sofía', 'Fernández', '66557788', '2000-02-10', 'sofia.fernandez@example.com'),
('Ricardo', 'González', '77889900', '1992-04-08', 'ricardo.gonzalez@example.com'),
('Laura', 'Suárez', '99112233', '1987-09-21', 'laura.suarez@example.com'),
('Federico', 'Ramírez', '44332211', '1970-06-12', 'federico.ramirez@example.com');

-- ###############################
-- Sección 2: Inserción de Transportistas
-- ###############################
INSERT INTO Transportista (nombre, contacto)
VALUES 
('Transportes Rapidos', '1234-567890'),
('Envíos Seguros', '5678-123456'),
('Movilidad Express', '8765-432198'),
('Logística Total', '5555-666677'),
('Entregas Rápidas', '6666-777788'),
('Distribución Global', '7777-888899'),
('Envios Premium', '8888-777711'),
('Delivery Fácil', '9999-222211'),
('Cargas Rápidas', '1010-333344');

-- ###############################
-- Sección 3: Inserción de Tipos de Productos
-- ###############################
INSERT INTO TipoProducto (nombre, descripcion)
VALUES 
('Muebles de oficina', 'Muebles para oficina como escritorios, sillas, estantes, etc.'),
('Muebles de hogar', 'Muebles para el hogar como sofás, camas, mesas, etc.'),
('Muebles exteriores', 'Muebles para uso en jardines y patios.'),
('Muebles de cocina', 'Muebles como alacenas, mesadas, islas de cocina.'),
('Muebles de dormitorio', 'Muebles como camas, mesas de luz, roperos.'),
('Muebles infantiles', 'Muebles para niños, como camas, escritorios, y estantes.'),
('Muebles de sala', 'Muebles como mesas de centro, estanterías, y sillones.'),
('Muebles de baño', 'Muebles diseñados para uso en baños, como vanidades y estanterías.'),
('Muebles de almacenamiento', 'Muebles diseñados para el almacenamiento, como baúles y estanterías.');

-- ###############################
-- Sección 4: Inserción de Productos
-- ###############################
INSERT INTO Producto (nombre, descripcion, cantidad, id_tipo_producto, precio)
VALUES 
('Escritorio Moderno', 'Escritorio de madera para oficina', 10, 1, 100),
('Sofá de cuero', 'Sofá de cuero para sala de estar', 5, 2, 200),
('Mesa de jardín', 'Mesa para exteriores, resistente al agua', 12, 3, 300),
('Alacena de madera', 'Alacena de madera para cocina', 8, 4, 100),
('Cama matrimonial', 'Cama matrimonial con somier incluido', 6, 5, 200),
('Mesa de luz', 'Mesa de luz con dos cajones', 15, 5, 300),
('Cama infantil', 'Cama para niños con baranda de seguridad', 7, 6, 100),
('Escritorio infantil', 'Escritorio para niños con cajoneras', 10, 6, 200),
('Mesa de centro', 'Mesa de centro de madera para sala de estar', 12, 7, 300),
('Estantería modular', 'Estantería modular para sala de estar', 6, 7, 400),
('Vanidad de baño', 'Vanidad de baño con lavabo incluido', 10, 8, 100),
('Estantería de almacenamiento', 'Estantería alta para almacenamiento', 15, 9, 200),
('Baúl decorativo', 'Baúl decorativo de madera para almacenamiento', 8, 9, 300),
('Mueble de baño moderno', 'Mueble de baño contemporáneo con espejo', 5, 8, 400);

-- ###############################
-- Sección 5: Inserción de Empresas
-- ###############################
INSERT INTO Empresa (nombre_emp, razon_social, cuil, sitio_web)
VALUES 
('Muebles Internacionales', 'Muebles S.A.', '30-12345678-9', 'www.mueblesint.com'),
('Hogar y Estilo', 'Estilos Hogar S.R.L.', '30-87654321-7', 'www.hogaryestilo.com'),
('Muebles Innovadores', 'Innovadores S.R.L.', '30-54321098-1', 'www.innovadores.com'),
('Diseños Vanguardistas', 'Vanguardia S.A.', '30-23456789-0', 'www.vanguardia.com'),
('Muebles Clásicos', 'Clásicos Hogar S.A.', '30-55556666-7', 'www.clasicoshogar.com'),
('Diseños Funcionales', 'Funcionales S.A.', '30-22221111-3', 'www.funcionales.com');

-- ###############################
-- Sección 6: Inserción de Provincias
-- ###############################
INSERT INTO Provincia (nombre)
VALUES 
('Buenos Aires'),
('Córdoba'),
('Santa Fe'),
('Mendoza'),
('Salta'),
('Neuquén'),
('Tucumán');

-- ###############################
-- Sección 7: Inserción de Localidades
-- ###############################
INSERT INTO Localidad (nombre, id_provincia)
VALUES 
('Mar del Plata', 1),
('Córdoba Capital', 2),
('Rosario', 3),
('Mendoza Capital', 4),
('Salta Capital', 5),
('Neuquén Capital', 6),
('San Miguel de Tucumán', 7);

-- ###############################
-- Sección 8: Inserción de Marcas
-- ###############################
INSERT INTO Marca (nombre_mar, cuil, telefono, id_emp)
VALUES 
('Estilo Moderno', '30-12312312-9', '1234-5678', 1),
('Confort y Diseño', '30-98798798-7', '4321-8765', 2),
('Vanguardia Moderna', '30-99887766-5', '1234-9999', 3),
('Estilo Contemporáneo', '30-55667788-4', '5678-8888', 4),
('Diseño y Confort', '30-12345432-9', '9876-1234', 5),
('Innovación Estilo', '30-87654322-5', '4321-5678', 6);

-- ###############################
-- Sección 9: Inserción de Sucursales
-- ###############################
INSERT INTO Sucursal (direccion, contacto, id_localidad, id_mar)
VALUES 
('Av. Colón 1234, Mar del Plata', 'contacto1@muebles.com', 1, 1),
('Calle Principal 4321, Córdoba Capital', 'contacto2@muebles.com', 2, 2),
('Calle Las Heras 4321, Mendoza Capital', 'contacto3@muebles.com', 4, 3),
('Av. Belgrano 9876, Salta Capital', 'contacto4@muebles.com', 5, 4),
('Ruta 22 km 1234, Neuquén Capital', 'contacto5@muebles.com', 6, 5),
('Av. Sarmiento 5566, San Miguel de Tucumán', 'contacto6@muebles.com', 7, 6);

-- ###############################
-- Sección 10: Inserción de Pedidos
-- ###############################
INSERT INTO Pedido (fecha_pedido, total, tipo_entrega, estado, id_usuario, id_transportista)
VALUES 
('2023-09-15', 1500.00, 'Envío a domicilio', 'Pendiente', 1, 1),
('2023-09-20', 2000.00, 'Retiro en sucursal', 'Completado', 2, 2),
('2023-09-25', 3200.00, 'Envío a domicilio', 'Pendiente', 3, 3),
('2023-10-01', 4800.00, 'Retiro en sucursal', 'Pendiente', 4, 4),
('2023-10-05', 3500.00, 'Envío a domicilio', 'Pendiente', 5, 5),
('2023-10-10', 2100.00, 'Retiro en sucursal', 'Completado', 6, 6);

-- ###############################
-- Sección 11: Inserción de Líneas de Pedido
-- ###############################
INSERT INTO LineaPedido (id_pedido, id_producto, cant, precio_unitario)
VALUES 
(1, 1, 2, 100),
(2, 2, 1, 200),
(3, 3, 1, 300),
(4, 4, 2, 150),
(5, 5, 1, 200),
(6, 6, 2, 150);
