create database if not exists muebles;

use muebles;


create user if not exists lasLindas@'%' identified by 'lasLindas';
grant select, update, insert, delete on muebles.* to lasLindas@'%';


create table if not exists `muebles`.`usuarios` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NULL,
  `apellido` VARCHAR(255) NULL,
  `dni` VARCHAR(255) NOT NULL,
  `fechaNacimiento` VARCHAR(255) NULL,
  `mail` VARCHAR(255) NULL,
  PRIMARY KEY (`id`));

create table if not exists `muebles`.`pedidosUsuario` (
  `usuarioId` INT UNSIGNED NOT NULL,
  `idPedido` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`usuarioId`, `idPedido`),
  CONSTRAINT `fk_pedidosUsuario_usuarios`
    FOREIGN KEY (`usuarioId`)
    REFERENCES `muebles`.`usuarios` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE);

insert into muebles.usuarios values(1,'Serena','Giacomelli','45638062','20040604','sere22giacomelli@gmail.com');
insert into muebles.pedidosUsuario values(1,1);
insert into muebles.pedidosUsuario values(1,2);