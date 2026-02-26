require('dotenv').config();
const jwt = require('jsonwebtoken');

/**
 * Tarea 3: Middleware de autenticación JWT.
 *
 * 1. Extrae el token del header: Authorization: Bearer <token>
 * 2. Verifica el token con JWT_SECRET
 * 3. Adjunta el payload decodificado a req.user
 * 4. Llama next() si todo está bien
 * 5. Responde 401 si:
 *    - No hay header Authorization
 *    - El formato no es "Bearer ..."
 *    - El token es inválido o expiró
 */
function requireAuth(req, res, next) {
  // TODO: implementar
}

module.exports = { requireAuth };
