# Proposal - Sistema de Ventas de Muebles

## Tema

### Descripción
El proyecto consiste en el desarrollo de una **plataforma web de ventas de muebles**.  
El sistema permitirá a los usuarios registrarse, navegar por el catálogo de productos, comparar precios y marcas, realizar pedidos, efectuar pagos y gestionar la entrega.  
El objetivo principal es ofrecer una experiencia simple e intuitiva para el cliente, a la vez que se proporciona al administrador de la mueblería herramientas para gestionar productos, sucursales, marcas, transportistas y pedidos.

### Modelo
El sistema se basa en el siguiente modelo de dominio:  
[Modelo de Dominio](https://app.diagrams.net/#G1pXzks82X4Md6nmZlfyS6OVUIWu8OxMMS#%7B%22pageId%22%3A%228lCWaEY0jHqENc2HCXR9%22%7D)

---

## Alcance Funcional

### Alcance Mínimo

| Req              | Detalle |
|------------------|---------|
| **CRUD simple**  | 1. CRUD Tipo Producto <br> 2. CRUD Usuario <br> 3. CRUD Marca <br> 4. CRUD Empresa <br> 5. CRUD Sucursal <br> 6. CRUD Provincia <br> 7. CRUD Localidad <br> 8. CRUD Transportista <br> 9. CRUD Pedido <br> 10. CRUD Pago <br> 11. CRUD Producto |
| **CRUD dependiente** | 1. CRUD Producto {depende de Tipo Producto y Marca} <br> 2. CRUD Marca {depende de Empresa} <br> 3. CRUD Sucursal {depende de Empresa y Localidad} <br> 4. CRUD Pedido {depende de Usuario y Productos (líneas de pedido)} <br> 5. CRUD Pago {depende de Pedido} |
| **CUU / Epic**   | 1. Poner en oferta un producto (cambiar `precio_oferta`) <br> 2. Sacar de oferta un producto <br> 3. Elegir productos <br> 4. Realizar pedido <br> 5. Realizar pago <br> 6. Cancelar pedido |

### Alcance Voluntario
| Listado + detalle |
|-------------------|
| 1. Listado por categoría (baño, jardín, cocina, habitación, living). <br> 2. Listado por precio ascendente (más barato a más caro). <br> 3. Listado por precio descendente (más caro a más barato). <br> 4. Listado por destacados (productos más populares). |

---

## Objetivos del Proyecto
- Facilitar a los usuarios la búsqueda y compra de muebles de forma ágil y segura.  
- Permitir la comparación de precios y marcas dentro de un mismo catálogo.  
- Digitalizar la gestión de pedidos y pagos.  
- Brindar a la empresa una herramienta para administrar sucursales, marcas y transportistas.  

---

## Alcance Técnico
- **Frontend:** React con TypeScript.  
- **Backend:** Node.js con TypeScript, Express.  
- **Base de Datos:** MySQL, en Clever Cloud.  
- **Testing:** .  
- **Control de versiones:** Git/GitHub.  
- **Deploy:** Infinityfree (frontend) y Render (backend).  

---

## Equipo
- Integrantes: 
  50430 - Munné, María Lucía.

  50775 - Giacomelli, Serena.
  
  49800 - Leonardi, Chiara.
 
- Contacto: sere22giacomelli@gmail.com  
