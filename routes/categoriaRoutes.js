const express = require('express');
const categoriaController = require('../controllers/categoriaController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authenticateJWT);

router.get('/', categoriaController.getAllCategorias);
router.get('/new', categoriaController.renderCreateForm);
router.post('/', categoriaController.createCategoria);
router.get('/:id', categoriaController.getCategoriaById);
router.get('/:id/edit', categoriaController.renderEditForm);
router.put('/:id', categoriaController.updateCategoria);
router.delete('/:id', categoriaController.deleteCategoria);

module.exports = router;