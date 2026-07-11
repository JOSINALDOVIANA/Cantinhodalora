

import path from 'path';
import * as fs from 'fs';
import Crypto from 'crypto';

import { fileURLToPath } from 'url';
import { promisify } from 'util';
import sharp from 'sharp';

import conexao from '../database/conexao.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @openapi
 * components:
 *   schemas:
 *     Image:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - key
 *       properties:
 *         id:
 *           type: string
 *           description: ID único da imagem
 *         name:
 *           type: string
 *           description: Nome original do arquivo da imagem
 *         size:
 *           type: string
 *           description: Tamanho do arquivo em bytes
 *         key:
 *           type: string
 *           description: Chave única gerada para o arquivo
 *         url:
 *           type: string
 *           description: URL pública de acesso à imagem
 *         delete:
 *           type: string
 *           description: Rota e query params para deletar a imagem
 *         is_product:
 *           type: boolean
 *           description: Define se a imagem está associada a um produto ou usuário
 *       example:
 *         id: "8c3b12ad76fc"
 *         name: "foto.jpg"
 *         size: "102400"
 *         key: "8c3b12ad76fc-foto.jpg"
 *         url: "http://localhost:3001/api/static/images/8c3b12ad76fc-foto.jpg"
 *         delete: "http://localhost:3001/api/images?id=8c3b12ad76fc&key=8c3b12ad76fc-foto.jpg"
 *         is_product: false
 */

/**
 * @openapi
 * tags:
 *   name: Images
 *   description: Upload, deleção e listagem de imagens do sistema (usuários e produtos)
 */

/**
 * @openapi
 * /api/images/uploadUser:
 *   post:
 *     summary: Realiza o upload de imagem de perfil de um usuário
 *     tags: [Images]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário proprietário da imagem
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de imagem a ser enviado (via Multer)
 *     responses:
 *       200:
 *         description: Upload realizado com sucesso e imagem vinculada ao usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Image'
 *       500:
 *         description: Erro ao realizar upload de imagem
 */
export const uploadIMGuser = async (req, res) => {
    let { originalname: name, size, key, location: url = '' } = req.file;
    let { user_id } = req.query;

    const id = `${Crypto.randomBytes(12).toString('HEX')}`;

    try {
        await conexao('images').insert({
            id,
            name,
            size,
            key,
            url,
            is_product: false

        });
       !!user_id? await conexao("user_images").insert({ image_id: id, user_id }):null;
        res.json({
            id, name, size, key,
            url: `${process.env.SERVER_URL}api/static/images/${key}`,
            delete: `${process.env.SERVER_URL}api/images?id=${id}&key=${key}`,
            is_product: false
        });
    } catch (error) {
        console.log(error)
        return res.json({
            status: false, mensagem: "error"
        })
    }

};
/**
 * @openapi
 * /api/images:
 *   delete:
 *     summary: Deleta uma imagem do banco de dados e do sistema de arquivos local
 *     tags: [Images]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da imagem a ser deletada
 *       - in: query
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Chave única do arquivo físico da imagem
 *     responses:
 *       200:
 *         description: Imagem deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 mensagem:
 *                   type: string
 *                   example: apagada
 *       500:
 *         description: Erro ao excluir imagem
 */
export const deleteImage = async (req, res) => {
    
    const { id, key } = req.query;

    // return res.json({status:true})

    try {
        // Exclui primeiro no banco
        await conexao("images").where({ id }).del();

        // Depois tenta excluir o arquivo
        const filePath = path.resolve(__dirname, "..", "..", "tmp", "uploads", key);
        try {
            await fs.promises.unlink(filePath);
            console.log("Arquivo deletado");
        } catch (err) {
            console.error("Não foi possível apagar o arquivo", err);
            // Aqui você pode registrar em log, fila de reprocessamento, etc.
        }

        return res.json({ status: true, mensagem: "apagada" });
    } catch (error) {
        console.error(error);
        return res.json({ status: false, mensagem: "erro ao excluir" });
    }
};

// export const selectIMGuser = async (req, res) => {
//     let { user_id } = req.query
//     try {
//         let images = await conexao("user_images").where({ is_product: false, user_id }).join("images", "user_images.id_image", "=", "images.id").select("images.*")

//         for (const key in images) {
//             images[key].delete = `${process.env.SERVER_URL}api/images?id=${images[key].id}&key=${images[key].key}`
//             images[key].url = `${process.env.SERVER_URL}api/static/images/${images[key].key}`;
//         }
//         return res.json({ status: true, images })
//     } catch (error) {
//         console.log(error)
//         return res.json({ status: false, mensagem: "error ao consultar" })
//     }
// };

/**
 * @openapi
 * /api/images/getAllImages:
 *   get:
 *     summary: Consulta imagens registradas
 *     description: Lista imagens baseado em filtros opcionais de consulta.
 *     tags: [Images]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: ID do usuário para obter suas imagens
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: ID de uma imagem específica
 *       - in: query
 *         name: product_id
 *         schema:
 *           type: string
 *         description: ID de um produto para obter suas imagens
 *       - in: query
 *         name: is_product
 *         schema:
 *           type: boolean
 *         description: Filtra para trazer todas as imagens que pertencem a produtos
 *     responses:
 *       200:
 *         description: Imagens retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 images:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Image'
 */
