const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../db/users");
const bcrypt = require("bcrypt");

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
  try {
    const { name, email, password } = req.body;

    const user = await createUser({ name, email, password });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "El email ya existe" });
    }
    next(error);
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
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password_hash,
    );

    if (!validPassword) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );

    const newUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({ newUser, token });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login };
