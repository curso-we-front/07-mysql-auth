require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createUser, findUserByEmail } = require("../db/users");

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
  try {
    const user = await createUser(req.body);
    const { id, role, email } = user;
    const payload = { id: id, email: email, role: role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return res.status(201).json({ user, token });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ Error: "Email address already registered" });
    }
  }
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
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ Error: "Incorrect email or password" });
  }
  const isCorrectPassword = await bcrypt.compare(password, user.password_hash);
  if (!isCorrectPassword) {
    return res.status(401).json({ Error: "Incorrect email or password" });
  }
  const { id, role } = user;
  const payload = { id: id, email: email, role: role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      created_at: user.created_at,
    },
    token,
  });
}

module.exports = { register, login };
