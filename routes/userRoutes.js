const express = require('express');
const userController = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const router = express.Router();

// Rotas públicas: criação e busca simples
router.get('/search', userController.searchUsers);
router.get('/new', userController.renderCreateForm);
router.post('/', userController.createUser);

// Rotas protegidas (administrativo)
router.get('/', authenticateJWT, userController.getAllUsers);
router.get('/:id', authenticateJWT, userController.getUserById);
router.get('/:id/edit', authenticateJWT, userController.renderEditForm);
router.put('/:id', authenticateJWT, userController.updateUser);
router.delete('/:id', authenticateJWT, userController.deleteUser);

module.exports = router;