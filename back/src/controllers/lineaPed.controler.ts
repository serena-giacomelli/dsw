import {Request, Response} from 'express'
import { orm } from '../shared/db/orm.js';
import { LineaPed } from '../models/lineaPed.entity.js';

const em  = orm.em

async function findAll(req: Request, res: Response) {
    try {
        const lineasPed = await em.find(LineaPed, {})
        res.status(200).json({ message: 'found all lineasPed', data: lineasPed })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
}}


async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const lineaPed = await em.findOneOrFail(LineaPed, { id }) 
        res.status(200).json({ message: 'found one lineaPed', data: lineaPed })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }}

async function add(req: Request, res: Response) {
    try {
        const lineaPed = em.create(LineaPed, req.body)
        await em.flush()
        res.status(201).json({ message: 'lineaPed created', data: lineaPed })
    } 
    catch (error:any) {
        res.status(500).json({ message: error.message })
    }}

 async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const lineaPed = em.getReference(LineaPed, id)
        em.assign(lineaPed, req.body)
        await em.flush()
        res.status(200).json({ message: 'lineaPed updated', data: lineaPed })
    }   catch (error:any) {
        res.status(500).json({ message: error.message })
    }  
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const lineaPed = em.getReference(LineaPed, id)
        await em.removeAndFlush(lineaPed)
        res.status(200).send({ message: 'lineaPed removed' })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }
}


export {findAll, findOne, add, update, remove}
