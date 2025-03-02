import {Request, Response} from 'express'
import { orm } from '../shared/db/orm.js';
import { Pago } from '../models/pago.entity.js';

const em  = orm.em

async function findAll(req: Request, res: Response) {
    try {
        const pagos = await em.find(Pago, {})
        res.status(200).json({ message: 'found all pagos', data: pagos })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
}}


async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const pago = await em.findOneOrFail(Pago, { id }) 
        res.status(200).json({ message: 'found one pago', data: pago })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }}

async function add(req: Request, res: Response) {
    try {
        const pago = em.create(Pago, req.body)
        await em.flush()
        res.status(201).json({ message: 'pago created', data: pago })
    } 
    catch (error:any) {
        res.status(500).json({ message: error.message })
    }}

 async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const pago = em.getReference(Pago, id)
        em.assign(pago, req.body)
        await em.flush()
        res.status(200).json({ message: 'pago updated', data: pago })
    }   catch (error:any) {
        res.status(500).json({ message: error.message })
    }  
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const pago = em.getReference(Pago, id)
        await em.removeAndFlush(pago)
        res.status(200).send({ message: 'pago removed' })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }
}


export {findAll, findOne, add, update, remove}
