const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify/:userId/:uniqueString', authController.verifyEmail);
router.get('/verify', authController.getVerificationPage);
module.exports = router;