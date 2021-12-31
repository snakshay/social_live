const multer = require('multer');
const AWS = require('aws-sdk');
const uuid = require('uuid/v4');
const dotenv = require('dotenv');
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

function uploadController(req, res, next) {
    if (req.file) {
        let myFile = req.file.originalname.split('.')
        const fileType = myFile[myFile.length - 1]
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${uuid()}.${fileType}`,
            Body: req.file.buffer
        }
        s3.upload(params).promise()
            .then(data => {
                imagePath = data.Location;
                req.body.picture = data.Location;
                next();
            })
    }
    else {
        req.body.picture = ""
        next()
    }
}

module.exports = uploadController;