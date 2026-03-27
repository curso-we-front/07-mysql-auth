const pool = require('../db/connection');

async function getAll(req, res, next) {
  try {
    const [rows] = await pool.execute(
      'SELECT id, title, content, author, published, owner_id, created_at FROM articles WHERE published = true'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const [rows] = await pool.execute(
      'SELECT id, title, content, author, published, owner_id, created_at FROM articles WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Artículo no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { title, content, author, published = false } = req.body;
    const owner_id = req.user?.id ?? null;
    const [result] = await pool.execute(
      'INSERT INTO articles (title, content, author, published, owner_id) VALUES (?, ?, ?, ?, ?)',
      [title, content, author, published, owner_id]
    );
    const [rows] = await pool.execute('SELECT * FROM articles WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const [rows] = await pool.execute('SELECT * FROM articles WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Artículo no encontrado' });

    const article = rows[0];
    if (req.user) {
      if (req.user.role !== 'admin' && article.owner_id !== req.user.id) {
        return res.status(403).json({ error: 'No tienes permiso para editar este artículo' });
      }
    }

    const { title, content, author, published } = req.body;
    await pool.execute(
      `UPDATE articles
       SET title     = COALESCE(?, title),
           content   = COALESCE(?, content),
           author    = COALESCE(?, author),
           published = COALESCE(?, published)
       WHERE id = ?`,
      [title ?? null, content ?? null, author ?? null, published ?? null, req.params.id]
    );
    const [updated] = await pool.execute('SELECT * FROM articles WHERE id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const [rows] = await pool.execute('SELECT * FROM articles WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Artículo no encontrado' });

    const article = rows[0];
    if (req.user) {
      if (req.user.role !== 'admin' && article.owner_id !== req.user.id) {
        return res.status(403).json({ error: 'No tienes permiso para eliminar este artículo' });
      }
    }

    await pool.execute('DELETE FROM articles WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove };
