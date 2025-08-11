//archivo independiente donde se guardan las rutas
import { Router } from 'express'
import { findAll, findOne, add, update, remove, login, register, verifyOtp } from '../controllers/usuario.controler.js';

export const usuarioRouter = Router()

usuarioRouter.post('/login', login)
usuarioRouter.post('/register', register)
usuarioRouter.post('/verify-otp', verifyOtp) // <-- Nueva ruta para verificar el código
usuarioRouter.get('/', findAll)
usuarioRouter.get('/:id', findOne)
usuarioRouter.post('/', add)
usuarioRouter.put('/:id', update)
usuarioRouter.delete('/:id', remove)