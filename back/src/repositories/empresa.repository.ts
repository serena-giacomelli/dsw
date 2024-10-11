import { Repository } from "../shared/repository.js";
import { Empresa } from "../models/empresa.entity.js";
import { pool } from "../shared/db/conn.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class EmpresaRepository implements Repository<Empresa>{

    public async findAll(): Promise<Empresa [] | undefined> {
        const [empresas] = await pool.query('SELECT * FROM empresa')
        return empresas as Empresa []
    }

    public async findOne(item: {id:string}): Promise<Empresa | undefined>{
        const id = Number.parseInt(item.id)
        const [empresas] = await pool.query<RowDataPacket[]>('SELECT * FROM empresa where id = ?',
            [id])
        if(empresas.length == 0){
            return undefined
        }
        const empresa = empresas[0] as Empresa 
        return empresa
    }

    public async add(item: Empresa): Promise<Empresa> {
        const [result] = (await pool.query<ResultSetHeader>('INSERT INTO empresa (nombre, cuil, razon_social, sitio_web) VALUES (?, ?, ?, ?)',
            [item.nombre, item.cuil, item.razonSocial, item.sitioWeb]
        )) as RowDataPacket[];
        const affectedRows = (result as any).affectedRows;
        if (affectedRows === 1) {
            return item;}
        else {
            throw new Error('No se pudo insertar la empresa');
        }
    }

    public async update(item: { id: string}, empresa:Empresa): Promise<Empresa | undefined> {
        const id = Number.parseInt(item.id)
        const [result] = (await pool.query(
            'UPDATE empresa SET nombre = ?, cuil = ?, razon_social = ?, sitio_web = ? WHERE id = ?',
            [empresa.nombre, empresa.cuil, empresa.razonSocial, empresa.sitioWeb, id]
        )) as RowDataPacket[];
        const affectedRows = (result as any).affectedRows;
        if (affectedRows === 1) {
            return empresa;
        } else {    
            throw new Error('No se pudo actualizar la empresa');
        }
    }	

    public async remove(item: { id: string}): Promise<void> {
        const id = Number.parseInt(item.id);
        const [result] = (await pool.query('DELETE FROM empresa WHERE id = ?', [id])) as RowDataPacket[];
        const affectedRows = (result as any).affectedRows;
        if (affectedRows === 0) {
            throw new Error('No se pudo eliminar la empresa');
        }

}}