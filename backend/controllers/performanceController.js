const Performance = require('../models/performanceModel');
const User = require('../models/userModel');

// @desc    Log a new performance record for an athlete
// @route   POST /api/performance
// @access  Public (in a real app, this would be protected)
const logPerformance = async (req, res) => {
    try {
        const { athleteId, metricName, metricValue, metricUnit, notes } = req.body;

        // Basic validation
        if (!athleteId || !metricName || !metricValue || !metricUnit) {
            return res.status(400).json({ message: 'Please provide all required performance fields' });
        }

        // Check if the user exists and is an athlete
        const athlete = await User.findById(athleteId);
        if (!athlete) {
            return res.status(404).json({ message: 'Athlete not found' });
        }
        if (athlete.role !== 'athlete') {
            return res.status(400).json({ message: 'User is not an athlete' });
        }

        // Create new performance log
        const performance = await Performance.create({
            athleteId,
            metricName,
            metricValue,
            metricUnit,
            notes
        });

        res.status(201).json(performance);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all performance records for a specific athlete
// @route   GET /api/performance/:athleteId
// @access  Public (for coach dashboard graphs)
const getAthletePerformance = async (req, res) => {
    try {
        const { athleteId } = req.params;

        // Check if the athlete exists
        const athlete = await User.findById(athleteId);
        if (!athlete) {
            return res.status(404).json({ message: 'Athlete not found' });
        }

        // Find all performance records for this athlete
        // We sort by 'date: 1' (ascending) to make it easy for the line chart
        const performances = await Performance.find({ athleteId: athleteId }).sort({ date: 1 });

        if (!performances) {
            return res.status(404).json({ message: 'No performance records found for this athlete' });
        }

        res.status(200).json(performances);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    logPerformance,
    getAthletePerformance
};