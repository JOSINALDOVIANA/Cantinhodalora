import express from 'express';
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controller/categoriesController.js';
import { autenticarJWT } from '../../index.js';

const router = express.Router();

// GET /api/categories
router.get('/', getAllCategories);

// POST /api/categories
router.post('/', autenticarJWT, createCategory);

// GET /api/categories/:id
router.get('/:id', getCategoryById);

// PUT /api/categories/:id
router.put('/:id', autenticarJWT, updateCategory);

// DELETE /api/categories/:id
router.delete('/:id', autenticarJWT, deleteCategory);

export default router;