# 💪 Workout Buddy

A full-stack MERN app for logging and tracking personal workouts. Authenticated users can create, view, update, and delete workouts, and manage their profile.

🚀 **[Live Demo](https://workout-buddy-mern-six.vercel.app/)**

---

## Features

- JWT-based authentication (signup, login, logout)
- Create, view, edit, and delete workouts
- Profile management (update name, email, password)
- Workouts scoped per user — no one else sees yours
- Responsive UI across mobile, tablet, and desktop

---

## Tech Stack

**Frontend** — React, Vite, React Router, Context API, date-fns  
**Backend** — Node.js, Express, MongoDB, Mongoose, JWT, bcrypt  
**Deployment** — Vercel (frontend), Render (backend)

---

## Project Structure

```
workout-buddy-mern/
├── backend/
│   ├── controllers/      # workoutController, userController
│   ├── middleware/        # requireAuth (JWT verification)
│   ├── models/           # WorkoutModel, userModel
│   ├── routes/           # workouts.js, user.js
│   └── server.js
└── frontend/
    └── src/
        ├── components/   # Navbar, WorkoutDetails, WorkoutForm
        ├── context/      # AuthContext, WorkoutContext
        ├── hooks/        # useLogin, useSignup, useLogout, useUpdateProfile
        └── pages/        # Home, Login, Signup, Profile
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account

### Backend

```bash
cd backend
npm install
```

Create a `.env` file (see `.env.example`):

```
PORT=4000
MONGO_URI=your_mongodb_atlas_connection_string
SECRET=your_jwt_secret
```

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file:

```
VITE_API_URL=http://localhost:4000
```

```bash
npm run dev
```

---

## API Routes

### Auth

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/user/signup` | Public | Register new user |
| POST | `/api/user/login` | Public | Login, returns JWT |
| PATCH | `/api/user/profile` | Protected | Update name/email/password |

### Workouts

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/workouts` | Protected | Get all user's workouts |
| POST | `/api/workouts` | Protected | Create a workout |
| GET | `/api/workouts/:id` | Protected | Get single workout |
| PATCH | `/api/workouts/:id` | Protected | Update a workout |
| DELETE | `/api/workouts/:id` | Protected | Delete a workout |

---

## Deployment

- **Frontend** deployed on [Vercel](https://vercel.com) — set `VITE_API_URL` to your Render backend URL in environment variables
- **Backend** deployed on [Render](https://render.com) — set `MONGO_URI`, `SECRET`, and `PORT` in environment variables

---

## License

MIT
