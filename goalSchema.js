const mongoose = require('mongoose')

const goalSchema = new mongoose.Schema({
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, 'author id is required to link a goal to its user']
    },
    title: {
        type: String,
        default: "My Goal",
    },
    description: String,
    days: {
        type: [String],
        default:[],
    },
    priority: String,
    completed: {
        type: [Date],
        default: [],
    }
});

const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;