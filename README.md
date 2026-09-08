# Local Connect Backend

Production-ready REST API backend for the Local Connect platform — a hyper-local business discovery app for Andhra Pradesh villages and mandals.

## Tech Stack

- **NestJS** (v10) — opinionated Node.js framework
- **Prisma ORM** (v5) — type-safe database access
- **PostgreSQL** — primary database
- **JWT + Passport** — stateless authentication
- **bcrypt** (rounds: 12) — password hashing
- **class-validator** — request body validation

---

## Getting Started

### 1. Prerequisites

- Node.js 18+
- PostgreSQL running locally (or a hosted instance)

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set your `DATABASE_URL` and `JWT_SECRET`.

### 4. Run database migrations

```bash
npm run db:migrate
# Enter a migration name when prompted, e.g.: init
```

### 5. Seed data

```bash
npm run db:seed
```

This seeds:
- State: Andhra Pradesh
- All 26 AP districts
- Sample mandals for Krishna district
- Sample villages for Gudivada mandal
- 14 business categories

### 6. Start the development server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`.

---

## API Reference

All responses follow the shape:

```json
{
  "success": true,
  "data": { ... },
  "message": "Human-readable status"
}
```

### Auth (public)

| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | `{ username, phone, password, userType?, districtId?, mandalId?, villageId? }` | Create account |
| POST | `/auth/login` | `{ phone, password }` | Login, returns `{ token, user }` |

### Locations (public)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/locations/districts` | All AP districts |
| GET | `/locations/districts/:id/mandals` | Mandals for a district |
| GET | `/locations/mandals/:id/villages` | Villages for a mandal |

### Businesses

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/businesses` | — | List with filters: `districtId`, `mandalId`, `villageId`, `categoryId`, `status` |
| GET | `/businesses/search?q=keyword&villageId=X` | — | Full-text search |
| GET | `/businesses/my` | JWT | Merchant's own businesses |
| GET | `/businesses/:id` | — | Single business |
| POST | `/businesses` | JWT (MERCHANT) | Create business |
| PATCH | `/businesses/:id/status` | JWT (owner or ADMIN) | Update status |

### Categories (public)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/categories` | All categories |

---

## Validation Rules

| Field | Rule |
|-------|------|
| `username` | Min 4 chars, alphanumeric + underscore only |
| `phone` | Exactly 10 digits |
| `password` | Min 8 chars, must include uppercase, lowercase, number, special char |
| `status` | `OPEN`, `CLOSED`, or `BUSY` |

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run start:dev` | Hot-reload dev server |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run compiled build |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio |
