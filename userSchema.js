const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
        unique: [true, 'username already in use'],
        minLength: [1, 'username is too short'],
        maxLength: [40, 'username is too long'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minLength: [1, 'password is too short'],
        maxLength: [40, 'password is too long']
    },
    goals: {
        type: [mongoose.SchemaTypes.ObjectId],
        default: [],
    },
    points: {
        type: Number,
        default: 0,
    },
    leaderboardNumber: {
        type: Number,
        default: null,
    }
});


const User = mongoose.model('User', userSchema);
module.exports = User;