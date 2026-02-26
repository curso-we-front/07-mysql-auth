# 07 — Autenticación con JWT y MySQL

## Objetivo

Implementar un sistema de autenticación completo: registro, login, protección de rutas con JWT y control de roles básico.

## Contexto

Añadimos usuarios al blog. Solo los usuarios autenticados pueden crear/editar/borrar artículos. Los artículos tienen un `owner` (el usuario que los creó).

## Modelo de datos

```
users
-----
id
email         (único)
password_hash
name
role          ('user' | 'admin')
created_at
```

## Tareas

### Tarea 1 — Modelo de usuarios (`src/db/users.js`)
- `createUser({ name, email, password })` → hashea la contraseña con `bcrypt` y la guarda
- `findUserByEmail(email)` → busca por email
- `findUserById(id)` → busca por id

### Tarea 2 — Endpoints de autenticación (`src/routes/auth.js`)
- `POST /auth/register` → crea usuario, devuelve `{ user, token }`
- `POST /auth/login` → verifica credenciales, devuelve `{ user, token }`
  - 401 si el email no existe o la contraseña es incorrecta

### Tarea 3 — Middleware de autenticación (`src/middlewares/auth.js`)
Crea el middleware `requireAuth`:
- Extrae el token del header `Authorization: Bearer <token>`
- Verifica el JWT con la clave secreta del `.env`
- Adjunta el usuario a `req.user`
- 401 si no hay token o es inválido

### Tarea 4 — Proteger rutas y autorización
- `POST`, `PUT`, `PATCH`, `DELETE` en `/articles` requieren `requireAuth`
- Solo el autor del artículo (o un `admin`) puede editarlo/borrarlo
  - 403 si intenta editar artículo de otro usuario

## Estructura esperada

```
07-mysql-auth/
├── src/
│   ├── controllers/
│   │   ├── articles.js
│   │   └── auth.js         ← nuevo
│   ├── db/
│   │   ├── connection.js
│   │   ├── migrate.js
│   │   └── users.js        ← Tarea 1
│   ├── middlewares/
│   │   ├── auth.js         ← Tarea 3
│   │   ├── validate.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── articles.js
│   │   └── auth.js         ← Tarea 2
│   └── app.js
├── tests/
│   ├── auth.test.js
│   └── protected.test.js
├── .env.example
└── package.json
```

## Variables de entorno

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=blog
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=7d
```

## Criterios de evaluación

- [ ] Las contraseñas se guardan hasheadas con bcrypt (mínimo 10 salt rounds)
- [ ] El JWT contiene `{ id, email, role }`
- [ ] Las rutas protegidas devuelven 401 sin token y 403 sin permisos
- [ ] Un admin puede editar cualquier artículo
- [ ] Los tests cubren registro, login y acceso no autorizado
