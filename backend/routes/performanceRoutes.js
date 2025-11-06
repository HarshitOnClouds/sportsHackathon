const express = require('express');
const router = express.Router();

// Import the controller functions
const {
    logPerformance,
    getAthletePerformance
} = require('../controllers/performanceController');

// --- Define API Endpoints ---

// POST /api/performance
// This is for an athlete to log a new performance record
router.post('/', logPerformance);

// GET /api/performance/:athleteId
// THIS IS FOR THE ANALYTICS GRAPH
// Gets all performance records for a single athlete, sorted by date
router.get('/:athleteId', getAthletePerformance);


module.exports = router;