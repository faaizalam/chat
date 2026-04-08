import { getUserTickets, bookTicket } from '../controllers/tickets.js';
import { verifyToken } from '../middelware/verify.js';
import express from 'express';
const router = express.Router();

router.get('/my-tickets', verifyToken, getUserTickets);
router.post('/book', verifyToken, bookTicket);
export default router;
