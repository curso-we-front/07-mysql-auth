function validateArticle(req, res, next) {
  const { title, content, author } = req.body;
  if (!title || !content || !author) {
    return res.status(400).json({ error: 'title, content y author son obligatorios' });
  }
  if (content.length < 10) {
    return res.status(400).json({ error: 'content debe tener al menos 10 caracteres' });
  }
  next();
}

module.exports = { validateArticle };
