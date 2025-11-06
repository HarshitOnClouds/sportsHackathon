const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    // Basic Info
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        trim: true,
        lowercase: true
    },
    
    password: { 
        type: String, 
        required: [true, 'Please add a password'],
        minlength: 6
    }, 

    // Role-based logic
    role: {
        type: String,
        required: true,
        enum: ['athlete', 'coach'] // Only allows these two values
    },

    // Athlete-Specific "Filterable" Data
    sport: {
        type: String,
        required: [function() { return this.role === 'athlete'; }, 'Sport is required for athletes']
    },
    district: {
        type: String,
        required: [true, 'District is required']
    },
    age: {
        type: Number,
        required: [function() { return this.role === 'athlete'; }, 'Age is required for athletes']
    },

    // Coach-Specific Data
    team: {
        type: String,
        required: [function() { return this.role === 'coach'; }, 'Team or affiliation is required for coaches']
    }

}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('User', userSchema);