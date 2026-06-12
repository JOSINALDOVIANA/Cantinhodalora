import express from 'express';
import { getAllUsers, createUser, updateUser, deleteUser, userLogin, userRefresh, userLogout } from '../controller/usersController.js';
import { autenticarJWT } from '../functions/TokenJWT.js';

const router = express.Router();

// GET /api/users
router.get('/', autenticarJWT, getAllUsers);

// POST /api/users
router.post('/', createUser);

// POST /api/users/login
router.post('/login', userLogin);

// PUT /api/users/:id
router.put('/:id', autenticarJWT, updateUser);

// DELETE /api/users/:id
router.delete('/:id', autenticarJWT, deleteUser);

// POST /api/users/refresh
router.post("/refresh", userRefresh);

// POST /api/users/logout
router.post("/logout", userLogout);

export default router;