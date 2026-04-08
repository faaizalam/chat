import { refreshAccessToken, loginOrSignup } from '../controllers/user.js';
import express from 'express';

const router = express.Router();

router.post('/google', loginOrSignup);
router.post('/refresh', refreshAccessToken);
export default router;
