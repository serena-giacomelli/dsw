import { Router } from "express";
import { findAll, findOne, add, update, remove } from "../controllers/prod.controler.js";
export const prodRouter = Router();
prodRouter.get('/', findAll);
prodRouter.get('/:id', findOne);
prodRouter.post('/', add);
prodRouter.put('/:id', update);
prodRouter.delete('/:id', remove);
//# sourceMappingURL=prod.route.js.map