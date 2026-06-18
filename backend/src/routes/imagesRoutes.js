import express from 'express';
import { uploadSingle } from '../controller/multer/config.js';
import { deleteImage, selectImages, uploadIMGprod, uploadIMGuser, ImageStatic } from '../controller/imagesController.js';
import { autenticarJWT } from '../functions/TokenJWT.js';

const router = express.Router();

// GET /api/images/getAllImages
router.get('/getAllImages', selectImages);

// GET /api/images/static/:filename
router.get('/static/:filename', ImageStatic);

// POST /api/images/uploadUser
router.post('/uploadUser', autenticarJWT, uploadSingle, uploadIMGuser);

// POST /api/images/uploadProduct
router.post('/uploadProduct', autenticarJWT, uploadSingle, uploadIMGprod);

// DELETE /api/images
router.delete('/', autenticarJWT, deleteImage);

export default router;