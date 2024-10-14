import express from 'express';
import cors from 'cors';


import {usuarioRouter} from './src/routes/usuario.route.js';
import {prodRouter} from './src/routes/prod.route.js';
import {tipoRouter} from './src/routes/tipo.route.js';
import {empresaRouter} from './src/routes/empresa.route.js';
import { transportistaRouter } from './src/routes/transportista.route.js';
import { pedidoRouter } from './src/routes/pedido.route.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:8080/'
}));

app.use(express.json());
app.use('/api/usuario', usuarioRouter);
app.use('/api/producto', prodRouter);
app.use('/api/tipoP', tipoRouter);
app.use('/api/empresa', empresaRouter);
app.use('/api/transportista', transportistaRouter);
app.use('/api/pedido', pedidoRouter);

const PORT = process.env.PORT || 3000;

console.log(`Iniciando el servidor en el puerto ${PORT}`);
app.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`Puedes abrir el servidor en: ${url}`);
});