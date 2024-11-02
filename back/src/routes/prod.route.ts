import { Router } from "express";
import { findAll, findOne, add, update, remove , findByStock, findByTipoProducto} from "../controllers/prod.controler.js";

export const prodRouter = Router()

prodRouter.get('/', findAll)
prodRouter.get('/:id', findOne)
prodRouter.post('/', add)
prodRouter.put('/:id', update)
prodRouter.delete('/:id', remove)
prodRouter.get('/cantidad/:cantidad', findByStock)
prodRouter.get('/categoria/:codtipoProducto', findByTipoProducto);
;

