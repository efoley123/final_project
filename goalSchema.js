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
    dueDate: Date,
    priority: String,
    complete: {
        type: Boolean,
        default: false,
    },
    active: {
        type: Boolean,
        default: false
    }
});

const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;