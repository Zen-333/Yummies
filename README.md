# Yummies

A full-stack recipe manager for saving, organizing, and revisiting recipes, ingredients, steps, timing, cost, cover images, and a gallery, with email/password and Google sign-in. Built primarily to practice authentication, ownership-scoped API design, and file storage with a real Supabase + Express backend rather than relying on a BaaS for everything.

Live demo: [https://yummies-frontend.vercel.app/]

Features

Email/password and Google OAuth sign-in via Supabase Auth
Guest mode — add, edit, and delete recipes without creating an account (data lives in memory for the session only; see Guest Mode)
Create, edit, and delete recipes with a cover image, ingredient list, step list, time (hours/minutes), cost, and notes
Gallery images/videos per recipe with a lightbox viewer (arrow-key and click navigation)
Profile editing — display name and avatar upload
Account deletion
Responsive recipe card grid

Tech Stack

TypeScript, Vite, FontAwesomeBackendNode.js, Express, TypeScript, tsxDatabase / Auth / StorageSupabase (Postgres, Auth, Storage)Deployment Vercel (frontend), Railway (backend)

Architecture

This is a monorepo with two independent apps: /frontend and /backend.

Auth, profile data, and file storage (avatars, recipe images) are accessed directly from the frontend using the Supabase client and the anon key, so Postgres Row Level Security (RLS) policies on profiles and the storage buckets are what actually protect that data. 

Recipe CRUD goes through the custom Express API instead. The backend uses the Supabase service role key, which bypasses RLS entirely so instead of relying on RLS for recipes, every read/update/delete query manually re-checks user_id ownership server-side (see recipe.controller.ts), and the requireAuth middleware verifies the caller's Supabase-issued JWT on every request rather than trusting any client-supplied identity. This is a deliberate hybrid: Supabase handles the parts it's good at out of the box, while the API layer demonstrates manual auth/ownership enforcement.

Guest mode never touches the backend at all every recipe route requires auth, so unauthenticated "recipes" exist purely as local React state.

Project Structure

backend/
  src/
    controllers/      # request handlers (recipe, user)
    middleware/        # requireAuth — verifies Supabase JWTs
    routes/             # Express routers
    lib/                  # Supabase client (service role key)
    types/

frontend/
  src/
    component/         # UI components
    context/             # AuthContext — session, profile, auth actions
    lib/                   # Supabase client (anon key)
    config/
    types/
    styles/

Contact

Zen Hamam
Portfolio: https://zenportfolio.netlify.app/
GitHub: https://github.com/Zen-333
LinkedIn: https://www.linkedin.com/in/zen-al-din-hamam-04572120b/
