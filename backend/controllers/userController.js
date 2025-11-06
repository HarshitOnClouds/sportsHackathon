const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// @desc    Create a new user (athlete or coach)
// @route   POST /api/users
// @access  Public
const createUser = async (req, res) => {
    try {
        const { name, email, password, role, sport, district, age, team } = req.body;

        // Basic validation
        if (!name || !email || !password || !role || !district) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Build the user object based on the role
        const userData = { name, email: email.toLowerCase(), password: hashedPassword, role, district };
        if (role === 'athlete') {
            if (!sport || !age) {
                return res.status(400).json({ message: 'Athletes must provide sport and age.' });
            }
            userData.sport = sport;
            userData.age = age;
        } else if (role === 'coach') {
            if (!team) {
                return res.status(400).json({ message: 'Coaches must provide a team/affiliation.' });
            }
            userData.team = team;
        }

        // Create new user
        const user = await User.create(userData);

        if (user) {
            // Don't send password back to client
            const userResponse = user.toObject();
            delete userResponse.password;
            res.status(201).json(userResponse);
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }

    } catch (error) {
        console.error('ERROR CREATING USER:', error); // Detailed logging
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Don't send password back to client
            const userResponse = user.toObject();
            delete userResponse.password;
            res.status(200).json(userResponse);
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('LOGIN ERROR:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get athletes with optional filters
// @route   GET /api/users/athletes
// @access  Public (for Coach dashboard)
const getAthletes = async (req, res) => {
    try {
        // This is the core of your analytics feature
        const { sport, district, age } = req.query;

        // Build the filter object
        const filter = { role: 'athlete' }; // Start by only looking for athletes

        if (sport) {
            filter.sport = sport;
        }
        if (district) {
            filter.district = district;
        }
        if (age) {
            // You can add logic for age ranges, e.g., less than a certain age
            filter.age = { $lte: Number(age) }; // $lte = less than or equal to
        }
        
        // You can see the filters being applied in your console
        console.log('Finding athletes with filter:', filter); 

        const athletes = await User.find(filter);

        res.status(200).json(athletes);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get a single user by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


module.exports = {
    createUser,
    getAthletes,
    getUserById,
    loginUser,

};