require('dotenv').config();
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../db/users');

/**
 * Tarea 2a: Registro de usuario.
 *
 * POST /auth/register
 * Body: { name, email, password }
 *
 * - Llama a createUser() para crear el usuario
 * - Genera un JWT con payload { id, email, role } usando JWT_SECRET y JWT_EXPIRES_IN
 * - Responde 201 con { user, token }
 * - Responde 409 si el email ya existe (el error de MySQL tiene código 'ER_DUP_ENTRY')
 */
async function register(req, res, next) {
  // TODO: implementar
}

/**
 * Tarea 2b: Login de usuario.
 *
 * POST /auth/login
 * Body: { email, password }
 *
 * - Busca el usuario con findUserByEmail()
 * - Compara la contraseña con bcrypt.compare()
 * - Genera un JWT con payload { id, email, role }
 * - Responde 200 con { user, token }
 * - Responde 401 si el email no existe o la contraseña es incorrecta
 *   (usa siempre el mismo mensaje para no filtrar información)
 */
async function login(req, res, next) {
  // TODO: implementar
}

module.exports = { register, login };
