const router = require('express').Router();
const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcrypt');
router.get('/', (req, res) => {
    res.send('auth route');
})


//Register
router.post('/register', async (req, res) => {
    try {
        if (!(req.body.userName && req.body.password && req.body.otp && req.body.email)) {
            return res.status(400).json('Bad request');
        }
        else {
            const otp = await OTP.findOne({email:req.body.email});
            if(!otp) return res.status(403).json('Generate OTP first')
            if(otp.otp !=req.body.otp) return res.status(403).json('Invalid OTP');
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt);
            const newUser = await new User({
                userName: req.body.userName,
                email: req.body.email,
                password: hash
            });
            const user = await newUser.save();
            return res.status(200).json(user);
        }
        
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

//login

router.post('/login', async (req, res) => {

    try {
        if (!(req.body.email && req.body.password)) return res.status(400).json('Bad request');
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(403).json("User Not found");
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(403).json('Incorrect Password or email');
        const { password, ...other } = user._doc;
        other && res.status(200).json(other)
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});
module.exports = router