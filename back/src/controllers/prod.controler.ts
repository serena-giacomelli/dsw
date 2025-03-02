import {Request, Response} from 'express'
import { orm } from '../shared/db/orm.js';
import { Producto } from '../models/prod.entity.js';

const em  = orm.em

async function findAll(req: Request, res: Response) {
    try {
        const productos = await em.find(Producto, {})
        res.status(200).json({ message: 'found all productos', data: productos })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
}}


async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const producto = await em.findOneOrFail(Producto, { id }) 
        res.status(200).json({ message: 'found one producto', data: producto })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }}

async function add(req: Request, res: Response) {
    try {
        const producto = em.create(Producto, req.body)
        await em.flush()
        res.status(201).json({ message: 'producto created', data: producto })
    } 
    catch (error:any) {
        res.status(500).json({ message: error.message })
    }}

 async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const producto = em.getReference(Producto, id)
        em.assign(producto, req.body)
        await em.flush()
        res.status(200).json({ message: 'producto updated', data: producto })
    }   catch (error:any) {
        res.status(500).json({ message: error.message })
    }  
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const producto = em.getReference(Producto, id)
        await em.removeAndFlush(producto)
        res.status(200).send({ message: 'producto removed' })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }
}

async function findByStock(req: Request, res: Response) {
    try {
        const { cantidad } = req.params;
        const productos = await em.getConnection().execute<Producto[]>(
            `SELECT * FROM producto WHERE cantidad >= ?`,
        [cantidad]
        );
        res.status(200).json({ message: 'Productos encontrados', data: productos});
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
  
  async function findByTipoProducto(req: Request, res: Response) {
    try {
      const {tipo} = req.params;
      const productos = await em.getConnection().execute<Producto[]>(
        `SELECT p.* 
            FROM producto p
            INNER JOIN tipo t ON p.tipo_id = t.id
            WHERE t.id = ?
            ORDER BY t.nombre` , [tipo]);
      if (productos && productos.length > 0) {
        res.status(200).json({ message: 'Productos encontrados', data: productos });
      } else {
        res.status(404).json({ message: 'No se encontraron productos para el tipo de producto seleccionado' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  async function removeOferta(req: Request, res: Response) {
    try {
      const id = Number.parseInt(req.params.id);
      const result = await em.getConnection().execute(
        'UPDATE producto SET precio_oferta = NULL WHERE id = ?',
        [id]
    );
    if (result.length === 0) {
        return res.status(404).json({ message: "Producto no encontrado o sin oferta" });}
    
    res.status(200).json({ message: "Oferta eliminada correctamente" });
    } catch (error:any) {
        res.status(500).json({ message:error.message });
    }
}


export {findAll, findOne, add, update, remove, findByStock, findByTipoProducto, removeOferta}
