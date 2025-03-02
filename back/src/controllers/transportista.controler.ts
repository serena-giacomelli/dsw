import {Request, Response} from 'express'
import { orm } from '../shared/db/orm.js';
import { Transportista } from '../models/transportista.entity.js'

const em  = orm.em

async function findAll(req: Request, res: Response) {
    try {
        const transportistas = await em.find(Transportista, {})
        res.status(200).json({ message: 'found all transportistas', data: transportistas })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
}}


async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const transportista = await em.findOneOrFail(Transportista, { id }) 
        res.status(200).json({ message: 'found one transportista', data: transportista })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }}

async function add(req: Request, res: Response) {
    try {
        const transportista = em.create(Transportista, req.body)
        await em.flush()
        res.status(201).json({ message: 'transportista created', data: transportista })
    } 
    catch (error:any) {
        res.status(500).json({ message: error.message })
    }}

 async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const transportista = em.getReference(Transportista, id)
        em.assign(transportista, req.body)
        await em.flush()
        res.status(200).json({ message: 'transportista updated', data: transportista })
    }   catch (error:any) {
        res.status(500).json({ message: error.message })
    }  
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const transportista = em.getReference(Transportista, id)
        await em.removeAndFlush(transportista)
        res.status(200).send({ message: 'transportista removed' })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }
}


export {findAll, findOne, add, update, remove}
