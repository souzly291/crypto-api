import { Router } from 'express';
import { getCryptoPrices, clearLocalData } from '../controllers/crypto.controller.js';

const router = Router();

// Ruta principal (GET /api/coins)
router.get('/coins', getCryptoPrices);

// Ruta extra para resetear (DELETE /api/coins)
router.delete('/coins', clearLocalData);

export default router;