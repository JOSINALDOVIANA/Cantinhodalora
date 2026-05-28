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
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const api = express();

// Middleware para parsing JSON e URL-encoded
api.use(bodyParser.json({ limit: '50mb' }));
api.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 100000 }));

//Middleware cors
api.use(cors({
    origin: ['http://localhost:3000', 'https://www.cantinhodalora.info','https://cantinhodalora.info'],
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
    console.log("Token =>");
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
api.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

//static images
api.use('/api/static/images', express.static(path.resolve(__dirname, 'tmp', 'uploads')))


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