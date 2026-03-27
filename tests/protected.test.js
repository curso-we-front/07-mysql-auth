const supertest = require('supertest');
const app = require('../src/app');
const pool = require('../src/db/connection');

const request = supertest(app);

let tokenUser1;
let tokenUser2;
let articleIdUser1;

const user1 = { name: 'Owner User',  email: 'owner@example.com',  password: 'password123' };
const user2 = { name: 'Other User',  email: 'other@example.com',  password: 'password456' };

beforeAll(async () => {
  await pool.execute('DELETE FROM articles WHERE owner_id IS NOT NULL');
  await pool.execute('DELETE FROM users');

  const res1 = await request.post('/auth/register').send(user1);
  tokenUser1 = res1.body.token;

  const res2 = await request.post('/auth/register').send(user2);
  tokenUser2 = res2.body.token;

  const articleRes = await request
    .post('/articles')
    .set('Authorization', `Bearer ${tokenUser1}`)
    .send({ title: 'Artículo de User1', content: 'Contenido del artículo de user1.', author: 'Owner User' });
  articleIdUser1 = articleRes.body.id;
});

afterAll(async () => {
  await pool.end();
});

describe('Autorización por propietario', () => {
  test('el autor puede editar su propio artículo', async () => {
    const res = await request
      .patch(`/articles/${articleIdUser1}`)
      .set('Authorization', `Bearer ${tokenUser1}`)
      .send({ title: 'Título actualizado' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Título actualizado');
  });

  test('403 si intenta editar el artículo de otro usuario', async () => {
    const res = await request
      .patch(`/articles/${articleIdUser1}`)
      .set('Authorization', `Bearer ${tokenUser2}`)
      .send({ title: 'Intento de robo' });
    expect(res.status).toBe(403);
  });

  test('403 si intenta borrar el artículo de otro usuario', async () => {
    const res = await request
      .delete(`/articles/${articleIdUser1}`)
      .set('Authorization', `Bearer ${tokenUser2}`);
    expect(res.status).toBe(403);
  });

  test('el autor puede borrar su propio artículo', async () => {
    const res = await request
      .delete(`/articles/${articleIdUser1}`)
      .set('Authorization', `Bearer ${tokenUser1}`);
    expect(res.status).toBe(204);
  });
});
