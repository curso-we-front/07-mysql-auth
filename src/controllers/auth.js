require("dotenv").config()
const jwt = require("jsonwebtoken")
const { createUser, findUserByEmail } = require("../db/users")
const bcrypt = require("bcrypt")

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body
    const user = await createUser({ name, email, password })
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
    )
    res.status(201).json({ user, token })
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Este email ya existe" })
    }
    next(error)
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body
    const user = await findUserByEmail(email)
    if (!user) {
      return res.status(401).json({ error: "Email o contraseña incorrectos" })
    }
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ error: "Email o contraseña incorrectos" })
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
    )
    const newUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      created_at: user.created_at,
    }
    res.status(200).json({ user: newUser, token })
  } catch (error) {
    next(error)
  }
}

module.exports = { register, login }
