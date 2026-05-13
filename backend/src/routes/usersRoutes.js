import express from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, userLogin } from '../controller/usersController.js';

const router = express.Router();

// GET /api/users
// GET /api/users?user_id=1
router.get('/', async (req, res) => getAllUsers(req, res));

// POST /api/users
router.post('/', async (req, res) => createUser(req, res));

// GET /api/users/login
router.post('/login', async (req, res) => userLogin(req, res));


// PUT /api/users/:id
router.put('/:id', async (req, res) => updateUser(req, res));

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => deleteUser(req, res));

export default router;