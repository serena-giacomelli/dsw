import { Router } from 'express';
import { findAll, findOne, add, update, remove } from '../controllers/empresa.controler.js';
export const empresaRouter = Router();
empresaRouter.get('/', findAll);
empresaRouter.get('/:id', findOne);
empresaRouter.post('/', add);
empresaRouter.put('/:id', update);
empresaRouter.delete('/:id', remove);
//# sourceMappingURL=empresa.route.js.map