const express = require('express');
const router = express.Router();

// Import the controller functions
const {
    createUser,
    getAthletes,
    getUserById,
    loginUser,
    updateUser,
} = require('../controllers/userController');

// --- Define API Endpoints ---

// POST /api/users
// This will be your "signup" route for both athletes and coaches
router.post('/register', createUser);

// GET /api/users/athletes
// THIS IS YOUR "WOW" FEATURE ROUTE
// A coach will hit this endpoint to find athletes.
// It will support filters like /api/users/athletes?sport=sprint&district=Dehradun
router.get('/athletes', getAthletes);

// GET /api/users/:id
// This gets the profile for a single user (athlete or coach)
router.get('/:id', getUserById);

// PUT /api/users/:id
// This updates a user's profile
router.put('/:id', updateUser);

// POST /api/users/login
// This is the login route for all users
router.post('/login', loginUser);

module.exports = router;