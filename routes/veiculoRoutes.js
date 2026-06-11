const express = require('express');
const router = express.Router();
const veiculoController = require('../controllers/veiculoController');
const upload = require('../config/upload');
const { authenticateJWT, isAdmin } = require('../middleware/authMiddleware');

// Public catalog
router.get('/', veiculoController.index);
router.get('/new', authenticateJWT, isAdmin, veiculoController.renderCreate);
router.post('/', authenticateJWT, isAdmin, upload.array('photos', 12), veiculoController.create);
router.get('/:id', veiculoController.show);
router.get('/:id/edit', authenticateJWT, isAdmin, veiculoController.renderEdit);
router.put('/:id', authenticateJWT, isAdmin, upload.array('photos', 12), veiculoController.update);
router.delete('/:id', authenticateJWT, isAdmin, veiculoController.delete);

module.exports = router;
