import { Repository } from "../shared/repository.js";
import { Usuario } from "../models/usuarios.entity.js";
import { pool } from "../shared/db/conn.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class UsuarioRepository implements Repository<Usuario>{

    public async findAll(): Promise<Usuario [] | undefined> {
        const [usuarios] = await pool.query('SELECT * FROM usuario')
        return usuarios as Usuario []
    }

    public async findOne(item: {id:string}): Promise<Usuario | undefined>{
        const id = Number.parseInt(item.id)
        const [usuarios] = await pool.query<RowDataPacket[]>('SELECT * FROM usuario where id = ?',
            [id])
        if(usuarios.length == 0){
            return undefined
        }
        const usuario = usuarios[0] as Usuario 
        return usuario
    }

    public async add(item: Usuario): Promise<Usuario> {
        const [result] = (await pool.query<ResultSetHeader>('INSERT INTO usuario (nombre, apellido, dni, fecha_nacimiento, mail) VALUES (?, ?, ?, ?, ?)',
            [item.nombre, item.apellido, item.dni, item.fechaNacimiento, item.mail]
        )) as RowDataPacket[];
        const affectedRows = (result as any).affectedRows;
        if (affectedRows === 1) {
            return item;}
        else {
            throw new Error('No se pudo insertar el usuario');
        }
    }

    public async update(item: { id: string}, usuario:Usuario): Promise<Usuario | undefined> {
        const id = Number.parseInt(item.id)
        const [result] = (await pool.query(
            'UPDATE usuario SET nombre = ?, apellido = ?, dni = ?, fecha_nacimiento = ?, mail = ? WHERE id = ?',
            [usuario.nombre, usuario.apellido, usuario.dni, usuario.fechaNacimiento, usuario.mail, id]
        )) as RowDataPacket[];
        const affectedRows = (result as any).affectedRows;
        if (affectedRows === 1) {
            return usuario;
        } else {    
            throw new Error('No se pudo actualizar el usuario');
        }
    }	

    public async remove(item: { id: string}): Promise<void> {
        const id = Number.parseInt(item.id);
        const [result] = (await pool.query('DELETE FROM usuario WHERE id = ?', [id])) as RowDataPacket[];
        const affectedRows = (result as any).affectedRows;
        if (affectedRows === 0) {
            throw new Error('No se pudo eliminar el usuario');
        }

}}