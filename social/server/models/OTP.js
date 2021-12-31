const mongoose = require('mongoose');
const otpSchema = new mongoose.Schema({
    otp:{
        type:Number,
        required:true,
    },
    email:{
        type:String,
        required:true
    }
},{ timestamps: true })

module.exports = mongoose.model('OTP', otpSchema)