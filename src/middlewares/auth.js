require("dotenv").config();
const jwt = require("jsonwebtoken");

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
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = payload;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = { requireAuth };
