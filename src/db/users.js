const pool = require('./connection');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

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
  // TODO: implementar
}

/**
 * Tarea 1b: Buscar un usuario por email.
 *
 * @param {string} email
 * @returns {Promise<object|null>} usuario encontrado o null
 */
async function findUserByEmail(email) {
  // TODO: implementar
}

/**
 * Tarea 1c: Buscar un usuario por id.
 *
 * @param {number} id
 * @returns {Promise<object|null>} usuario encontrado o null
 */
async function findUserById(id) {
  // TODO: implementar
}

module.exports = { createUser, findUserByEmail, findUserById };
