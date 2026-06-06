import express from 'express';
import db from '../database/conexao.js';

const router = express.Router();

// Buscar histórico
router.get('/', async (req, res) => {
    const mensagens = await db('mensagens').select('*').orderBy('criado_em', 'asc');
    res.json(mensagens);
});

// Limpar histórico
router.delete('/', async (req, res) => {
    await db('mensagens').del();
    res.send("Histórico apagado");
});

export default router;