import {Request, Response} from "express"
import { ProductoRepository } from "../repositories/prod.repository.js";
import { Producto } from "../models/prod.entity.js";

const repository = new ProductoRepository()

async function findAll(req:Request, res:Response){
  const producto = await repository.findAll(); 
  res.json (producto);
}

async function findOne(req:Request, res:Response) {
  try {
    const { id } = req.params;
    const prod = await repository.findOne({ id }); 
    if (prod) {
        res.json(prod);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });

    }
} catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error });
  }
}
async function add(req: Request, res: Response) {
  try {
      const producto = new Producto(
          req.body.nombre,
          req.body.cantidad,
          req.body.descripcion,
          req.body.id,
          req.body.id_tipo_producto
      );
      const result = await repository.add(producto);
      res.json(result);
  } catch (error) {
      res.status(500).json({ message: 'Error al agregar el producto', error });
  }}

async function update(req: Request, res: Response) {
  try {
      const { id } = req.params;
      const producto = new Producto(
          req.body.nombre,
          req.body.cantidad,
          req.body.descripcion,
          req.body.id,
          req.body.id_tipo_producto
      );
      const result = await repository.update({ id }, producto);
      res.json(result);
  }   catch (error) {
      res.status(500).json({ message: 'Error al actualizar el producto', error });
  }  
}

async function remove(req: Request, res: Response) {
  try {
      const { id } = req.params;
      const result = await repository.remove({ id });
      res.json(result);
  } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el producto', error });
  }
}

async function findByStock(req:Request, res:Response){
  try {const cantidad = parseInt(req.params.cantidad);
    if (isNaN(cantidad)) {
        return res.status(400).json({ message: 'Cantidad no válida debe ser un numero entero' });
    }
    const productos = await repository.findByStock(cantidad); 
  
  if (productos && productos.length > 0) {
      res.json(productos);
  } else {
      res.status(404).json({ message: 'No hay productos con stock mayor a :' + cantidad });
  }
}catch (error) {
  res.status(500).json({ message: 'Error al obtener los productos', error });
}
}

async function findByTipoProducto(req: Request, res: Response) {
  try { const codtipoProducto = parseInt(req.params.codtipoProducto); 
      if (isNaN(codtipoProducto)) { 
          return res.status(400).json({ message: 'ID de tipo de producto no válido' });
      }
      const productos = await repository.findByTipoProducto(codtipoProducto);

      if (productos && productos.length > 0) {
          res.json(productos);
      } else {
          res.status(404).json({ message: `No hay productos para el tipo de producto con ID: ${codtipoProducto}` });
      }
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener los productos por tipo de producto', error });
  }
}

export {findAll, findOne, add, update, remove, findByStock, findByTipoProducto}
