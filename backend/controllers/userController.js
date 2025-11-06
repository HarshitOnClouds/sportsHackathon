const User = require('../models/userModel');

// @desc    Create a new user (athlete or coach)
// @route   POST /api/users
// @access  Public
const createUser = async (req, res) => {
    try {
        const { name, email, role, sport, district, age, team } = req.body;

        // Basic validation
        if (!name || !email || !role || !district) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            role,
            sport,
            district,
            age,
            team
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                sport: user.sport,
                district: user.district,
                age: user.age,
                team: user.team,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
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
    getUserById
};