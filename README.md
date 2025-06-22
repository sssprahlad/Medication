# Medication Management System

A full-stack application for managing medication adherence, tracking, and notifications.

## Project Structure

```
Medication/
├── frontend/          # React frontend application
└── backend/           # Node.js/Express backend server
```

## Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)
- SQLite3 (for backend database)

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```

   The server will run on `http://localhost:3000`

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3001`

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
PORT=3000
JWT_SECRET_KEY=your_secret_key_here
```

## Database Setup

The application uses SQLite3. The database will be automatically created when you start the backend server.

## API Endpoints

### Authentication
- POST `/signup` - Register a new user
- POST `/login` - Login user

### Medication Management
- POST `/adherence` - Submit medication adherence status
- POST `/medication` - Submit medication status
- GET `/dates` - Get checked dates
- POST `/dates` - Add/update checked dates

### Notifications
- POST `/send-alert` - Send medication alert email

## Tech Stack

### Backend
- Node.js
- Express.js
- SQLite3
- bcrypt (password hashing)
- JWT (authentication)
- Multer (file uploads)
- Nodemailer (email notifications)

### Frontend
- React
- Redux (state management)
- React Router
- Axios (API calls)
- Material-UI (UI components)

## Features

- User authentication (signup/login)
- Medication adherence tracking
- Calendar view for medication tracking
- Email notifications for medication reminders
- Patient and caregiver roles
- Adherence rate tracking
- Monthly and weekly statistics

## Troubleshooting

1. If you encounter SQLite3 installation issues:
   ```bash
   npm install sqlite3 --build-from-source
   ```

2. If you encounter CORS errors:
   - Ensure both frontend and backend servers are running
   - Check that the frontend is making requests to the correct backend URL

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

ISC License
