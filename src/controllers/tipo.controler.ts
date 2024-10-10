import {Request, Response, NextFunction} from "express"
import { TipoProductoRepository } from "../repositories/tipoProd.repository.js";
import { TipoProducto } from "../models/tipo.entity.js";

const repository = new TipoProductoRepository()

async function findAll(req:Request, res:Response){
  const tipoP = await repository.findAll(); 
  res.json (tipoP);
}

async function findOne(req:Request, res:Response) {
  try {
    const { id } = req.params;
    const tipoP = await repository.findOne({ id }); 
    if (tipoP) {
        res.json(tipoP);
    } else {
        res.status(404).json({ message: 'Tipo  producto no encontrado' });

    }
} catch (error) {
    res.status(500).json({ message: 'Error al obtener el tipo producto', error });
  }
}

async function add(req: Request, res: Response) {
  try {
      const tipoP = new TipoProducto(
          req.body.nombre,
          req.body.descripcion,
          req.body.id
      );
      const result = await repository.add(tipoP);
      res.json(result);
  } catch (error) {
      res.status(500).json({ message: 'Error al agregar el tipo de producto', error });
  }}

async function update(req: Request, res: Response) {
  try {
      const { id } = req.params;
      const tipoP = new TipoProducto(
        req.body.nombre,
        req.body.descripcion,
        req.body.id
      );
      const result = await repository.update({ id }, tipoP);
      res.json(result);
  }   catch (error) {
      res.status(500).json({ message: 'Error al actualizar el tipo de producto', error });
  }  
}

async function remove(req: Request, res: Response) {
  try {
      const { id } = req.params;
      const result = await repository.remove({ id });
      res.json(result);
  } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el tipo de producto', error });
  }
}


export {findAll, findOne, add, update, remove}
