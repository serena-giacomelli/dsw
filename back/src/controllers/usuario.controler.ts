import {Request, Response} from 'express';
import { orm } from '../shared/db/orm.js';
import { Usuario } from '../models/usuarios.entity.js';

const em =  orm.em


async function findAll(req: Request, res: Response) {
    try{
        const usuarios = await em.find(Usuario, {}) //el segundo parametro sonlos filtros, en este caso no tiene, no se como se hace cuanod los tenga
        res.status(200).json({message: 'found all usuarios', data:usuarios})
    } catch (error:any) {
        res.status(500).json({message: error.message})
}}

//si hay un error, en alguno de los controler que diga cannot access before initialization hay q ir a la entity donde haya error
// e importar rel que es orm y en la @Many to algo poner Rel<Clase> (eso se hace dentro del @Many)

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const usuario = await em.findOneOrFail(Usuario, { id })
        res.status(200).json({message: 'found one usuario', data: usuario})
    } catch (error:any) {
        res.status(500).json({ message: error.message });
    }}

async function add(req: Request, res: Response) {
    try {
       const usuario = em.create(Usuario, req.body)
       await em.flush()
       res.status(201).json({message: 'usuario created', data: usuario})
    }   
    catch (error:any) {
        res.status(500).json({message: error.message})
}}

 
async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const usuario = em.getReference(Usuario, id )
        em.assign(usuario, req.body)
        await em.flush()
        res.status(200).json({message: 'usuario updated', data: usuario})
    }  catch(error:any) {
        res.status(500).json({message: error.message})
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const usuario = em.getReference(Usuario, id)
        await em.removeAndFlush(usuario)
        res.status(200).send({message: 'usuario removed'})
    } catch (error:any) {
        res.status(500).json({message: error.message})
}}


export {findAll, findOne, add, update, remove}
