# CampusConnect 🚀

A comprehensive platform for managing campus ambassadors and analyzing GitHub profiles with gamification features.

## 📋 Overview

CampusConnect is a modern web application that combines:
- **Campus Ambassador Management**: Track and manage campus ambassadors
- **GitHub Profile Analysis**: Analyze GitHub profiles with scoring and improvement suggestions
- **Gamification System**: Points, badges, and leaderboards to encourage engagement
- **Task Management**: Assign and track completion of various tasks
- **Analytics Dashboard**: Comprehensive analytics for administrators

- video link : https://youtu.be/p9kbahsMNh0

## 🏗️ Architecture

```
CampusConnect/
├── backend/                    # Node.js/Express API Server
│   ├── src/
│   │   ├── config/            # Database and configuration
│   │   ├── controllers/       # API route handlers
│   │   ├── middleware/        # Authentication & error handling
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API endpoints
│   │   ├── services/         # Business logic
│   │   └── utils/            # Helper functions
│   ├── server.js             # Main server file
│   ├── package.json
│   └── .env                  # Environment variables
├── frontend/                  # Next.js React Application
│   ├── src/
│   │   ├── app/              # Next.js app directory
│   │   │   ├── auth/         # Authentication pages
│   │   │   ├── dashboard/    # Main dashboard
│   │   │   ├── analyzer/     # GitHub analyzer
│   │   │   ├── tasks/        # Task management
│   │   │   └── leaderboard/  # Rankings
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Utilities
│   ├── public/              # Static assets
│   └── package.json
├── package.json              # Root package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/campusconnect.git
   cd campusconnect
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   Copy the `.env` file in the backend folder and configure:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/campusconnect
   JWT_SECRET=your_jwt_secret_here
   GITHUB_TOKEN=your_github_token_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both backend (http://localhost:5000) and frontend (http://localhost:3000)

## 🔧 Development

### Backend Development
```bash
cd backend
npm start          # Start with nodemon
npm test          # Run tests
```

### Frontend Development
```bash
cd frontend
npm run dev       # Start development server
npm run build     # Build for production
npm run lint      # Run ESLint
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### GitHub Analysis
- `GET /api/github/analyze/:username` - Analyze GitHub profile

### Task Management
- `GET /api/tasks` - Get available tasks
- `POST /api/submissions` - Submit task completion

### Gamification
- `GET /api/leaderboard` - Get user rankings
- `GET /api/analytics/dashboard` - Admin analytics

## 🎯 Features

### For Campus Ambassadors
- ✅ GitHub profile analysis with scoring
- ✅ Personalized improvement suggestions
- ✅ Task completion with point rewards
- ✅ Badge collection system
- ✅ Leaderboard rankings
- ✅ Progress tracking

### For Administrators
- ✅ User management dashboard
- ✅ Task assignment and monitoring
- ✅ Analytics and reporting
- ✅ Leaderboard management
- ✅ System-wide statistics

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Documentation**: Swagger/OpenAPI
- **File Upload**: Multer + Cloudinary

### Frontend
- **Framework**: Next.js 16 (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN/UI + Radix UI
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **State Management**: React Hooks
- **Notifications**: React Hot Toast

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Environment variable management
- Secure file upload handling

## 📱 Responsive Design

- Mobile-first approach
- Responsive across all screen sizes
- Dark/Light mode support
- Accessible UI components
- Touch-friendly interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for AI Core Connect Hackathon
- Inspired by modern developer platforms
- Thanks to all contributors and the open-source community

## 📞 Support

For support, email support@campusconnect.com or join our Discord community.

---

**Made with ❤️ for campus ambassadors worldwide**

   For development:
   ```bash
   npm run dev
   ```

## API Documentation

API documentation is available at `/api-docs` when the server is running.

## Database Models

- **User**: Stores user information, roles, GitHub data, points, and badges
- **Task**: Task details, assignments, and deadlines
- **Submission**: Proof submissions and approval status
- **Badge**: Achievement badges with criteria

## Key Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

### GitHub
- `POST /api/github/analyze` - Analyze GitHub profile

### Tasks
- `GET /api/tasks` - Get tasks
- `POST /api/tasks` - Create task (Admin)
- `POST /api/tasks/:id/assign` - Assign task (Admin)

### Submissions
- `POST /api/submissions` - Submit proof
- `PUT /api/submissions/:id/review` - Review submission (Admin)

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard
- `GET /api/leaderboard/stats` - Get user stats

### Analytics
- `GET /api/analytics` - Get analytics (Admin)

## Environment Variables

- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token generation
- `GITHUB_TOKEN`: GitHub personal access token for API calls
- `CLOUDINARY_*`: Cloudinary credentials for file uploads

## Development

The project follows a modular structure with separate controllers, routes, services, and models for maintainability and scalability.
