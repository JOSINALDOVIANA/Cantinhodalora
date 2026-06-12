import express from 'express';
import { uploadSingle } from '../controller/multer/config.js';
import { deleteImage, selectImages, uploadIMGprod, uploadIMGuser } from '../controller/imagesController.js';
import { autenticarJWT } from '../functions/TokenJWT.js';

const router = express.Router();

// GET /api/images/getAllImages
router.get('/getAllImages', selectImages);

// POST /api/images/uploadUser
router.post('/uploadUser', autenticarJWT, uploadSingle, uploadIMGuser);

// POST /api/images/uploadProduct
router.post('/uploadProduct', autenticarJWT, uploadSingle, uploadIMGprod);

// DELETE /api/images
router.delete('/', autenticarJWT, deleteImage);

export default router;