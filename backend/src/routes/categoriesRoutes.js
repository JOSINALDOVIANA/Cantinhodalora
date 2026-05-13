import express from 'express';
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controller/categoriesController.js';

const router = express.Router();

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/categories
router.post('/', async (req, res) => {
  try {
    const categoria = await createCategory(req.body);
    res.status(201).json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/categories/:id
router.get('/:id', async (req, res) => {
  try {
    const categoria = await getCategoryById(req.params.id);
    res.json(categoria);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// PUT /api/categories/:id
router.put('/:id', async (req, res) => {
  try {
    const categoria = await updateCategory(req.params.id, req.body);
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteCategory(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;