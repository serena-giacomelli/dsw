import {Request, Response, NextFunction} from 'express'
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
    }
}

export { findAll, findOne };