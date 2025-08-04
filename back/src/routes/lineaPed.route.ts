import { Router } from 'express'
import { findAll, findOne, add, update, remove} from '../controllers/lineaPed.controler.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const lineaPedRouter = Router()

lineaPedRouter.get('/', authMiddleware, findAll)
lineaPedRouter.get('/:id', authMiddleware, findOne)
lineaPedRouter.post('/', authMiddleware, add)
lineaPedRouter.put('/:id', authMiddleware, update)
lineaPedRouter.delete('/:id', authMiddleware, remove)
