//archivo independiente donde se guardan las rutas
import { Router } from 'express';
import { findAll, findOne, add, update, remove } from '../controllers/usuario.controler.js';
export const usuarioRouter = Router();
usuarioRouter.get('/', findAll);
usuarioRouter.get('/:id', findOne);
usuarioRouter.post('/', add);
usuarioRouter.put('/:id', update);
usuarioRouter.delete('/:id', remove);
//# sourceMappingURL=usuario.route.js.map