import { Router } from 'express'
import { findAll, findOne, add, update, remove, finalizarPedido, testEmailConfig, testEmailSend} from '../controllers/pedido.controler.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const pedidoRouter = Router()

pedidoRouter.get('/test-email', authMiddleware, testEmailConfig)
pedidoRouter.post('/test-email-send', authMiddleware, testEmailSend)
pedidoRouter.post('/finalizar', authMiddleware, finalizarPedido)
pedidoRouter.get('/', authMiddleware, findAll)
pedidoRouter.get('/:id', authMiddleware, findOne)
pedidoRouter.post('/', authMiddleware, add)
pedidoRouter.put('/:id', authMiddleware, update)
pedidoRouter.delete('/:id', authMiddleware, remove)
