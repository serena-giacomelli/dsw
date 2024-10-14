import { Repository } from "../shared/repository.js";
import { Pedido } from "../models/pedido.entity.js";
import { pool } from "../shared/db/conn.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export class PedidoRepository implements Repository<Pedido>{

    public async findAll(): Promise<Pedido [] | undefined> {
        const [pedidos] = await pool.query('SELECT * FROM pedido')
        return pedidos as Pedido []
    }

    public async findOne(item: {id:string}): Promise<Pedido | undefined>{
        const id = Number.parseInt(item.id)
        const [pedidos] = await pool.query<RowDataPacket[]>('SELECT * FROM pedido where id = ?',
            [id])
        if(pedidos.length == 0){
            return undefined
        }
        const pedido = pedidos[0] as Pedido 
        return pedido
    }

    public async add(item:Pedido): Promise<Pedido> {
        const [result] = (await pool.query<ResultSetHeader>('INSERT INTO pedido (fecha_pedido, total, tipo_entrega,estado,id_usuario, id_transportista) VALUES (?, ?, ?, ?, ?, ?)',
            [item.fecha_pedido, item.total, item.tipo_entrega, item.estado, item.id_usuario, item.id_transportista]
        )) as RowDataPacket[];
        const affectedRows = (result as any).affectedRows;
        if (affectedRows === 1) {
            return item;}
        else {
            throw new Error('No se pudo insertar el pedido');
        }
    }

    public async update(item: { id: string}, pedido:Pedido): Promise<Pedido | undefined> {
        const id = Number.parseInt(item.id)
        const [result] = (await pool.query(
            'UPDATE pedido SET fecha_pedido = ?, total = ?, tipo_entrega = ?, estado = ?, id_usuario = ?, id_transportista WHERE id = ?',
            [pedido.fecha_pedido, pedido.total, pedido.tipo_entrega, pedido.estado, pedido.id_usuario, pedido.id_transportista, id]
        )) as RowDataPacket[];
        const affectedRows = (result as any).affectedRows;
        if (affectedRows === 1) {
            return pedido;
        } else {    
            throw new Error('No se pudo actualizar el pedido');
        }
    }	

    public async remove(item: { id: string}): Promise<void> {
        const id = Number.parseInt(item.id);
        const [result] = (await pool.query('DELETE FROM pedido WHERE id = ?', [id])) as RowDataPacket[];
        const affectedRows = (result as any).affectedRows;
        if (affectedRows === 0) {
            throw new Error('No se pudo eliminar el pedido');
        }

}}