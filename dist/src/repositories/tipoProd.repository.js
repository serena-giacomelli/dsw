import { pool } from "../shared/db/conn.js";
export class TipoProductoRepository {
    async findAll() {
        const [tipoP] = await pool.query('SELECT * FROM tipoproducto');
        return tipoP;
    }
    async findOne(item) {
        const id = Number.parseInt(item.id);
        const [tipoP] = await pool.query('SELECT * FROM tipoproducto where id = ?', [id]);
        if (tipoP.length == 0) {
            return undefined;
        }
        const tipo = tipoP[0];
        return tipo;
    }
    async add(item) {
        const [result] = (await pool.query('INSERT INTO tipoproducto (nombre, descripcion) VALUES (?, ?)', [item.nombre, item.descripcion]));
        const affectedRows = result.affectedRows;
        if (affectedRows === 1) {
            return item;
        }
        else {
            throw new Error('No se pudo insertar el tipo de producto');
        }
    }
    async update(item, tipoP) {
        const id = Number.parseInt(item.id);
        const [result] = (await pool.query('UPDATE tipoproducto SET nombre = ?, descripcion=? WHERE id = ?', [tipoP.nombre, tipoP.descripcion, id]));
        const affectedRows = result.affectedRows;
        if (affectedRows === 1) {
            return tipoP;
        }
        else {
            throw new Error('No se pudo actualizar el tipo de producto');
        }
    }
    async remove(item) {
        const id = Number.parseInt(item.id);
        const [result] = (await pool.query('DELETE FROM tipoproducto WHERE id = ?', [id]));
        const affectedRows = result.affectedRows;
        if (affectedRows === 0) {
            throw new Error('No se pudo eliminar el tipo de producto');
        }
    }
}
//# sourceMappingURL=tipoProd.repository.js.map