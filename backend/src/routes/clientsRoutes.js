import express from 'express';
import {autenticarJWT} from '../../index.js';
import { getAllClients, getClientById, createClient, updateClient, deleteClient } from '../controller/clientsController.js';

const router = express.Router();

// GET /api/clients
router.get('/', async (req, res) => {
  try {
    const clients = await getAllClients();
    res.json({ clients });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/clients
router.post('/',autenticarJWT, async (req, res) => {
  try {
    const cliente = await createClient(req.body);
    res.status(201).json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/clients/:id
router.get('/:id', async (req, res) => {
  try {
    const cliente = await getClientById(req.params.id);
    res.json(cliente);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// PUT /api/clients/:id
router.put('/:id', async (req, res) => {
  try {
    const cliente = await updateClient(req.params.id, req.body);
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/clients/:id
router.delete('/:id',autenticarJWT, async (req, res) => {
  try {
    const result = await deleteClient(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;