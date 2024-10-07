//archivo independiente donde se guardan las rutas
import { Router } from 'express'
import { findAll, findOne } from '../controllers/usuario.controler.js';

export const usuarioRouter = Router()

usuarioRouter.get('/', findAll)
usuarioRouter.get('/:id', findOne)