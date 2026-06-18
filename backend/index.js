import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import { fileURLToPath } from 'url';
import path, { parse } from 'path';


import cors from 'cors';
import usersRoutes from './src/routes/usersRoutes.js';
import productsRoutes from './src/routes/productsRoutes.js';
import categoriesRoutes from './src/routes/categoriesRoutes.js';
import clientsRoutes from './src/routes/clientsRoutes.js';
import imagesRoutes from './src/routes/imagesRoutes.js';
import wifiRoutes from './src/routes/wifiRouts.js';
import chatRoutes from './src/routes/chatRoutes.js';



import { options, swaggerOptions } from './src/functions/swaggerOptions.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';
import { Iocors } from './src/functions/server_Io_conf.js';//cors para o socket io



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const api = express();
api.set('trust proxy', 1);
const server = http.createServer(api); // 🔑 servidor HTTP

// Configuração do Socket.IO
const io = new Server(server, Iocors);

// Middleware para parsing JSON e URL-encoded
api.use(bodyParser.json({ limit: '50mb' }));
api.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 100000 }));

//Configuração cors para o express
api.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'https://www.cantinhodalora.info', 'https://cantinhodalora.info'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type", "Authorization"],
}));


//Middleware cookie-parser
api.use(cookieParser());

// swagger docs
const specs = swaggerJSDoc(options);
api.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

//static images
api.use('/api/static/images', express.static(path.resolve(__dirname, 'tmp', 'uploads')))


// Usar as rotas específicas
api.use('/api/users', usersRoutes);
api.use('/api/products', productsRoutes);
api.use('/api/categories', categoriesRoutes);
api.use('/api/clients', clientsRoutes);
api.use('/api/images', imagesRoutes);
api.use('/api/wifi', wifiRoutes);
api.use('/api/chat', chatRoutes); // ✅ nova rota

// 🔥 Eventos do Socket.IO
let usuariosOnline = [];
let mensagens = [];
io.on('connection', (socket) => {
    console.log('Novo usuário conectado:', socket.id);

    // se registra e é adicionado à lista de onlines, e recebe a lista atualizada
    socket.on('registrarUsuario', (user) => {
        usuariosOnline.push({ ...user, id: socket.id });
        io.emit('usuariosOnline', usuariosOnline);
        io.emit('chatMessage', { text: `${user?.name || 'Um usuário'} entrou no chat`, origem: { name: 'Sistema', id: 'sistema', cor: 'text.secondary' }, destino: 'all', from: 'public' })
        // socket.join('global');
    });

    // socket.on('joinRoom', (room) => {
    //     socket.join(room);
    // });
    socket.on('chatMessage', (msg) => {
        mensagens.push(msg);
        // se for mensagem global, envia para todos, senão só para a sala
        // if (msg.sala === 'global') {
        io.emit('chatMessage', msg);
        // }
    });

    socket.on('disconnect', (a) => {
        let u = usuariosOnline.filter(u => u.id === socket.id)[0];

        usuariosOnline = usuariosOnline.filter(u => u.id !== socket.id);
        io.emit('chatMessage', { text: `${u?.name || 'Um usuário'} saiu do chat`, origem: { name: 'Sistema', id: 'sistema', cor: 'text.secondary' }, destino: 'all', from: 'public' });
        io.emit('usuariosOnline', usuariosOnline);
        console.log('Usuário desconectado:', socket.id);
    });
});


// iniciando o serv
const port = process.env.PORT || 3001;
server.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${port}`);
});