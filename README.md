# Yummies 🍳

A full-stack recipe manager for saving, organizing, and revisiting recipes, ingredients, steps, timing, cost, cover images, and galleries. Built as a hybrid architecture featuring an Express backend powered by Supabase Auth and Storage.

**Live Demo:** (https://yummies-frontend.vercel.app/)
[![Backend Tests](https://github.com/Zen-333/Yummies/actions/workflows/backend-tests.yml/badge.svg)](https://github.com/Zen-333/Yummies/actions/workflows/backend-tests.yml)

> **Why I Built This:** This project was designed primarily to practice authentication mechanics, ownership-scoped API design, and cross-origin security with a custom Node.js/Express backend, rather than completely relying on a Backend-as-a-Service (BaaS) abstraction layer.

---

## 🚀 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | TypeScript, React, Vite, FontAwesome, CSS3 |
| **Backend** | Node.js, Express, TypeScript, `tsx` |
| **Database & Auth** | Supabase (PostgreSQL, Supabase Auth, Supabase Storage) |
| **Deployment** | Vercel (Frontend), Railway (Backend) |

---

## 🏗️ Architecture & Security Design

This project is structured as a monorepo containing two independent applications: `/frontend` and `/backend`.

### Authentication & File Storage (Direct Client Access)
User authentication, profile data, and file storage (avatars and recipe media) are accessed directly from the frontend using the Supabase client and the public anonymous key. Security is enforced directly at the database layer using PostgreSQL **Row Level Security (RLS)** policies on the `profiles` table and specific storage buckets.

### Recipe CRUD & Logic (Custom API Access)
Recipe management goes entirely through the custom Express API. To demonstrate manual authorization and ownership enforcement, the backend operates under a distinct security paradigm:
* **RLS Bypass:** The backend utilizes the Supabase `service_role` key, bypassing standard RLS.
* **Server-Side Verification:** Instead of trusting client-supplied data, the `requireAuth` middleware catches and decrypts the Supabase-issued JWT on every incoming request.
* **Ownership Checks:** Every read, update, and delete operation manually executes an ownership verification check (`recipe.controller.ts`) against the decrypted `user_id` before modifying the database.

### Guest Mode
To minimize unnecessary database overhead, Guest Mode operations exist purely within local React state. Unauthenticated requests never hit the Express server, as every backend route strictly requires a valid session token.

---

## 📡 API Endpoints

All custom backend routes require a valid Supabase JWT sent via the `Authorization: Bearer <token>` header.

### Recipes (`/api/recipe`)
* `GET /api/recipe` - Fetch all recipes belonging to the authenticated user.
* `POST /api/recipe` - Create a new recipe.
* `PUT /api/recipe/:id` - Update an existing recipe (manually checks ownership).
* `DELETE /api/recipe/:id` - Delete a recipe (manually checks ownership).

### User Management (`/api/user`)
* `DELETE /api/user/account` - Deletes the user profile and completely purges the authentication record.

---

## 🧪 Testing

The backend is tested with [Vitest](https://vitest.dev/), using a mocked Supabase client so tests run fast, deterministically, and without needing real database credentials or network access.

**Coverage:** 92%+ statements, 100% functions

**What's covered:**
* **Unit tests** — the recipe controller (CRUD + ownership checks), the user controller (account deletion), and the `requireAuth` JWT middleware, each run in isolation with the Supabase client mocked.
* **Integration tests** — [Supertest](https://github.com/ladjs/supertest) requests sent through the real Express app (`App.ts`), exercising the actual CORS and auth middleware and route wiring end-to-end, with only the database call itself mocked.

**Running tests locally:**
```bash
cd backend
npm test              # run once
npm run test:watch    # watch mode
npm run test:coverage # with coverage report
```

Tests run automatically on every push and pull request via GitHub Actions see the badge above.

---

## 📂 Project Structure

```text
backend/
 └── src/
      ├── controllers/   # Request handlers (Recipe and User business logic)
      ├── middleware/    # requireAuth manual Supabase JWT validation
      ├── routes/        # Express router definitions
      ├── lib/           # Supabase initialization (Service Role Key config)
      └── types/         # TypeScript interface definitions

frontend/
 └── src/
      ├── component/     # Modular UI components & viewer lightboxes
      ├── context/       # AuthContext session synchronization & profile handling
      ├── lib/           # Supabase client instantiation (Anon Key config)
      ├── config/        # Centralized environment & API configuration
      └── types/         # Shareable frontend types

Contact

Zen Hamam
GitHub: https://github.com/Zen-333
LinkedIn: https://www.linkedin.com/in/zen-al-din-hamam-04572120b/