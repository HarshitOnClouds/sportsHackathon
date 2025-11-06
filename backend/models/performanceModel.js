const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// THIS IS THE CORE MODEL FOR YOUR ANALYTICS FEATURE
// Every time an athlete logs a new score, a new one of these is created.

const performanceSchema = new Schema({
    // This links the performance log to a specific athlete
    athleteId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Links to the 'User' model
    },

    // The actual performance data
    date: {
        type: Date,
        default: Date.now
    },
    metricName: {
        type: String,
        required: true,
        trim: true,
        // Examples: "100m Time", "Bench Press", "Vertical Jump"
    },
    metricValue: {
        type: Number,
        required: true
        // Examples: 11.8, 80, 60
    },
    metricUnit: {
        type: String,
        required: true,
        trim: true
        // Examples: "seconds", "kg", "cm"
    },
    
    // Optional notes, e.g., "District Meet Final"
    notes: {
        type: String,
        trim: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Performance', performanceSchema);