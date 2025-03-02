import {Request, Response} from 'express'
import { orm } from '../shared/db/orm.js';
import { Localidad } from '../models/localidad.entity.js';

const em  = orm.em

async function findAll(req: Request, res: Response) {
    try {
        const localidades = await em.find(Localidad, {})
        res.status(200).json({ message: 'found all localidades', data: localidades })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
}}


async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const localidad = await em.findOneOrFail(Localidad, { id }) 
        res.status(200).json({ message: 'found one localidad', data: localidad })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }}

async function add(req: Request, res: Response) {
    try {
        const localidad = em.create(Localidad, req.body)
        await em.flush()
        res.status(201).json({ message: 'localidad created', data: localidad })
    } 
    catch (error:any) {
        res.status(500).json({ message: error.message })
    }}

 async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const localidad = em.getReference(Localidad, id)
        em.assign(localidad, req.body)
        await em.flush()
        res.status(200).json({ message: 'localidad updated', data: localidad })
    }   catch (error:any) {
        res.status(500).json({ message: error.message })
    }  
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const localidad = em.getReference(Localidad, id)
        await em.removeAndFlush(localidad)
        res.status(200).send({ message: 'localidad removed' })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }
}


export {findAll, findOne, add, update, remove}
