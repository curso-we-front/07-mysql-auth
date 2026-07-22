const pool = require("./connection")
const bcrypt = require("bcrypt")

const SALT_ROUNDS = 10

async function createUser({ name, email, password }) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
  const [result] = await pool.query(
    `INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)`,
    [name, email, hashedPassword],
  )
  const [rows] = await pool.query(
    `
    SELECT id, name, email, role FROM users WHERE id = ?`,
    [result.insertId],
  )
  return rows[0]
}

async function findUserByEmail(email) {
  const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email])
  return rows[0] || null
}

async function findUserById(id) {
  const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`[id])
  return rows[0] || null
}

module.exports = { createUser, findUserByEmail, findUserById }
