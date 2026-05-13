import express from 'express';
import multer from 'multer';
import config from '../controller/multer/config.js';
import {deleteImage,selectImages,uploadIMGprod,uploadIMGuser } from '../controller/imagesController.js';

const router = express.Router();

// GET /api/images
// pode mandar user_id do user, id da imagem ou product_id do produto para consultar as imagens relacionadas
router.get('/getAllImages', async(req,res)=> selectImages(req,res));

// POST /api/images
router.post('/uploadUser',multer(config).single('file'), async (req, res) => uploadIMGuser(req,res));
// POST /api/images
router.post('/uploadProduct',multer(config).single('file'),async (req, res) => uploadIMGprod(req,res));
// DELETE /api/images
router.delete('/', async (req, res) => deleteImage(req, res));

export default router;