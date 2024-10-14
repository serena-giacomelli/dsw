import {Request, Response} from 'express'
import { UsuarioRepository} from '../repositories/usuario.repository.js'
import { Usuario } from '../models/usuarios.entity.js'

const repository = new UsuarioRepository()

async function findAll(req: Request, res: Response) {
    const usuarios = await repository.findAll(); 
    res.json(usuarios); 
}


async function findOne(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const usuario = await repository.findOne({ id }); 
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ message: 'usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario', error });
    }}

async function add(req: Request, res: Response) {
    try {
        const usuario = new Usuario(
            req.body.nombre,
            req.body.apellido,
            req.body.dni,
            req.body.fechaNacimiento,
            req.body.mail,
            req.body.id
        );
        const result = await repository.add(usuario);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el usuario', error });
    }}

 async function update(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const usuario = new Usuario(
            req.body.nombre,
            req.body.apellido,
            req.body.dni,
            req.body.fechaNacimiento,
            req.body.mail,
            req.body.id
        );
        const result = await repository.update({ id }, usuario);
        res.json(result);
    }   catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error });
    }  
}

async function remove(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const result = await repository.remove({ id });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error });
    }
}


export {findAll, findOne, add, update, remove}
