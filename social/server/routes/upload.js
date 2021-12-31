const router = require('express').Router();
const uploadController = require('../controller/uploadController');
const multer = require('multer');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRECT
})

const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, "")
    }
})

const upload = multer({
    storage
}).single('image')


router.post('/profilePicture', upload, uploadController, async (req, res) => {
    try {
        console.log('in upload block',req.body.userId)
        const user =await User.findById(req.body.userId);
        user.profilePicture = req.body.picture;
        await User.findByIdAndUpdate(req.body.userId,{
            $set:user
        });
        res.status(200).send('Profile picture updated successfully!');
    } catch (error) {
        res.send(error)
    }
});

router.post('/coverPicture', upload, uploadController, async (req, res) => {
    try {
        console.log('in upload block',req.body.userId)
        const user =await User.findById(req.body.userId);
        console.log(user)
        user.coverPicture = req.body.picture;
        console.log(user)
        await User.findByIdAndUpdate(req.body.userId,{
            $set:user
        });
        res.status(200).send('Cover picture updated successfully!');
    } catch (error) {
        res.send(error)
    }
});



module.exports = router