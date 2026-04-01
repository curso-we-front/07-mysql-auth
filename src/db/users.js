const pool = require("./connection");
const bcrypt = require("bcrypt");

/**
 * Tarea 1a: Crear un nuevo usuario.
 *
 * - Hashea `password` con bcrypt (usa SALT_ROUNDS)
 * - Inserta el usuario en la tabla `users`
 * - Devuelve el usuario creado SIN el campo password_hash
 *
 * @param {{ name: string, email: string, password: string }} data
 * @returns {Promise<object>} usuario creado
 */
async function createUser({ name, email, password }) {
  const SALT_ROUNDS = 10;
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  const [result] = await pool.execute(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    [name, email, password_hash],
  );

  const [rows] = await pool.execute(
    "SELECT id, name, email, role FROM users WHERE id = ?",
    [result.insertId],
  );

  return rows[0];
}

/**
 * Tarea 1b: Buscar un usuario por email.
 *
 * @param {string} email
 * @returns {Promise<object|null>} usuario encontrado o null
 */
async function findUserByEmail(email) {
  const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return user[0] || null;
}

/**
 * Tarea 1c: Buscar un usuario por id.
 *
 * @param {number} id
 * @returns {Promise<object|null>} usuario encontrado o null
 */
async function findUserById(id) {
  const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return user[0] || null;
}

module.exports = { createUser, findUserByEmail, findUserById };
