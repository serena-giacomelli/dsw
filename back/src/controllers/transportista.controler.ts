import {Request, Response} from 'express'
import { TransportistaRepository} from '../repositories/transportista.repository.js'
import { Transportista } from '../models/transportista.entity.js'

const repository = new TransportistaRepository()

async function findAll(req: Request, res: Response) {
    const transportistas = await repository.findAll(); 
    res.json(transportistas); 
}


async function findOne(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const transportista = await repository.findOne({ id }); 
        if (transportista) {
            res.json(transportista);
        } else {
            res.status(404).json({ message: 'transportista no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el transportista', error });
    }}

async function add(req: Request, res: Response) {
    try {
        const transportista = new Transportista(
            req.body.nombre,
            req.body.contacto,
            req.body.id
        );
        const result = await repository.add(transportista);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el trnsportista', error });
    }}

 async function update(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const transportista = new Transportista(
            req.body.nombre,
            req.body.contacto,
            req.body.id
        );
        const result = await repository.update({ id }, transportista);
        res.json(result);
    }   catch (error) {
        res.status(500).json({ message: 'Error al actualizar el transportista', error });
    }  
}

async function remove(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const result = await repository.remove({ id });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el transportista', error });
    }
}


export {findAll, findOne, add, update, remove}
