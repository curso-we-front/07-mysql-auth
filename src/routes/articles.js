const express = require('express');
const router = express.Router();
const { validateArticle } = require('../middlewares/validate');
const { getAll, getById, create, update, remove } = require('../controllers/articles');

// Tarea 4: descomenta esta línea cuando hayas completado la Tarea 3
// const { requireAuth } = require('../middlewares/auth');

router.get('/', getAll);
router.get('/:id', getById);

// Tarea 4: añade requireAuth como middleware antes del handler en las rutas de escritura
router.post('/', validateArticle, create);
router.put('/:id', update);
router.patch('/:id', update);
router.delete('/:id', remove);

module.exports = router;
