# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Workout Buddy is a MERN stack app where authenticated users can log, view, and delete personal workouts. The backend is deployed on Render, the frontend on Vercel.

## Development Commands

### Backend (Express + MongoDB)
```bash
cd backend
npm run dev      # nodemon server.js — auto-reloads on change
npm start        # node server.js — production-style start
```

### Frontend (React + Vite)
```bash
cd frontend
npm run dev      # Vite dev server (HMR)
npm run build    # production build
npm run lint     # ESLint
npm run preview  # preview production build locally
```

## Environment Variables

**backend/.env** (see `backend/.env.example`):
- `PORT` — server port (default 4000)
- `MONGO_URI` — MongoDB Atlas connection string
- `SECRET` — JWT signing secret

**frontend/.env**:
- `VITE_API_URL` — backend base URL (e.g. `http://localhost:4000` for local dev, Render URL for production)

## Architecture

### Backend (`backend/`)
- **server.js** — Express app setup, CORS, Mongoose connection, route mounting
- **routes/** — `workouts.js` (all routes protected by `requireAuth` middleware), `user.js` (login/signup, public)
- **controllers/** — `workoutController.js` (CRUD for workouts), `userController.js` (login/signup, issues JWT)
- **models/** — `WorkoutModel.js` (title, reps, load, user_id, timestamps), `userModel.js` (email, password hash; static `signup`/`login` methods with bcrypt + validator)
- **middleware/requireauth.js** — verifies JWT from `Authorization: Bearer <token>` header, attaches `req.user`

### Frontend (`frontend/src/`)
- **main.jsx** — mounts app wrapped in `AuthContextProvider` and `WorkoutsContextProvider`
- **App.jsx** — React Router routes; `/` requires auth (redirects to `/login`), `/login` and `/signup` redirect to `/` when already logged in
- **context/** — `AuthContext` (useReducer, persists user to `localStorage`), `WorkoutContext` (useState for workouts list)
- **hooks/** — `useLogin`, `useSignup`, `useLogout` (handle fetch + context dispatch), `useAuthContext` (shorthand for AuthContext)
- **pages/** — `Home` (fetch all workouts on mount), `Login`, `Signup`
- **components/** — `Navbar`, `WorkoutDetails` (single workout card with delete), `WorkoutForm` (create workout)

### Auth Flow
1. Signup/login returns `{ email, token }` — stored in `localStorage` as `user`
2. `AuthContext` rehydrates from `localStorage` on app load
3. All workout API calls include `Authorization: Bearer <token>`
4. JWT expires after 3 days

### Data Model
Workouts: `{ title: String, load: Number, reps: Number, user_id: String, createdAt, updatedAt }` — all workout queries are scoped to `req.user._id`.
