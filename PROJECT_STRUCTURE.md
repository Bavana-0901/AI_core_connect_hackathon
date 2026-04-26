# CampusConnect Project Structure

## Root Directory
```
CampusConnect/
├── .gitignore              # Git ignore rules for both frontend and backend
├── package.json           # Root package.json with scripts for both services
├── README.md              # Comprehensive project documentation
├── AI_core_connect_hackathon/  # Git repository folder
│   └── .git/
├── backend/               # Node.js/Express API Server
└── frontend/              # Next.js React Application
```

## Backend Structure (`/backend`)
```
backend/
├── .env                   # Environment variables (not committed)
├── node_modules/          # Dependencies
├── package.json          # Backend dependencies and scripts
├── package-lock.json     # Lock file for exact dependency versions
├── server.js             # Main server entry point
└── src/                  # Source code
    ├── config/           # Database and configuration files
    │   ├── database.js   # MongoDB connection
    │   └── index.js      # Main configuration
    ├── controllers/      # API route handlers
    │   ├── authController.js
    │   ├── githubController.js
    │   ├── taskController.js
    │   ├── userController.js
    │   └── analyticsController.js
    ├── middleware/       # Express middleware
    │   ├── auth.js       # JWT authentication middleware
    │   ├── errorHandler.js
    │   ├── upload.js     # File upload middleware
    │   └── validation.js # Input validation
    ├── models/           # MongoDB schemas
    │   ├── User.js
    │   ├── Task.js
    │   ├── Submission.js
    │   ├── Badge.js
    │   └── Analytics.js
    ├── routes/           # API route definitions
    │   ├── auth.js
    │   ├── github.js
    │   ├── tasks.js
    │   ├── users.js
    │   └── analytics.js
    ├── services/         # Business logic services
    │   ├── githubService.js
    │   ├── gamificationService.js
    │   ├── emailService.js
    │   └── analyticsService.js
    └── utils/            # Helper functions
        ├── helpers.js
        ├── constants.js
        └── logger.js
```

## Frontend Structure (`/frontend`)
```
frontend/
├── .gitignore            # Frontend-specific ignore rules
├── .next/               # Next.js build cache
├── components.json      # ShadCN/UI configuration
├── eslint.config.mjs    # ESLint configuration
├── next-env.d.ts        # Next.js TypeScript declarations
├── next.config.ts       # Next.js configuration
├── node_modules/        # Dependencies
├── package.json         # Frontend dependencies and scripts
├── package-lock.json    # Lock file
├── postcss.config.mjs   # PostCSS configuration
├── public/              # Static assets
│   ├── favicon.ico
│   ├── images/
│   └── fonts/
├── README.md            # Frontend-specific documentation
├── src/                 # Source code
│   ├── app/             # Next.js App Router
│   │   ├── (auth)/      # Authentication routes (grouped)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │     └── page.tsx
│   │   ├── dashboard/   # Main dashboard
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── analyzer/    # GitHub analyzer
│   │   │   ├── page.tsx
│   │   │   └── [username]/
│   │   │       └── page.tsx
│   │   ├── tasks/       # Task management
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── leaderboard/ # Rankings
│   │   │   └── page.tsx
│   │   ├── admin/       # Admin routes
│   │   │   ├── dashboard/
│   │   │   ├── users/
│   │   │   ├── tasks/
│   │   │   └── analytics/
│   │   ├── api/         # API routes (if needed)
│   │   ├── globals.css  # Global styles
│   │   ├── layout.tsx   # Root layout
│   │   ├── loading.tsx  # Loading UI
│   │   ├── not-found.tsx # 404 page
│   │   └── page.tsx     # Home page
│   ├── components/      # Reusable UI components
│   │   ├── ui/          # Base UI components (ShadCN)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── layout/      # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── footer.tsx
│   │   ├── forms/       # Form components
│   │   │   ├── login-form.tsx
│   │   │   ├── task-form.tsx
│   │   │   └── profile-form.tsx
│   │   ├── dashboard/   # Dashboard-specific components
│   │   │   ├── stats-card.tsx
│   │   │   ├── activity-feed.tsx
│   │   │   └── progress-chart.tsx
│   │   └── github/      # GitHub analysis components
│   │       ├── profile-card.tsx
│   │       ├── repo-list.tsx
│   │       ├── score-display.tsx
│   │       └── suggestions-list.tsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useGithub.ts
│   │   ├── useTasks.ts
│   │   └── useAnalytics.ts
│   ├── lib/             # Utilities and configurations
│   │   ├── api.ts       # API client functions
│   │   ├── auth.ts      # Authentication utilities
│   │   ├── constants.ts # App constants
│   │   ├── types.ts     # TypeScript type definitions
│   │   ├── utils.ts     # Helper functions
│   │   └── validations.ts # Form validation schemas
│   └── middleware.ts    # Next.js middleware
└── tsconfig.json        # TypeScript configuration
```

## Key Files and Their Purposes

### Backend
- **`server.js`**: Main entry point, sets up Express server, middleware, and routes
- **`src/config/database.js`**: MongoDB connection and configuration
- **`src/controllers/`**: Handle HTTP requests and responses
- **`src/models/`**: Define data structures and database schemas
- **`src/routes/`**: Define API endpoints and map to controllers
- **`src/services/`**: Contain business logic and external API calls
- **`src/middleware/`**: Authentication, validation, error handling

### Frontend
- **`src/app/layout.tsx`**: Root layout with providers and global styles
- **`src/app/page.tsx`**: Home page component
- **`src/components/ui/`**: Reusable UI components from ShadCN
- **`src/lib/api.ts`**: Functions to call backend APIs
- **`src/lib/types.ts`**: TypeScript interfaces and types
- **`src/hooks/`**: Custom hooks for data fetching and state management

## Development Workflow

1. **Backend Development**: Work in `/backend` directory
2. **Frontend Development**: Work in `/frontend` directory
3. **Full Stack Development**: Use root `package.json` scripts
4. **Database**: MongoDB (local or Atlas)
5. **Version Control**: Git with the repository in `/AI_core_connect_hackathon/.git/`

## Environment Setup

- **Backend**: Configure `.env` in `/backend` directory
- **Frontend**: Environment variables in `.env.local` in `/frontend` directory
- **Root**: Use `npm run install:all` to install dependencies for both services

This structure provides a scalable, maintainable architecture for the CampusConnect platform.