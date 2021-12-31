const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        min: 3,
        max: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    profilePicture: {
        type: String,
        default: ""
    },
    coverPicture: {
        type: String,
        default: ""
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        default:"Hi! Follow to know more about me",
        max:500
    },
    city: {
        type: String,
        max: 50,
        default:"India"
    },
    from: {
        type: String,
        max: 50,
        default:"India"
    },
    relationship: {
        type: Number,
        enum: [1, 2, 3],
        default:1
    }
},
    { timestamps: true }
)

module.exports = mongoose.model('Users', userSchema)