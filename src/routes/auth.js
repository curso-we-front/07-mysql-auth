const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth');

/**
 * Tarea 2: Define las rutas de autenticación y conéctalas con los controladores.
 *
 * POST /auth/register → register
 * POST /auth/login    → login
 */

// TODO: implementar
router.post('/register', register)
router.post('/login', login)

module.exports = router;
