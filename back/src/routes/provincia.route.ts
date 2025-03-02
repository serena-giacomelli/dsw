import { Router } from 'express'
import { findAll, findOne, add, update, remove} from '../controllers/provincia.controler.js';

export const provinciaRouter = Router()

provinciaRouter.get('/', findAll)
provinciaRouter.get('/:id', findOne)
provinciaRouter.post('/', add)
provinciaRouter.put('/:id', update)
provinciaRouter.delete('/:id', remove)