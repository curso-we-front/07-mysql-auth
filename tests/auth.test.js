const supertest = require("supertest");
const app = require("../src/app");
const pool = require("../src/db/connection");

const request = supertest(app);

beforeAll(async () => {
  await pool.execute("DELETE FROM users");
});

afterAll(async () => {
  await pool.end();
});

const testUser = {
  name: "Test User",
  email: "test@example.com",
  password: "password123",
};

describe("POST /auth/register", () => {
  test("registra un usuario y devuelve token", async () => {
    const res = await request.post("/auth/register").send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.user.password_hash).toBeUndefined(); // nunca exponer hash
  });

  test("409 si el email ya existe", async () => {
    const res = await request.post("/auth/register").send(testUser);
    expect(res.status).toBe(409);
  });
});

describe("POST /auth/login", () => {
  test("login correcto devuelve token", async () => {
    const res = await request.post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("401 con contraseña incorrecta", async () => {
    const res = await request.post("/auth/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });
    expect(res.status).toBe(401);
  });

  test("401 con email inexistente", async () => {
    const res = await request.post("/auth/login").send({
      email: "noexiste@example.com",
      password: "123",
    });
    expect(res.status).toBe(401);
  });
});

describe("Rutas protegidas", () => {
  test("401 sin token en POST /articles", async () => {
    const res = await request.post("/articles").send({
      title: "Test",
      content: "Content test body",
      author: "X",
    });
    expect(res.status).toBe(401);
  });

  test("crea artículo con token válido", async () => {
    const loginRes = await request.post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    const token = loginRes.body.token;

    const res = await request
      .post("/articles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Mi artículo",
        content: "Contenido válido del artículo.",
        author: "Test",
      });
    expect(res.status).toBe(201);
  });
});
