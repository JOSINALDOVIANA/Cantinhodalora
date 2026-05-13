import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import { Router } from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path from 'path';
import requestIP from 'request-ip';
import cors from 'cors';
import usersRoutes from './src/routes/usersRoutes.js';
import productsRoutes from './src/routes/productsRoutes.js';
import categoriesRoutes from './src/routes/categoriesRoutes.js';
import clientsRoutes from './src/routes/clientsRoutes.js';
import imagesRoutes from './src/routes/imagesRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const api = express();

// Middleware para parsing JSON e URL-encoded
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));

// Middleware de debug para logar todas as requisições
// api.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Body:`, req.body);
//   next();
// });

api.use(requestIP.mw());

// Verificar IP autorizado
const ENABLE_IP_CHECK = process.env.ENABLE_IP_CHECK === 'true';
const ALLOWED_IPS = (process.env.ALLOWED_IPS || '127.0.0.1,::1,localhost,::ffff:127.0.0.1').split(',').map(ip => ip.trim());

// api.use((req, res, next) => {
//     const clientIp = req.clientIp;
//     console.log(`[IP] Requisição de: ${clientIp} | Headers:`, {
//         'x-forwarded-for': req.headers['x-forwarded-for'],
//         'x-real-ip': req.headers['x-real-ip'],
//         'remoteAddress': req.connection.remoteAddress,
//         'socket.remoteAddress': req.socket.remoteAddress
//     });

//     if (ENABLE_IP_CHECK) {
//         if (!ALLOWED_IPS.includes(clientIp)) {
//             console.log(`⛔ Bloqueado: ${clientIp} não está em [${ALLOWED_IPS.join(', ')}]`);
//             return res.status(403).json({ error: 'IP não autorizado' });
//         }
//         console.log(`✅ Permitido: ${clientIp}`);
//     }
//     next();
// });


api.use(cors({ exposedHeaders: [''] }));


const router = Router();


// Example routes
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

// Usar o router
api.use('/api/static/images', express.static(path.resolve(__dirname, 'tmp', 'uploads')))
api.use('/', router);

// Usar as rotas específicas
api.use('/api/users', usersRoutes);
api.use('/api/products', productsRoutes);
api.use('/api/categories', categoriesRoutes);
api.use('/api/clients', clientsRoutes);
api.use('/api/images', imagesRoutes);

// Definir a porta
const port = process.env.PORT || 3001;



// Iniciar o servidor
api.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});