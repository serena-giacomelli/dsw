import 'reflect-metadata';
import cors from 'cors';
import express from 'express';

import {usuarioRouter} from './src/routes/usuario.route.js';
import {prodRouter} from './src/routes/prod.route.js';
import {tipoRouter} from './src/routes/tipo.route.js';
import {empresaRouter} from './src/routes/empresa.route.js';
import { transportistaRouter } from './src/routes/transportista.route.js';
import { pedidoRouter } from './src/routes/pedido.route.js';
import {pagoRouter} from './src/routes/pago.route.js';
import { sucursalRouter } from './src/routes/sucursal.route.js';
import { marcaRouter } from './src/routes/marca.route.js';
import { provinciaRouter } from './src/routes/provincia.route.js';
import { localidadRouter } from './src/routes/localidad.route.js';
import { lineaPedRouter } from './src/routes/lineaPed.route.js';


import { orm, syncSchema } from './src/shared/db/orm.js';
import { RequestContext } from '@mikro-orm/core';

const app = express();
app.use(cors({
    origin: 'http://localhost:9000/'}));

//luego de los middlewares base de express
app.use((req, res, next) => {
    RequestContext.create(orm.em, next);});
//antes de las rutas de negocio

app.use(express.json());
app.use('/api/usuario', usuarioRouter);
app.use('/api/producto', prodRouter);
app.use('/api/tipoP', tipoRouter);
app.use('/api/empresa', empresaRouter);
app.use('/api/transportista', transportistaRouter);
app.use('/api/pedido', pedidoRouter);
app.use('/api/pago', pagoRouter);
app.use('/api/sucursal', sucursalRouter);
app.use('/api/marca', marcaRouter);
app.use('/api/provincia', provinciaRouter);
app.use('/api/localidad', localidadRouter);
app.use('/api/lineaPed', lineaPedRouter);


const PORT = process.env.PORT || 3000;

console.log(`Iniciando el servidor en el puerto ${PORT}`);
await syncSchema();
app.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`Puedes abrir el servidor en: ${url}`);
});