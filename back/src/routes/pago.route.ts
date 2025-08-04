import { Router } from 'express'
import { findAll, findOne, add, update, remove, obtenerPagosPendientes, aprobarPago, rechazarPago} from '../controllers/pago.controler.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const pagoRouter = Router()

pagoRouter.get('/', authMiddleware, findAll)
pagoRouter.get('/pendientes', authMiddleware, obtenerPagosPendientes)
pagoRouter.get('/:id', authMiddleware, findOne)
pagoRouter.post('/', authMiddleware, add)
pagoRouter.put('/:id', authMiddleware, update)
pagoRouter.put('/:id/aprobar', authMiddleware, aprobarPago)
pagoRouter.put('/:id/rechazar', authMiddleware, rechazarPago)
pagoRouter.delete('/:id', authMiddleware, remove)