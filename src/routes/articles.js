const express = require("express")
const router = express.Router()
const { validateArticle } = require("../middlewares/validate")
const { getAll, getById, create, update, remove } = require("../controllers/articles")

const { requireAuth } = require("../middlewares/auth")

router.get("/", getAll)
router.get("/:id", getById)
router.post("/", requireAuth, validateArticle, create)
router.put("/:id", requireAuth, update)
router.patch("/:id", requireAuth, update)
router.delete("/:id", requireAuth, remove)

module.exports = router
