const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateJWT, isAdmin } = require('../middleware/authMiddleware');

// Painel administrativo protegido
router.get('/dashboard', authenticateJWT, isAdmin, adminController.dashboard);

module.exports = router;
