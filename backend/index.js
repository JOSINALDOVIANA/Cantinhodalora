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
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const api = express();
api.set('trust proxy', 1);
const server = http.createServer(api); // 🔑 servidor HTTP

// Configuração do Socket.IO
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'https://www.cantinhodalora.info', 'https://cantinhodalora.info'],
        methods: ["GET", "POST"]
    }
});

// Middleware para parsing JSON e URL-encoded
api.use(bodyParser.json({ limit: '50mb' }));
api.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 100000 }));

//Middleware cors
api.use(cors({
    origin: ['http://localhost:3000', 'https://www.cantinhodalora.info', 'https://cantinhodalora.info'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type", "Authorization"],
}));


//Middleware cookie-parser
api.use(cookieParser());



// Função para gerar tokens
export function gerarTokens(user) {
    const accessToken = jwt.sign(user, process.env.ACCESS_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET, { expiresIn: "1d" });
    return { accessToken, refreshToken };
}
// Middleware para verificar Access Token
export function autenticarJWT(req, res, next) {
    // console.log("Token =>", req.cookies.accessToken);
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).send("Token ausente");

    jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
        if (err) return res.status(403).send("Token inválido");
        req.user = user;
        next();
    });
}

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Cantinho da Lora",
            version: "1.0.0",
            description: "Documentação da API do Cantinho da Lora"
        },
    },
    apis: ["./src/routes/*.js", "./src/controller/*.js"], // arquivos onde estão suas rotas e controllers
};

const specs = swaggerJSDoc(options);







// swagger docs
api.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

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
        io.emit('chatMessage', { text: `${user?.name || 'Um usuário'} entrou do chat`, Origem: { name: 'Sistema', id: 'sistema', cor: 'text.secondary' }, destino: 'all', from: 'public' })
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
        io.emit('chatMessage', { text: `${u?.name || 'Um usuário'} saiu do chat`, Origem: { name: 'Sistema', id: 'sistema', cor: 'text.secondary' }, destino: 'all', from: 'public' });
        io.emit('usuariosOnline', usuariosOnline);
        console.log('Usuário desconectado:', socket.id);
    });
});


// Porta
const port = process.env.PORT || 3001;
server.listen(port, '0.0.0.0', () => { // 🔑 agora usa server.listen
    console.log(`Servidor rodando na porta ${port}`);
});