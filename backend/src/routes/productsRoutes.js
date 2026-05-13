import express from 'express';
import { getAllProducts,  createProduct, updateProduct, deleteProduct } from '../controller/productsController.js';

const router = express.Router();

// GET /api/products
router.get('/', async (req, res) => getAllProducts(req,res));

// POST /api/products
router.post('/', async (req, res) => createProduct(req,res));

// GET /api/products/:id
// router.get('/:id', async (req, res) => {
//   try {
//     const produto = await getProductById(req.params.id);
//     res.json(produto);
//   } catch (error) {
//     res.status(404).json({ error: error.message });
//   }
// });

// PUT /api/products/:id
router.put('/:id', async (req, res) => updateProduct(req,res));

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => deleteProduct(req,res));

export default router;