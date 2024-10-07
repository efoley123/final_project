const mongoose = require('mongoose')

const goalSchema = new mongoose.Schema({
    author: mongoose.SchemaTypes.ObjectId,
    title: String,
    description: String,
    dueDate: Date,
    priority: String,
    complete: Boolean,
    active: Boolean
});

const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;