import {Request, Response} from 'express'
import { orm } from '../shared/db/orm.js';
import { Tipo } from '../models/tipo.entity.js';

const em  = orm.em

async function findAll(req: Request, res: Response) {
    try {
        const tipos = await em.find(Tipo, {})
        res.status(200).json({ message: 'found all tipos', data: tipos })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
}}


async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const tipo = await em.findOneOrFail(Tipo, { id }) 
        res.status(200).json({ message: 'found one tipo', data: tipo })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }}

async function add(req: Request, res: Response) {
    try {
        const tipo = em.create(Tipo, req.body)
        await em.flush()
        res.status(201).json({ message: 'tipo created', data: tipo })
    } 
    catch (error:any) {
        res.status(500).json({ message: error.message })
    }}

 async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const tipo = em.getReference(Tipo, id)
        em.assign(tipo, req.body)
        await em.flush()
        res.status(200).json({ message: 'tipo updated', data: tipo })
    }   catch (error:any) {
        res.status(500).json({ message: error.message })
    }  
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const tipo = em.getReference(Tipo, id)
        await em.removeAndFlush(tipo)
        res.status(200).send({ message: 'tipo removed' })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }
}


export {findAll, findOne, add, update, remove}

