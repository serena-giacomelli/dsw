import {Request, Response, NextFunction} from 'express'
import { EmpresaRepository} from '../repositories/empresa.repository.js'
import { Empresa } from '../models/empresa.entity.js'

const repository = new EmpresaRepository()

async function findAll(req: Request, res: Response) {
    const empresas = await repository.findAll(); 
    res.json(empresas); 
}


async function findOne(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const empresa = await repository.findOne({ id }); 
        if (empresa) {
            res.json(empresa);
        } else {
            res.status(404).json({ message: 'empresa no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la empresa', error });
    }}

async function add(req: Request, res: Response) {
    try {
        const empresa = new Empresa(
            req.body.nombre,
            req.body.cuil,
            req.body.razonSocial,
            req.body.id,
            req.body.sitioWeb
        );
        const result = await repository.add(empresa);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar la empresa', error });
    }}

 async function update(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const empresa = new Empresa(
            req.body.nombre,
            req.body.cuil,
            req.body.razonSocial,
            req.body.id,
            req.body.sitioWeb
        );
        const result = await repository.update({ id }, empresa);
        res.json(result);
    }   catch (error) {
        res.status(500).json({ message: 'Error al actualizar la empresa ', error });
    }  
}

async function remove(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const result = await repository.remove({ id });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la empresa', error });
    }
}


export {findAll, findOne, add, update, remove}