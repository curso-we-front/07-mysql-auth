const express = require("express");
const router = express.Router();
const { validateArticle } = require("../middlewares/validate");
const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require("../controllers/articles");

// Tarea 4: descomenta esta línea cuando hayas completado la Tarea 3
const { requireAuth } = require("../middlewares/auth");

router.get("/", getAll);
router.get("/:id", getById);

// Tarea 4: añade requireAuth como middleware antes del handler en las rutas de escritura
router.post("/", requireAuth, validateArticle, create);
router.put("/:id", requireAuth, update);
router.patch("/:id", requireAuth, update);
router.delete("/:id", requireAuth, remove);

module.exports = router;
