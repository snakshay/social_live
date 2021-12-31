const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true
    },
    userName:{
        type:String
    },
    userProfile:{
        type:String
    },
    desc: {
        type: String,
        max: 500
    },
    img: {
        type: String
    },
    likes: {
        type: Array,
        default: []
    },
    location:{
        type:String,
        default:"",
        max:50
    },
    commentCount:{
        type:Number,
        default:0
    }
},
    { timestamps: true }
)

module.exports = mongoose.model('Posts', postSchema)