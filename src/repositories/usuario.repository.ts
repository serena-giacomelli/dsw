import { Repository } from "../shared/repository.js";
import { Usuario } from "../models/usuarios.entity.js";
import { pool } from "../shared/db/conn.js";
import { RowDataPacket } from "mysql2";

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
}