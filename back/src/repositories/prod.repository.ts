import { Repository } from "../shared/repository.js";
import { Producto } from "../models/prod.entity.js";
import { pool } from "../shared/db/conn.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";


export class ProductoRepository implements Repository<Producto> {

    public async findAll(): Promise<Producto[] | undefined> {
        const [productos] = await pool.query('SELECT * FROM producto')
        return productos as Producto[]
    }

    public async findOne(item: { id: string }): Promise<Producto | undefined> {
        const id = Number.parseInt(item.id)
        const [productos] = await pool.query<RowDataPacket[]>('SELECT * FROM producto where id = ?',
            [id])
        if (productos.length == 0) {
            return undefined
        }
        const producto = productos[0] as Producto
        return producto
    }

    public async add(item: Producto): Promise<Producto> {
        const [result] = await pool.query(
            'INSERT INTO producto (nombre, cantidad, descripcion, id_tipo_producto, precio, precio_oferta) VALUES (?, ?, ?, ?, ?, ?)',
            [
                item.nombre,
                item.cantidad,
                item.descripcion,
                item.id_tipo_producto,
                item.precio,
                item.precio_oferta
            ]
        ) as RowDataPacket[];

        const affectedRows = (result as any).affectedRows;
        const insertId = (result as any).insertId;

        if (affectedRows === 1) {
            return { ...item, id: insertId };
        } else {
            throw new Error('No se pudo insertar el producto');
        }
    }


    public async update(item: { id: string }, producto: Producto): Promise<Producto | undefined> {
        const id = Number.parseInt(item.id)
        const [result] = (await pool.query(
            'UPDATE producto SET nombre = ?, cantidad = ?, descripcion = ?, id_tipo_producto = ?, precio = ?, precio_oferta = ? WHERE id = ?',
            [producto.nombre, producto.cantidad, producto.descripcion, producto.id_tipo_producto, producto.precio, producto.precio_oferta, id]
        )) as RowDataPacket[];
        const affectedRows = (result as any).affectedRows;
        if (affectedRows === 1) {
            return producto;
        } else {
            throw new Error('No se pudo actualizar el producto');
        }
    }

    public async remove(item: { id: string }): Promise<void> {
        const id = Number.parseInt(item.id);

        // Primero elimina en `lineapedido`
        const [result1] = await pool.query(
            'DELETE FROM lineapedido WHERE id_producto = ?;',
            [id]
        );

        // Luego elimina en `producto`
        const [result2] = await pool.query(
            'DELETE FROM producto WHERE id = ?;',
            [id]
        );

        // Verificar si alguna fila fue afectada en la primera y segunda consulta
        const affectedRows = (result1 as any).affectedRows + (result2 as any).affectedRows;
        if (affectedRows === 0) {
            throw new Error('No se pudo eliminar el producto');
        }
    }

    public async findByStock(cantidad: number): Promise<Producto[] | undefined> {
        const [productos] = await pool.query('SELECT * FROM producto WHERE cantidad >= ?', [cantidad]);
        return productos as Producto[];
    }


    public async findByTipoProducto(codtipoProducto: number): Promise<Producto[] | undefined> {
        const [productos] = await pool.query(`SELECT p.* 
            FROM producto p
            INNER JOIN tipoproducto tp ON p.id_tipo_producto = tp.id
            WHERE tp.id = ?
            ORDER BY tp.nombre` , [codtipoProducto]);
        return productos as Producto[];
    }
    public async removeOferta(item: { id: string }): Promise<void> {
        const id = Number.parseInt(item.id);
        const [result] = await pool.query(
            'UPDATE producto SET precio_oferta = NULL WHERE id = ?',
            [id]
        );
        const affectedRows = (result as any).affectedRows;
        if (affectedRows === 0) {
            throw new Error('No se pudo eliminar la oferta del producto');
        }
    }
}


