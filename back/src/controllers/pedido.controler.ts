import { Request, Response } from "express";
import { PedidoRepository } from '../repositories/pedido.repository.js'
import { Pedido } from '../models/pedido.entity.js'

const repository = new PedidoRepository()

async function findAll(req: Request, res: Response) {
    const pedidos = await repository.findAll();
    res.json(pedidos);
}


async function findOne(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const pedido = await repository.findOne({ id });
        if (pedido) {
            res.json(pedido);
        } else {
            res.status(404).json({ message: 'pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el pedido', error });
    }
}

async function add(req: Request, res: Response) {
    try {
        const pedido = new Pedido(
            req.body.id,
            req.body.fecha_pedido,
            req.body.total,
            req.body.tipo_entrega,
            req.body.estado,
            req.body.id_usuario,
            req.body.id_transportista
        );
        const result = await repository.add(pedido);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el pedido', error });
    }
}

async function update(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const pedido = new Pedido(
            req.body.id,
            req.body.fecha_pedido,
            req.body.total,
            req.body.tipo_entrega,
            req.body.estado,
            req.body.id_usuario,
            req.body.id_transportista
        );
        const result = await repository.update({ id }, pedido);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el pedido', error });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const result = await repository.remove({ id });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el pedido', error });
    }
}


export { findAll, findOne, add, update, remove }