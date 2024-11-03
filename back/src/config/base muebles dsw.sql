-- Crear las tablas sin dependencias primero
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
