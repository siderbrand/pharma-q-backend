# pharma-q-backend

Backend API for PharmaQ medication dispensing and queue management system.

## Tech Stack

- TypeScript
- NestJS
- MongoDB Atlas (Mongoose)
- Swagger (OpenAPI)


## Project Architecture

The backend follows Adapter/Hexagonal style by feature module:

- `src/patients/domain`: business entity and repository port
- `src/patients/application`: use case orchestration and output DTOs
- `src/patients/infrastructure`: Mongo schema and repository adapter
- `src/patients/interface`: REST controller and input DTOs

Global bootstrap and composition:

- `src/main.ts`: validation, security middleware, exception filter, Swagger
- `src/app.module.ts`: config, Mongo connection, throttling guard

## Quick Start

1. Install dependencies.

```bash
npm install
```

2. Create a real environment file from `.env.example`.

```bash
cp .env.example .env
```

If you are on Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

3. Update `.env` with your Atlas credentials.

```bash
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<password>@pharmaq.wplljqj.mongodb.net/
MONGODB_DB_NAME=pharmaq
THROTTLE_TTL_MS=60000
THROTTLE_LIMIT=100
CORS_ORIGIN=http://localhost:3000
```

4. Start in development mode.

```bash
npm run start:dev
```

5. Open Swagger.

- `http://localhost:3000/api/docs`

## Available Scripts

- `npm run start`: start app
- `npm run start:dev`: start with watch mode
- `npm run build`: compile TypeScript to `dist/`
- `npm run test:e2e`: run e2e tests
- `npm run test`: run unit tests
- `npm run lint`: run eslint with fix

## Standard Error Format

All API errors are normalized through a global exception filter.

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Paciente no encontrado",
  "path": "/patients/11111111",
  "method": "GET",
  "timestamp": "2026-04-01T18:22:01.121Z"
}
```

This response format is used for validation, business and infrastructure errors.

## Security Baseline

Centralized protections enabled globally:

- `helmet` for secure headers
- `hpp` against HTTP parameter pollution
- `express-mongo-sanitize` against NoSQL injection patterns
- `@nestjs/throttler` as global rate limiting guard
- strict request validation with global `ValidationPipe`

Rate limit behavior:

- `THROTTLE_TTL_MS=60000`
- `THROTTLE_LIMIT=100`

This means up to 100 requests per 60 seconds per client.

If `CORS_ORIGIN` is not defined, CORS is denied by default.

