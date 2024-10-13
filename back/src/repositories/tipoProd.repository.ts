import { Repository } from "../shared/repository.js";
import { TipoProducto } from "../models/tipo.entity.js";
import { pool } from "../shared/db/conn.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class TipoProductoRepository implements Repository <TipoProducto>{

    public async findAll(): Promise<TipoProducto[] | undefined> {
        const [tipoP] = await pool.query ('SELECT * FROM tipoproducto')
        return tipoP as TipoProducto[]
    }

    public async findOne(item: { id: string; }): Promise<TipoProducto | undefined> {
        const id = Number.parseInt(item.id)
        const [tipoP] = await pool.query<RowDataPacket[]>('SELECT * FROM tipoproducto where id = ?', 
            [id])
        if (tipoP.length == 0) {
            return undefined
        }
        const tipo = tipoP[0] as TipoProducto
        return tipo
    }

    public async add(item: TipoProducto): Promise<TipoProducto> {
        const [result] = (await pool.query<ResultSetHeader>('INSERT INTO tipoproducto (nombre, descripcion) VALUES (?, ?)',
            [item.nombre, item.descripcion]
        )) as RowDataPacket[];
        const affectedRows = (result as any).affectedRows;
        if (affectedRows === 1) {
            return item;}
        else {
            throw new Error('No se pudo insertar el tipo de producto');
        }
    }

    public async update(item: { id: string}, tipoP:TipoProducto): Promise<TipoProducto | undefined> {
        const id = Number.parseInt(item.id)
        const [result] = (await pool.query(
            'UPDATE tipoproducto SET nombre = ?, descripcion=? WHERE id = ?',
            [tipoP.nombre, tipoP.descripcion, id]
        )) as RowDataPacket[];
        const affectedRows = (result as any).affectedRows;
        if (affectedRows === 1) {
            return tipoP;
        } else {    
            throw new Error('No se pudo actualizar el tipo de producto');
        }
    }	

    public async remove(item: { id: string}): Promise<void> {
        const id = Number.parseInt(item.id);
        const [result] = (await pool.query('DELETE FROM tipoproducto WHERE id = ?', [id])) as RowDataPacket[];
        const affectedRows = (result as any).affectedRows;
        if (affectedRows === 0) {
            throw new Error('No se pudo eliminar el tipo de producto');
        }

    }}