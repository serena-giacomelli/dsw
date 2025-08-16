
# Minuta de Proyecto: Sistema de Ventas de Muebles

## Fecha: 15/08/2025

### Participantes
- María Lucía Munné
- Serena Giacomelli
- Chiara Leonardi

---

### Temas tratados
1. Repaso de objetivos y alcance funcional del sistema.
2. Revisión de la estructura de frontend y backend.
3. Estado actual del despliegue en servidores (InfinityFree y Render).
4. Documentación y entrega de instructivos para el cliente.
5. Evidencia de tests automáticos y funcionamiento de la API.
6. Explicación de clases, CRUD y uso de MikroORM.

---

### Avances
- Frontend desplegado correctamente en InfinityFree.
- Backend operativo en Render, accesible vía API pública.
- Documentación actualizada: instalación, comandos, tecnologías y acceso.
- Test unitario de componente Producto implementado y documentado.
- CRUDs completos para entidades principales: Producto, Usuario, Marca, Empresa, Sucursal, Provincia, Localidad, Transportista, Pedido, Pago, Tipo Producto.
- Uso de MikroORM para la gestión de entidades y persistencia en base de datos MySQL.

---

### Información importante para nuevos usuarios

#### Clases y Entidades
- Cada entidad del sistema (por ejemplo, Producto, Usuario, Marca) está representada por una clase en la carpeta `src/models` del backend.
- Las clases definen los atributos y relaciones entre entidades, siguiendo el modelo de dominio.

#### CRUD
- El sistema implementa operaciones CRUD (Crear, Leer, Actualizar, Eliminar) para todas las entidades principales.
- Los endpoints están definidos en la carpeta `src/routes` y gestionados por controladores en `src/controllers`.
- Ejemplo de uso: para crear un producto, se realiza una petición POST al endpoint correspondiente; para listar, una petición GET, etc.

#### MikroORM
- MikroORM es un ORM (Object Relational Mapper) que facilita la interacción entre el código TypeScript y la base de datos MySQL.
- Permite definir entidades como clases, realizar consultas, y manejar relaciones (uno a muchos, muchos a uno, etc.) de forma sencilla.
- Las operaciones CRUD se implementan usando los métodos de MikroORM (`em.persist`, `em.find`, `em.remove`, etc.).
- La configuración se encuentra en la carpeta `src/shared/db`.

#### Recomendaciones para quienes nunca usaron MikroORM
- Revisar la documentación oficial: [https://mikro-orm.io/docs](https://mikro-orm.io/docs)
- Familiarizarse con la estructura de entidades y cómo se relacionan.
- Los controladores muestran ejemplos claros de cómo usar MikroORM para cada operación.

#### Otros detalles importantes
- El sistema está pensado para ser extendible y fácil de mantener.
- La documentación cubre instalación, comandos, tecnologías y acceso.
- El sistema solo puede ejecutarse en los servidores de producción, no localmente.

---

### Próximos pasos
- Validar funcionamiento completo con usuario final.
- Recopilar feedback del cliente sobre usabilidad y performance.
- Ajustar detalles visuales y funcionales según sugerencias.
- Mantener documentación y evidencias actualizadas.

---

### Observaciones
- Se recomienda revisar los links y accesos provistos en la documentación.

---

Para dudas o soporte, contactar a: sere22giacomelli@gmail.com
