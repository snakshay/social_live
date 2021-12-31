
const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
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
    postId:{
        type:String,
        required:true
    }
},{ timestamps: true })

module.exports = mongoose.model('Comments', commentSchema)

