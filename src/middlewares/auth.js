require("dotenv").config()
const jwt = require("jsonwebtoken")

function requireAuth(req, res, next) {
  try {
    const headerAuthorization = req.headers.authorization
    if (!headerAuthorization) {
      return res.status(401).json({ error: "Acceso no autorizado" })
    }
    const bearerAuthorization = headerAuthorization.split(" ")[0]
    const token = headerAuthorization.split(" ")[1]
    if (bearerAuthorization !== "Bearer" || !token) {
      return res.status(401).json({ error: "Acceso no autorizado" })
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload
    next()
  } catch (error) {
    return res.status(401).json({ error: "Acceso no autorizado" })
  }
}

module.exports = { requireAuth }
