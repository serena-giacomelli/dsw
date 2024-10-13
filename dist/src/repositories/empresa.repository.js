import { pool } from "../shared/db/conn.js";
export class EmpresaRepository {
    async findAll() {
        const [empresas] = await pool.query('SELECT * FROM empresa');
        return empresas;
    }
    async findOne(item) {
        const id = Number.parseInt(item.id);
        const [empresas] = await pool.query('SELECT * FROM empresa where id = ?', [id]);
        if (empresas.length == 0) {
            return undefined;
        }
        const empresa = empresas[0];
        return empresa;
    }
    async add(item) {
        const [result] = (await pool.query('INSERT INTO empresa (nombre, cuil, razon_social, sitio_web) VALUES (?, ?, ?, ?)', [item.nombre, item.cuil, item.razonSocial, item.sitioWeb]));
        const affectedRows = result.affectedRows;
        if (affectedRows === 1) {
            return item;
        }
        else {
            throw new Error('No se pudo insertar la empresa');
        }
    }
    async update(item, empresa) {
        const id = Number.parseInt(item.id);
        const [result] = (await pool.query('UPDATE empresa SET nombre = ?, cuil = ?, razon_social = ?, sitio_web = ? WHERE id = ?', [empresa.nombre, empresa.cuil, empresa.razonSocial, empresa.sitioWeb, id]));
        const affectedRows = result.affectedRows;
        if (affectedRows === 1) {
            return empresa;
        }
        else {
            throw new Error('No se pudo actualizar la empresa');
        }
    }
    async remove(item) {
        const id = Number.parseInt(item.id);
        const [result] = (await pool.query('DELETE FROM empresa WHERE id = ?', [id]));
        const affectedRows = result.affectedRows;
        if (affectedRows === 0) {
            throw new Error('No se pudo eliminar la empresa');
        }
    }
}
//# sourceMappingURL=empresa.repository.js.map