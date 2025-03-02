import {Request, Response} from 'express'
import { orm } from '../shared/db/orm.js';
import { Sucursal } from '../models/sucursal.entity.js';

const em  = orm.em

async function findAll(req: Request, res: Response) {
    try {
        const sucursales = await em.find(Sucursal, {})
        res.status(200).json({ message: 'found all sucursales', data: sucursales })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
}}


async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const sucursal = await em.findOneOrFail(Sucursal, { id }) 
        res.status(200).json({ message: 'found one sucursal', data: sucursal })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }}

async function add(req: Request, res: Response) {
    try {
        const sucursal = em.create(Sucursal, req.body)
        await em.flush()
        res.status(201).json({ message: 'sucursal created', data: sucursal })
    } 
    catch (error:any) {
        res.status(500).json({ message: error.message })
    }}

 async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const sucursal = em.getReference(Sucursal, id)
        em.assign(sucursal, req.body)
        await em.flush()
        res.status(200).json({ message: 'sucursal updated', data: sucursal })
    }   catch (error:any) {
        res.status(500).json({ message: error.message })
    }  
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const sucursal = em.getReference(Sucursal, id)
        await em.removeAndFlush(sucursal)
        res.status(200).send({ message: 'sucursal removed' })
    } catch (error:any) {
        res.status(500).json({ message: error.message })
    }
}


export {findAll, findOne, add, update, remove}
