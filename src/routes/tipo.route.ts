import { Router } from 'express'
import { findAll, findOne, add, update, remove } from '../controllers/tipo.controler.js';

export const tipoRouter = Router()

tipoRouter.get('/', findAll)
tipoRouter.get('/:id', findOne)
tipoRouter.post('/', add)
tipoRouter.put('/:id', update)
tipoRouter.delete('/:id', remove)