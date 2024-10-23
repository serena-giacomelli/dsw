//archivo independiente donde se guardan las rutas
import { Router } from 'express'
import { findAll, findOne, add, update, remove} from '../controllers/transportista.controler.js';

export const transportistaRouter = Router()

transportistaRouter.get('/', findAll)
transportistaRouter.get('/:id', findOne)
transportistaRouter.post('/', add)
transportistaRouter.put('/:id', update)
transportistaRouter.delete('/:id', remove)