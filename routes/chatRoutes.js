const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// Abrir conversa para veículo (gera/converte conversa)
router.get('/veiculo/:veiculoId', authenticateJWT, chatController.openOrGetConversa);

module.exports = router;
