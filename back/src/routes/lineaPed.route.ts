import { Router } from 'express'
import { findAll, findOne, add, update, remove} from '../controllers/lineaPed.controler.js';

export const lineaPedRouter = Router()

lineaPedRouter.get('/', findAll)
lineaPedRouter.get('/:id', findOne)
lineaPedRouter.post('/', add)
lineaPedRouter.put('/:id', update)
lineaPedRouter.delete('/:id', remove)
