import { searchBuses, getBusDetails } from '../controllers/bus.js';
import express from 'express';

const router = express.Router();

router.post('/search', searchBuses);
router.get('/:busId', getBusDetails);
export default router;
