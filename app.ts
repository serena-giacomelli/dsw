import express from 'express';
import path from 'path';
import cors from 'cors';


import {usuarioRouter} from './src/routes/usuario.route.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:8080/'
}));

app.use(express.json());

app.use('/api/usuario', usuarioRouter);

const PORT = process.env.PORT || 3000;

console.log(`Iniciando el servidor en el puerto ${PORT}`);
app.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`Puedes abrir el servidor en: ${url}`);
});