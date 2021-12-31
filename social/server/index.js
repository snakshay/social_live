const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors')
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
const uploadRoute = require('./routes/upload');
const mailRoute = require('./routes/mailHandler');
dotenv.config();
const app = express();
const port = 4000;

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () => {
    console.log('connected to mongoDb')
});

//middlewares
app.use(cors())
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
app.use('/users', userRoute);
app.use('/auth', authRoute);
app.use('/posts', postRoute);
app.use('/upload', uploadRoute);
app.use('/mail', mailRoute);

app.get('/', (req, res) => {
    res.send('social backend server')
})

app.listen(port, '192.168.29.78', () => {
    console.log(`server is listening at port ${port}`)
})