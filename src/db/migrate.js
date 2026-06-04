require('dotenv').config();
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
  });

  const db = process.env.DB_NAME || 'blog';
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${db}\``);
  await connection.query(`USE \`${db}\``);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      email         VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      name          VARCHAR(255) NOT NULL,
      role          ENUM('user', 'admin') DEFAULT 'user',
      created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS articles (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      title      VARCHAR(255) NOT NULL,
      content    TEXT NOT NULL,
      author     VARCHAR(255) NOT NULL,
      published  BOOLEAN DEFAULT false,
      owner_id   INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  const [rows] = await connection.query('SELECT COUNT(*) AS count FROM articles');
  if (rows[0].count === 0) {
    const articlesPath = path.join(__dirname, '../../data/articles.json');
    const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));
    for (const article of articles) {
      await connection.execute(
        'INSERT INTO articles (title, content, author, published) VALUES (?, ?, ?, ?)',
        [article.title, article.content, article.author, article.published]
      );
    }
    console.log(`Seeded ${articles.length} articles`);
  }

  console.log('Migration complete');
  await connection.end();
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
