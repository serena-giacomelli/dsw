import { Repository } from "../shared/repository.js";
import { Transportista } from "../models/transportista.entity.js";
import { pool } from "../shared/db/conn.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class TransportistaRepository implements Repository<Transportista>{

    public async findAll(): Promise<Transportista [] | undefined> {
        const [transportistas] = await pool.query('SELECT * FROM transportista')
        return transportistas as Transportista []
    }

    public async findOne(item: {id:string}): Promise<Transportista | undefined>{
        const id = Number.parseInt(item.id)
        const [transportistas] = await pool.query<RowDataPacket[]>('SELECT * FROM transportista where id = ?',
            [id])
        if(transportistas.length == 0){
            return undefined
        }
        const transportista = transportistas[0] as Transportista 
        return transportista
    }

    public async add(item: Transportista): Promise<Transportista> {
        const [result] = (await pool.query<ResultSetHeader>('INSERT INTO transportista (nombre, contacto) VALUES (?, ?)',
            [item.nombre, item.contacto]
        )) as RowDataPacket[];
        const affectedRows = (result as any).affectedRows;
        if (affectedRows === 1) {
            return item;}
        else {
            throw new Error('No se pudo insertar el transportista');
        }
    }

    public async update(item: { id: string}, transportista:Transportista): Promise<Transportista | undefined> {
        const id = Number.parseInt(item.id)
        const [result] = (await pool.query(
            'UPDATE transportista SET nombre = ?, contacto = ? WHERE id = ?',
            [transportista.nombre, transportista.contacto, id]
        )) as RowDataPacket[];
        const affectedRows = (result as any).affectedRows;
        if (affectedRows === 1) {
            return transportista;
        } else {    
            throw new Error('No se pudo actualizar el transportista');
        }
    }	

    public async remove(item: { id: string}): Promise<void> {
        const id = Number.parseInt(item.id);
        const [result] = (await pool.query('DELETE FROM transportista WHERE id = ?', [id])) as RowDataPacket[];
        const affectedRows = (result as any).affectedRows;
        if (affectedRows === 0) {
            throw new Error('No se pudo eliminar el transportista');
        }

}}