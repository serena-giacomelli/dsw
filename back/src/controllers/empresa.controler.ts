import {Request, Response} from 'express'
import { orm } from '../shared/db/orm.js';
import { Empresa } from '../models/empresa.entity.js';

const em  = orm.em

async function findAll(req: Request, res: Response) {
    try {
        const empresas = await em.find(Empresa, {})
        res.status(200).json({ message: 'found all empresas', data: empresas })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
}}


async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const empresa = await em.findOneOrFail(Empresa, { id }) 
        res.status(200).json({ message: 'found one empresa', data: empresa })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }}

async function add(req: Request, res: Response) {
    try {
        const empresa = em.create(Empresa, req.body)
        await em.flush()
        res.status(201).json({ message: 'empresa created', data: empresa })
    } 
    catch (error:any) {
        res.status(500).json({ message: error.message })
    }}

 async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const empresa = em.getReference(Empresa, id)
        em.assign(empresa, req.body)
        await em.flush()
        res.status(200).json({ message: 'empresa updated', data: empresa })
    }   catch (error:any) {
        res.status(500).json({ message: error.message })
    }  
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const empresa = em.getReference(Empresa, id)
        await em.removeAndFlush(empresa)
        res.status(200).send({ message: 'empresa removed' })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }
}


export {findAll, findOne, add, update, remove}
