import { pool } from "../shared/db/conn.js";
export class ProductoRepository {
    async findAll() {
        const [productos] = await pool.query('SELECT * FROM producto');
        return productos;
    }
    async findOne(item) {
        const id = Number.parseInt(item.id);
        const [productos] = await pool.query('SELECT * FROM producto where codigo = ?', [id]);
        if (productos.length == 0) {
            return undefined;
        }
        const producto = productos[0];
        return producto;
    }
    async add(item) {
        const [result] = (await pool.query('INSERT INTO producto (nombre, cantidad, descripcion, id_tipo_producto) VALUES (?, ?, ?)', [item.nombre, item.cantidad, item.descripcion, item.id_tipo_producto]));
        const affectedRows = result.affectedRows;
        if (affectedRows === 1) {
            return item;
        }
        else {
            throw new Error('No se pudo insertar el producto');
        }
    }
    async update(item, producto) {
        const id = Number.parseInt(item.id);
        const [result] = (await pool.query('UPDATE producto SET nombre = ?, cantidad = ?, descripcion = ?, id_tipo_producto = ? WHERE id = ?', [producto.nombre, producto.cantidad, producto.descripcion, producto.id_tipo_producto, id]));
        const affectedRows = result.affectedRows;
        if (affectedRows === 1) {
            return producto;
        }
        else {
            throw new Error('No se pudo actualizar el producto');
        }
    }
    async remove(item) {
        const id = Number.parseInt(item.id);
        const [result] = (await pool.query('DELETE FROM producto WHERE id = ?', [id]));
        const affectedRows = result.affectedRows;
        if (affectedRows === 0) {
            throw new Error('No se pudo eliminar el producto');
        }
    }
}
//# sourceMappingURL=prod.repository.js.map