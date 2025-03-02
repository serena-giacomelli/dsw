import {Request, Response} from 'express'
import { orm } from '../shared/db/orm.js';
import { Marca } from '../models/marca.entity.js';

const em  = orm.em

async function findAll(req: Request, res: Response) {
    try {
        const marcas = await em.find(Marca, {})
        res.status(200).json({ message: 'found all marcas', data: marcas })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
}}


async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const marca = await em.findOneOrFail(Marca, { id }) 
        res.status(200).json({ message: 'found one marca', data: marca })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }}

async function add(req: Request, res: Response) {
    try {
        const marca = em.create(Marca, req.body)
        await em.flush()
        res.status(201).json({ message: 'marca created', data: marca })
    } 
    catch (error:any) {
        res.status(500).json({ message: error.message })
    }}

 async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const marca = em.getReference(Marca, id)
        em.assign(marca, req.body)
        await em.flush()
        res.status(200).json({ message: 'marca updated', data: marca })
    }   catch (error:any) {
        res.status(500).json({ message: error.message })
    }  
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const marca = em.getReference(Marca, id)
        await em.removeAndFlush(marca)
        res.status(200).send({ message: 'marca removed' })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }
}


export {findAll, findOne, add, update, remove}
