import { Router } from "express";
import { findAll, findOne, add, update, remove, findByStock, findByTipoProducto, removeOferta } from "../controllers/prod.controler.js";

export const prodRouter = Router()

prodRouter.get('/cantidad/:cantidad', findByStock)
prodRouter.get('/categoria/:codtipoProducto', findByTipoProducto);
prodRouter.put('/:id/eliminar-oferta', removeOferta);
prodRouter.get('/', findAll)
prodRouter.get('/:id', findOne)
prodRouter.post('/', add)
prodRouter.put('/:id', update)
prodRouter.delete('/:id', remove)
  ;

