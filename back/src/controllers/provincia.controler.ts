import {Request, Response} from 'express'
import { orm } from '../shared/db/orm.js';
import { Provincia } from '../models/provincia.entity.js';

const em  = orm.em

async function findAll(req: Request, res: Response) {
    try {
        const provincias = await em.find(Provincia, {})
        res.status(200).json({ message: 'found all provincias', data: provincias })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
}}


async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const provincia = await em.findOneOrFail(Provincia, { id }) 
        res.status(200).json({ message: 'found one provincia', data: provincia })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }}

async function add(req: Request, res: Response) {
    try {
        const provincia = em.create(Provincia, req.body)
        await em.flush()
        res.status(201).json({ message: 'provincia created', data: provincia })
    } 
    catch (error:any) {
        res.status(500).json({ message: error.message })
    }}

 async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const provincia = em.getReference(Provincia, id)
        em.assign(provincia, req.body)
        await em.flush()
        res.status(200).json({ message: 'provincia updated', data: provincia })
    }   catch (error:any) {
        res.status(500).json({ message: error.message })
    }  
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const provincia = em.getReference(Provincia, id)
        await em.removeAndFlush(provincia)
        res.status(200).send({ message: 'provincia removed' })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }
}


export {findAll, findOne, add, update, remove}
