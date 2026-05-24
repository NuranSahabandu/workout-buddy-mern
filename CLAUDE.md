# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Workout Buddy is a MERN stack app where authenticated users can log, view, and delete personal workouts, and manage their profile. The backend is deployed on Render, the frontend on Vercel.

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
- **routes/workouts.js** — all routes protected by `requireAuth` middleware; GET/POST on `/api/workouts`, GET/DELETE/PATCH on `/api/workouts/:id`
- **routes/user.js** — `POST /api/user/login` and `POST /api/user/signup` (public); `PATCH /api/user/profile` (protected)
- **controllers/workoutController.js** — `getWorkouts`, `getWorkout`, `createWorkout`, `deleteWorkout`, `updateWorkout`; all scoped to `req.user._id`; `createWorkout` returns `emptyFields` array for client-side validation feedback
- **controllers/userController.js** — `loginUser` and `signupUser` (issue JWT); `updateProfile` (updates name/email/password, returns `{ email, name }`)
- **models/WorkoutModel.js** — `{ title: String, reps: Number, load: Number, user_id: String, timestamps }`
- **models/userModel.js** — `{ email: String (unique), password: String (bcrypt hash), name: String (optional) }`; static methods: `signup`, `login`, `updateProfile`; `updateProfile` requires current password verification when changing email or password
- **middleware/requireauth.js** — verifies JWT from `Authorization: Bearer <token>` header, attaches `req.user`

### Frontend (`frontend/src/`)
- **main.jsx** — mounts app wrapped in `AuthContextProvider` and `WorkoutsContextProvider`
- **App.jsx** — React Router routes; `/` and `/profile` require auth (redirect to `/login`); `/login` and `/signup` redirect to `/` when already logged in
- **context/AuthContext.jsx** — `useReducer`; actions: `LOGIN`, `LOGOUT`, `UPDATE_USER` (merges payload into user); persists user to `localStorage`
- **context/WorkoutContext.jsx** — `useState` for workouts list
- **hooks/useLogin.jsx** — `{ login, isLoading, error }`
- **hooks/useSignup.jsx** — `{ signup, isLoading, error }`
- **hooks/useLogout.jsx** — `{ logout }`; clears localStorage and resets WorkoutsContext
- **hooks/useAuthContext.jsx** — safe access to AuthContext; throws if used outside provider
- **hooks/useUpdateProfile.jsx** — `{ updateProfile, isLoading, error, success }`; calls `PATCH /api/user/profile`, dispatches `UPDATE_USER` on success
- **pages/Home.jsx** — fetches all workouts on mount; renders `WorkoutDetails` list and `WorkoutForm`
- **pages/Login.jsx** — email/password form; disables submit while loading
- **pages/Signup.jsx** — mirrors Login
- **pages/Profile.jsx** — form to update name (no password required), email and password (requires current password); shows success/error feedback
- **components/Navbar.jsx** — shows display name (or email fallback) and "Profile" link when authenticated; shows Login/Signup links when not
- **components/WorkoutDetails.jsx** — displays title, load (kg), reps, relative timestamp via `date-fns`; handles delete
- **components/WorkoutForm.jsx** — create workout; highlights `emptyFields` from server response

### Auth Flow
1. Signup/login returns `{ email, token }` (login also returns `name`) — stored in `localStorage` as `user`
2. `AuthContext` rehydrates from `localStorage` on app load
3. All protected API calls include `Authorization: Bearer <token>`
4. JWT expires after 3 days
5. Profile updates dispatch `UPDATE_USER` to merge new `{ email, name }` into context and localStorage

### Data Models
- **Workouts**: `{ title: String, load: Number, reps: Number, user_id: String, createdAt, updatedAt }` — all queries scoped to `req.user._id`
- **Users**: `{ email: String, password: String (hashed), name: String (optional) }` — name is a display name shown in Navbar
