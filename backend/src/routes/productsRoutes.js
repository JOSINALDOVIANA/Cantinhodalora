import express from 'express';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../controller/productsController.js';
import { autenticarJWT } from '../functions/TokenJWT.js';

const router = express.Router();

// GET /api/products
router.get('/', getAllProducts);

// POST /api/products
router.post('/', autenticarJWT, createProduct);

// PUT /api/products/:id
router.put('/:id', autenticarJWT, updateProduct);

// DELETE /api/products/:id
router.delete('/:id', autenticarJWT, deleteProduct);

export default router;