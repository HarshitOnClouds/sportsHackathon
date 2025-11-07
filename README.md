# UK-TalentScout 🏆

A full-stack web application for connecting athletes and coaches in Uttarakhand, India. Athletes can create profiles, log their performance metrics, and get discovered by coaches. Coaches can search and filter through athlete profiles to find the best talent.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### For Athletes 🏃‍♂️
- **Create Profile**: Sign up with sport, age, and district information
- **Performance Logging**: Track metrics like sprint times, jump distances, weights lifted, etc.
- **Visual Analytics**: View performance trends with interactive charts
- **Statistics Dashboard**: See average, best, worst performance, and improvement percentage
- **Export Data**: Download performance data as CSV files
- **Edit Profile**: Update personal information anytime
- **Dark/Light Mode**: Toggle between themes for comfortable viewing

### For Coaches 👨‍🏫
- **Discover Athletes**: Browse through athlete profiles
- **Advanced Filtering**: Filter by sport, district, age, and name
- **Performance Insights**: View detailed performance graphs for each athlete
- **Quick Statistics**: See total athletes, sports, and districts at a glance
- **Responsive Design**: Access from any device

### General Features 🎯
- **Secure Authentication**: Password hashing with bcrypt
- **Real-time Notifications**: Toast messages for all actions
- **Responsive UI**: Works on mobile, tablet, and desktop
- **Data Validation**: Frontend and backend validation
- **Loading States**: Smooth user experience with loading indicators
- **Confirmation Dialogs**: Prevent accidental deletions

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - UI library
- **React Router 6.24.0** - Client-side routing
- **Vite** - Build tool and dev server
- **Tailwind CSS 4.1.16** - Utility-first CSS framework
- **Chart.js 4.4.3** - Data visualization
- **Axios 1.7.2** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js 4.18.2** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 8.19.3** - MongoDB ODM
- **bcryptjs 2.4.3** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use MongoDB Atlas
- **Git** - [Download here](https://git-scm.com/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/HarshitOnClouds/sportsHackathon.git
cd sportsHackathon
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## 🔧 Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=3001
MONGO_URL_LOCAL=mongodb://localhost:27017/sportsHackathon
```

**Note**: If you're using MongoDB Atlas, replace `MONGO_URL_LOCAL` with your Atlas connection string:
```env
MONGO_URL_LOCAL=mongodb+srv://<username>:<password>@cluster.mongodb.net/sportsHackathon?retryWrites=true&w=majority
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3001
```

## ▶️ Running the Application

### Method 1: Run Backend and Frontend Separately

#### Start the Backend Server

```bash
cd backend
npm start
```

The backend server will start on `http://localhost:3001`

#### Start the Frontend Development Server

Open a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

### Method 2: Run Both Concurrently (Optional)

You can install `concurrently` to run both servers with one command:

```bash
# In the root directory
npm install -g concurrently

# Create a script to run both
concurrently "cd backend && npm start" "cd frontend && npm run dev"
```

## 📂 Project Structure

```
sportsHackathon/
├── backend/
│   ├── controllers/
│   │   ├── performanceController.js  # Performance CRUD operations
│   │   └── userController.js         # User authentication & CRUD
│   ├── models/
│   │   ├── performanceModel.js       # Performance schema
│   │   └── userModel.js              # User schema
│   ├── routes/
│   │   ├── performanceRoutes.js      # Performance API routes
│   │   └── userRoutes.js             # User API routes
│   ├── .env                          # Environment variables
│   ├── index.js                      # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoadingSpinner.jsx    # Reusable loading component
│   │   │   └── ProtectedRoute.jsx    # Route protection wrapper
│   │   ├── constants/
│   │   │   └── sportsConstants.js    # Sports & metrics lists
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Authentication state
│   │   │   ├── ThemeContext.jsx      # Dark/Light mode state
│   │   │   └── ToastContext.jsx      # Notification state
│   │   ├── pages/
│   │   │   ├── AthleteProfile.jsx    # Athlete profile & performance
│   │   │   ├── CoachDashboard.jsx    # Coach dashboard & filters
│   │   │   ├── EditProfile.jsx       # Profile editing
│   │   │   ├── HomePage.jsx          # Landing page
│   │   │   ├── LoginPage.jsx         # Login form
│   │   │   ├── Navbar.jsx            # Navigation component
│   │   │   └── SignupPage.jsx        # Registration form
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx                  # App entry point
│   │   └── index.css                 # Global styles
│   ├── .env                          # Environment variables
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js            # Tailwind configuration
│   └── vite.config.js                # Vite configuration
│
└── README.md                         # This file
```

## 🔌 API Endpoints

### User Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Create new user account |
| POST | `/api/users/login` | Login user |
| GET | `/api/users/athletes` | Get all athletes (with filters) |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user profile |

### Performance Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/performance` | Log new performance record |
| GET | `/api/performance/athlete/:athleteId` | Get athlete's performances |
| DELETE | `/api/performance/:id` | Delete performance record |

## 📊 Available Sports

- Athletics (Sprinting, Jumping, Throwing)
- Badminton
- Basketball
- Boxing
- Cricket
- Football
- Hockey
- Kabaddi
- Swimming
- Table Tennis
- Tennis
- Volleyball
- Weightlifting
- Wrestling
- Other

## 📈 Available Performance Metrics

- 100m Time, 200m Time, 400m Time
- Long Jump, High Jump, Vertical Jump
- Shot Put, Discus Throw, Javelin Throw
- Bench Press, Deadlift, Squat
- Runs Scored, Wickets Taken, Goals Scored
- Other (custom metrics)

## 🎨 Features in Detail

### Authentication
- Secure password hashing using bcrypt
- Role-based access (Athlete/Coach)
- Persistent login sessions

### Performance Tracking
- Log multiple performance metrics
- View historical data with charts
- Calculate statistics automatically
- Export data to CSV

### Dashboard Features
- Filter athletes by sport, district, age
- Search athletes by name
- View athlete statistics
- Clear filters with one click

### User Experience
- Dark/Light mode toggle
- Toast notifications
- Loading indicators
- Confirmation dialogs
- Responsive design
- Form validations

## 🐛 Troubleshooting

### MongoDB Connection Issues

If you get a connection error:
1. Make sure MongoDB is running locally
2. Check your connection string in `.env`
3. Verify database name is correct

### Port Already in Use

If port 3001 or 5173 is already in use:
```bash
# Kill the process on Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Change the port in backend/.env or frontend/vite.config.js
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Harshit**
- GitHub: [@HarshitOnClouds](https://github.com/HarshitOnClouds)

## 🙏 Acknowledgments

- Built for Uttarakhand Sports Talent Discovery
- Inspired by the need to connect athletes with opportunities
- Thanks to all contributors and testers

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact the development team

---

**Made with ❤️ for Uttarakhand Athletes**
