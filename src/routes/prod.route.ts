import { Router } from "express";
import { findAll, findOne } from "../controllers/prod.controler";

export const prodRouter = Router()
prodRouter.get('/', findAll)
prodRouter.get('/:nombre', findOne)
