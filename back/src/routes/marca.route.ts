import { Router } from 'express'
import { findAll, findOne, add, update, remove} from '../controllers/marca.controler.js';

export const marcaRouter = Router()

marcaRouter.get('/', findAll)
marcaRouter.get('/:id', findOne)
marcaRouter.post('/', add)
marcaRouter.put('/:id', update)
marcaRouter.delete('/:id', remove)