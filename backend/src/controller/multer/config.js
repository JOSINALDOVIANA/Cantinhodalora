

import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

// Garante que o diretório de uploads exista no início da aplicação
const uploadDir = path.resolve(__dirname, '..', '..', '..', 'tmp', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

export const multerConfig = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) {
                    console.error('Erro ao gerar bytes aleatórios:', err);
                    return cb(err);
                }
                
                // Sanitiza o nome do arquivo para evitar quebra de URLs e problemas de codificação
                const sanitizedOriginalName = file.originalname
                    .replace(/\s+/g, '_')
                    .replace(/[^a-zA-Z0-9.\-_]/g, '');

                file.key = `${hash.toString('hex')}-${sanitizedOriginalName}`;
                cb(null, file.key);
            });
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite realista e seguro de 5MB por imagem
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif',
            'image/jpg',
            'image/svg+xml', // MIME Type correto para SVG
            'image/webp'
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de arquivo inválido. Apenas imagens são permitidas.'));
        }
    }
};

const upload = multer(multerConfig).single('file');

// Middleware customizado para capturar erros do Multer e ausência de arquivos
export const uploadSingle = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                status: false,
                mensagem: err.message || 'Erro ao realizar upload do arquivo.'
            });
        }

        // Garante que um arquivo foi de fato enviado
        if (!req.file) {
            return res.status(400).json({
                status: false,
                mensagem: 'Nenhum arquivo de imagem foi enviado.'
            });
        }

        next();
    });
};

export default multerConfig;