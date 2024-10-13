import { pool } from "../shared/db/conn.js";
export class UsuarioRepository {
    async findAll() {
        const [usuarios] = await pool.query('SELECT * FROM usuario');
        return usuarios;
    }
    async findOne(item) {
        const id = Number.parseInt(item.id);
        const [usuarios] = await pool.query('SELECT * FROM usuario where id = ?', [id]);
        if (usuarios.length == 0) {
            return undefined;
        }
        const usuario = usuarios[0];
        return usuario;
    }
    async add(item) {
        const [result] = (await pool.query('INSERT INTO usuario (nombre, apellido, dni, fecha_nacimiento, mail) VALUES (?, ?, ?, ?, ?)', [item.nombre, item.apellido, item.dni, item.fechaNacimiento, item.mail]));
        const affectedRows = result.affectedRows;
        if (affectedRows === 1) {
            return item;
        }
        else {
            throw new Error('No se pudo insertar el usuario');
        }
    }
    async update(item, usuario) {
        const id = Number.parseInt(item.id);
        const [result] = (await pool.query('UPDATE usuario SET nombre = ?, apellido = ?, dni = ?, fecha_nacimiento = ?, mail = ? WHERE id = ?', [usuario.nombre, usuario.apellido, usuario.dni, usuario.fechaNacimiento, usuario.mail, id]));
        const affectedRows = result.affectedRows;
        if (affectedRows === 1) {
            return usuario;
        }
        else {
            throw new Error('No se pudo actualizar el usuario');
        }
    }
    async remove(item) {
        const id = Number.parseInt(item.id);
        const [result] = (await pool.query('DELETE FROM usuario WHERE id = ?', [id]));
        const affectedRows = result.affectedRows;
        if (affectedRows === 0) {
            throw new Error('No se pudo eliminar el usuario');
        }
    }
}
//# sourceMappingURL=usuario.repository.js.map