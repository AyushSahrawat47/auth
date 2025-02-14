import express from 'express';
const router = express.Router();
import { register, login, verifyOtp, requestPasswordReset, resetPassword } from '../controllers/auth.controller.js';

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;
