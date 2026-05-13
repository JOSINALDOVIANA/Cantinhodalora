

import path from 'path';
import * as fs from 'fs';
import Crypto from 'crypto';

import { fileURLToPath } from 'url';
import { promisify } from 'util';

import conexao from '../database/conexao.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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


