const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
router.get('/', (req, res) => {
    res.send('user route');
})

//get user
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        !user && res.status(200).json('No user found');
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        console.log(err)
        res.send(500).json(err)
    }
})

//follow a user
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            //in params id for whom to be followed
            //in body id for loggedInUser
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId); //loggedInUser
            if (!user.followers.includes(req.body.userId)) {
                await currentUser.updateOne({ $push: { following: req.params.id } });
                await user.updateOne({ $push: { followers: req.body.userId } });
                res.status(200).json('User Followed!');
            }
            else {
                res.status(403).json('you already follow this user');
            }
        } catch (err) {

        }
    } else {
        return res.status(403).json('You cannot follow yourself');
    }
});

//unfollow
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            //in params id for whom to be followed
            //in body id for loggedInUser
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId); //loggedInUser
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { following: req.params.id } });
                res.status(200).json('User Unfollowed!');
            }
            else {
                res.status(403).json('you dont follow this user')
            }
        } catch (err) {

        }
    } else {
        return res.status(403).json('You cannot unfollow yourself');
    }
});

//update user based on id
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) { // reset password
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                console.log(err);
                return res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            });
            res.status(200).json("Account updated successfully");
        } catch (err) {
            console.log(err)
            res.send(500).json(err)
        }
    }
    else {
        return res.status(403).json('Unathourized');
    }
});

//delete user
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) { // check if self update or admin update

        try {
            const user = await User.deleteOne({ _id: req.params.id });
            res.status(200).json("Account deleted successfully");
        } catch (err) {
            console.log(err)
            res.send(500).json(err)
        }
    }
    else {
        return res.status(403).json('Unathourized');
    }
});

//search user
router.get('/finduser/:userName', async (req, res) => {
    try{
        const users = await User.find({ userName: { $regex: req.params.userName, $options: 'i' } }, { password: 0, isAdmin: 0, updatedAt: 0 });
        res.status(200).send(users);
    }catch(err){
        res.status(500).json(err)
    }
});

router.get('/:id/findFollowers', async (req, res) => {
    try{
        const followersId = await User.find({ _id: req.params.id }, { _id: 0, followers: 1 });
        let followersList = [];
        await Promise.all(followersId[0].followers.map(async (e) => {
            const follower = await User.find({ _id: e }, { userName: 1, profilePicture: 1, _id: 0 });
            followersList.push(follower);
        }))
        res.send(followersList);
    }catch(err){
        res.status(500).json(err)
    }
});

router.get('/:id/findFollowing', async (req, res) => {
    try{
        const followingId = await User.find({ _id: req.params.id }, { _id: 0, following: 1 });
        let followingList = [];
        await Promise.all(followingId[0].following.map(async (e) => {
            console.log(e);
            const following = await User.find({ _id: e }, { userName: 1, profilePicture: 1, _id: 0 });
            followingList.push(following);
        }))
        res.send(followingList);
    }catch(err){
        res.status(500).json(err)
    }
});

module.exports = router