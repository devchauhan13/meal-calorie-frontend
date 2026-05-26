# Meal Calorie Tracker

A modern, responsive Next.js application for tracking meal calorie and nutrition information using the Meal Calorie Count Generator API. Users can register, log in, search for meals, and view detailed nutrition breakdowns including calories and macronutrients.

---

## Live Demo

- Live App: `https://meal-calorie-frontend-aq4a.vercel.app`
- Backend API: `https://xpcc.devb.zeak.io/api`

---

## Features

### Authentication
- User registration
- User login
- Persisted authentication using Zustand
- Protected routes with auth guards
- Automatic logout and redirect on expired sessions

### Meal Calorie Lookup
- Search meals by dish name
- Support for decimal servings
- Calories per serving
- Total calories
- Macronutrient breakdown per serving
- Total macronutrient breakdown
- Search history persistence

### Error Handling
Handles all required API states:

- `400` → Invalid request or validation error
- `401` → Invalid credentials
- `403` → Session expired → automatic logout
- `404` → Dish not found
- `409` → Account already exists
- `422` → Nutrition data unavailable
- `429` → Rate limited with retry countdown UX
- `500` → Generic server error

### UI / UX
- Responsive mobile-first design
- Dark/light theme toggle
- Modern Tailwind UI
- Password visibility toggle
- Loading and disabled states
- Production-style card layouts

---

# Tech Stack

## Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

## State Management
- Zustand
- Zustand Persist Middleware

## Forms & Validation
- React Hook Form
- Zod

## UI & Utilities
- next-themes
- Lucide React

---

# Project Structure

```bash
src/
├── app/
│   ├── calories/
│   ├── dashboard/
│   ├── login/
│   ├── register/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
├── hooks/
├── lib/
│   └── api.ts
├── stores/
├── types/
└── utils/
```

---

# Setup

## 1. Install dependencies

```bash
npm install
```

---

## 2. Create environment file

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=https://xpcc.devb.zeak.io/api
```

---

## 3. Start development server

```bash
npm run dev
```

---

## 4. Open the application

```bash
http://localhost:3000
```

---

# Environment Variables

## `.env.example`

```env
NEXT_PUBLIC_API_BASE_URL=https://xpcc.devb.zeak.io/api
```

---

# Routes

| Route | Description |
|---|---|
| `/` | Redirects based on auth state |
| `/register` | User registration page |
| `/login` | User login page |
| `/dashboard` | Protected dashboard with meal history |
| `/calories` | Protected calorie lookup page |

---

# API Integration

The frontend integrates with the following endpoints:

```http
POST /auth/register
POST /auth/login
POST /get-calories
```

Base URL:

```http
https://xpcc.devb.zeak.io/api
```

---

# State Management

## Auth Store

Stores:
- JWT token
- User data
- Hydration state

Features:
- Persisted authentication
- Auto logout on `403`
- Protected route support

---

## Meal Store

Stores:
- Current calorie lookup result
- Meal search history
- Hydration state

Features:
- Persistent local history
- Recent search rendering
- Result caching in state

---

# Design Decisions

- Used Next.js App Router for route-based architecture
- Centralized API handling in `src/lib/api.ts`
- Used Zustand persist middleware for local persistence
- Added reusable auth guards for protected routes
- Used Zod + React Hook Form for schema-based validation
- Added centralized API error handling with typed errors
- Implemented rate-limit retry countdown UX
- Kept styling modular and scalable using Tailwind utility patterns

---

# Trade-offs

- Meal history is stored locally instead of server-side
- Minimal animation usage to prioritize maintainability
- No backend-controlled session refresh flow
- Focused on production-style architecture over complex visual effects

---

# Future Improvements

- Add unit and integration tests
- Add toast notifications
- Add skeleton loaders
- Add richer dashboard analytics
- Add chart visualizations for nutrition data
- Add Docker support
- Add SEO metadata
- Add pagination for search history
- Add server-side history persistence

---

# Deployment

Recommended deployment target:

- Vercel

Production build:

```bash
npm run build
```

---

# Author

- Name: Dev Singh Chauhan
- GitHub: https://github.com/devchauhan13
- LinkedIn: https://www.linkedin.com/in/devchauhanfrontend/