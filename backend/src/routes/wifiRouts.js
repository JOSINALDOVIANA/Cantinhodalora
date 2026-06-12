import express from 'express';
import { autenticarJWT } from '../functions/TokenJWT.js';
import {
  getAllWifiConfigs,
  getWifiConfigById,
  createWifiConfig,
  updateWifiConfig,
  deleteWifiConfig,
} from '../controller/wifiController.js';

const router = express.Router();

// GET /api/wifi
router.get('/', getAllWifiConfigs);

// GET /api/wifi/:id
router.get('/:id', getWifiConfigById);

// POST /api/wifi
router.post('/', autenticarJWT, createWifiConfig);

// PUT /api/wifi/:id
router.put('/:id', autenticarJWT, updateWifiConfig);

// DELETE /api/wifi/:id
router.delete('/:id', autenticarJWT, deleteWifiConfig);

export default router;
