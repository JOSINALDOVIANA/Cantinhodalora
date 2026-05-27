

import path from 'path';
import * as fs from 'fs';
import Crypto from 'crypto';

import { fileURLToPath } from 'url';
import { promisify } from 'util';

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
        await conexao("user_images").insert({ image_id: id, user_id });
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
    const { id, key } = req.query

    try {
        await conexao("images").del().where({ id });
        promisify(fs.unlink)(path.resolve(__dirname, "..", "..", "tmp", "uploads", `${key}`), (err) => {
            if (err) { console.log("não foi possivel apagar o arquivo"); console.log(err) }
            else { console.log('aquivo deletado'); };
        })

        return res.json({ status: true, mensagem: "apagada" })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, mensagem: "error ao excluir" })
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
    let { user_id } = req.query // id do user
    let { id } = req.query // id da imagem
    let { product_id } = req.query// id do produto
    let { is_product } = req.query// se é ou não produto

    if (!!user_id) {
        try {
            let images = await conexao("user_images").where({ is_product: false, user_id }).join("images", "user_images.image_id", "=", "images.id").select("images.*")

            for (const key in images) {
                images[key].delete = `${process.env.SERVER_URL}api/images?id=${images[key].id}&key=${images[key].key}`
                images[key].url = `${process.env.SERVER_URL}api/static/images/${images[key].key}`;
            }
            return res.json({ status: true, images })
        } catch (error) {
            console.log(error)
            return res.json({ status: false, mensagem: "error ao consultar por id do user" })
        }
    };

    if (!!id) {
        try {
            let images = await conexao("images").where({ id }).select("*")

            for (const key in images) {
                images[key].delete = `${process.env.SERVER_URL}api/images?id=${images[key].id}&key=${images[key].key}`
                images[key].url = `${process.env.SERVER_URL}api/static/images/${images[key].key}`;
            }
            return res.json({ status: true, images })
        } catch (error) {
            console.log(error)
            return res.json({ status: false, mensagem: "error ao consultar" })
        }
    };

    if (!!product_id) {
        try {
            let images = await conexao("product_images")
                .where({ is_product: true, product_id })
                .join("images", "product_images.image_id", "=", "images.id")
                .select("images.*")

            for (const key in images) {
                images[key].delete = `${process.env.SERVER_URL}api/images?id=${images[key].id}&key=${images[key].key}`
                images[key].url = `${process.env.SERVER_URL}api/static/images/${images[key].key}`;
            }
        } catch (error) {
            console.log(error)
            return res.json({ status: false, mensagem: "error ao consultar por id do produto" })
        };
    };

    if (is_product) {
        try {
            let images = await conexao("images").where({ is_product: true }).select("*")
            for (const key in images) {
                images[key].delete = `${process.env.SERVER_URL}api/images?id=${images[key].id}&key=${images[key].key}`
                images[key].url = `${process.env.SERVER_URL}api/static/images/${images[key].key}`;
            }
            return res.json({ status: true, images })
        } catch (error) {
            console.log(error)
            return res.json({ status: false, mensagem: "error ao consultar por id do produto" })
        }
    };




    try {
        let images = await conexao("images").select("*").where({ is_product: false })
        // console.log(images)
        for (const key in images) {
            images[key].delete = `${process.env.SERVER_URL}api/images?id=${images[key].id}&key=${images[key].key}`
            images[key].url = `${process.env.SERVER_URL}api/static/images/${images[key].key}`;
        }
        return res.json({ status: true, images })
    } catch (error) {
        console.log(error)
        return res.json({ status: false, mensagem: "error ao consultar por id da imagem" })
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
            status: true, id, name, size, key, url: `${process.env.SERVER_URL}api/static/images/${key}`, delete: `${process.env.SERVER_URL}api/images?id=${id}&key=${key}`, is_product: true
        });
    } catch (error) {
        console.error(error)
        return res.json({
            status: false, mensagem: "error"
        })
    }

};

// export const deleteIMGprod = async (req,res)=>{
//         const {id,key}=req.query
//         console.log(req.query)
//         try {
//            await conexao("images").del().where({id});
//            promisify(fs.unlink)(path.resolve(__dirname, "..","..","tmp", "uploads", `${key}`), (err) => {
//             if (err) { console.log("não foi possivel apagar o arquivo"); }
//             else { console.log('aquivo deletado'); };
//         })

//            return res.json({status:true,mensagem:"apagada"})
//         } catch (error) {
//             console.log(error)
//             return res.json({status:false,mensagem:"error ao excluir"})
//         }
//     };

// export const selectIMGprod = async (req, res) => {
//     let { id } = req.query;
//     let images = [];

//     try {
//         if (!!id) {
//             images = await conexao("images").where({ is_product: true, id })
//         } else {
//             images = await conexao("images").where({ prod: true })
//         }
//         for (const key in images) {
//             images[key].delete = `${process.env.SERVER_URL}api/images/prod?id=${images[key].id}&key=${images[key].key}`;
//             images[key].url = `${process.env.SERVER_URL}api/static/images/${images[key].key}`;

//         }
//         return res.json({ status: true, images })
//     } catch (error) {
//         console.log(error)
//         return res.json({ status: false, mensagem: "error ao consultar" })
//     }
// }