export const selectImages = async (req, res) => {
    const { user_id, id, product_id, is_product } = req.query;

    // Função auxiliar para adicionar URLs às imagens
    const formatImages = (images) => {
        return images.map(img => ({
            ...img,
            delete: `${process.env.SERVER_URL}api/images?id=${img.id}&key=${img.key}`,
            url: `${process.env.SERVER_URL}api/static/images/${img.key}`,
            urlfull: `${process.env.SERVER_URL}api/images/static/${img.key}`
        }));
    };

    try {
        let images;

        if (user_id) {
            images = await conexao("user_images")
                .where({ is_product: false, user_id })
                .join("images", "user_images.image_id", "=", "images.id")
                .select("images.*");
        } else if (id) {
            images = await conexao("images")
                .where({ id })
                .select("*");
        } else if (product_id) {
            images = await conexao("product_images")
                .where({ is_product: true, product_id })
                .join("images", "product_images.image_id", "=", "images.id")
                .select("images.*");
        } else if (is_product) {
            images = await conexao("images")
                .where({ is_product: true })
                .select("*");
        } else {
            images = await conexao("images")
                .where({ is_product: false })
                .select("*");
        }

        return res.json({ status: true, images: formatImages(images) });

    } catch (error) {
        console.error(error);
        return res.json({ status: false, mensagem: "Erro ao consultar imagens" });
    }
};


/**
 * @openapi
 * /api/images/uploadProduct:
 *   post:
 *     summary: Realiza o upload de imagem de um produto
 *     tags: [Images]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de imagem a ser enviado (via Multer)
 *     responses:
 *       200:
 *         description: Upload realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 size:
 *                   type: string
 *                 key:
 *                   type: string
 *                 url:
 *                   type: string
 *                 delete:
 *                   type: string
 *                 is_product:
 *                   type: boolean
 *       500:
 *         description: Erro ao realizar upload de imagem
 */
export const uploadIMGprod = async (req, res) => {
    let { originalname: name, size, key, location: url = '' } = req.file;
    // console.log(req.file)

    const id = `${Crypto.randomBytes(12).toString('HEX')}`;

    try {
        await conexao('images').insert({
            id,
            name,
            size,
            key,
            url,
            is_product: true

        });
        res.json({
            status: true,
            id,
            name,
            size,
            key,
            url: `${process.env.SERVER_URL}api/static/images/${key}`,
            urlfull: `${process.env.SERVER_URL}api/images/static/${key}`,
            delete: `${process.env.SERVER_URL}api/images?id=${id}&key=${key}`,
            is_product: true,

        });
    } catch (error) {
        console.error(error)
        return res.json({
            status: false, mensagem: "error"
        })
    }

};

// export const ImageStatic = async (req, res) => {
//     const filename = decodeURIComponent(req.params.filename);
//     const filePath = path.resolve(__dirname, '..', '..', 'tmp', 'uploads', filename);

//     try {
//         // exemplo: redimensionar para 300x300 e otimizar
//         const image = await sharp(filePath)
//             .resize(150, 150)        // redimensiona
//             .webp({ quality: 80, lossless: false })   // converte para WebP com compressão

//         res.set('Cache-Control', 'public, max-age=2592000, immutable');
//         res.type('image/webp').send(image);
//     } catch (err) {
//         res.status(404).send('Imagem não encontrada ou erro no processamento');
//     }
// }



export const ImageStatic = async (req, res) => {
    const filename = decodeURIComponent(req.params.filename);
    const width = parseInt(req.query.w) || 150;   // largura via query string (default 150)
    const height = parseInt(req.query.h) || 150;  // altura via query string (default 150)

    const filePath = path.resolve(__dirname, '..', '..', 'tmp', 'uploads', filename);

    // nome do cache inclui dimensões
    const cachedPath = path.resolve(
        __dirname,
        '..',
        '..',
        'tmp',
        'cache',
        `${filename}-${width}x${height}.webp`
    );

    try {
        // se já existe no cache, serve direto
        if (fs.existsSync(cachedPath)) {
            res.set('Cache-Control', 'public, max-age=31536000, immutable');
            res.type('image/webp');
            return fs.createReadStream(cachedPath).pipe(res);
        }

        // caso contrário, processa e salva no cache
        const transform = sharp(filePath)
            .resize(width, height)
            .webp({ quality: 100, lossless: false });

        fs.mkdirSync(path.dirname(cachedPath), { recursive: true });

        const writeStream = fs.createWriteStream(cachedPath);
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
        res.type('image/webp');

        // envia ao cliente e salva no cache ao mesmo tempo
        transform.pipe(writeStream);
        transform.pipe(res);

    } catch (err) {
        res.status(404).send('Imagem não encontrada ou erro no processamento');
    }
};










