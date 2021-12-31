const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Comments = require('../models/Comment');
const multer = require('multer');
const AWS = require('aws-sdk');

const dotenv = require('dotenv');
const uploadController = require('../controller/uploadController');

dotenv.config();
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRECT
})

const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, "")
    }
});

const upload = multer({
    storage
}).single('image')

router.get('/', async (req, res) => {
    res.send('Posts route')
});

//create a post
router.post('/', upload, uploadController, async (req, res) => {
    req.body.img = req.body.picture;
    delete req.body.picture;
    const newPost = new Post(req.body);
    try {
        const savePost = await newPost.save();
        res.status(200).json(savePost);
    } catch (err) {
        res.status(500).json(err)
    }
});

//update a post
router.put("/:id", upload, uploadController, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        !post && res.status(403).json('No post available');
        if (post.userId === req.body.userId || req.body.isAdmin) {
            req.body.img = req.body.picture;
            delete req.body.picture;
            const updatePost = await Post.findByIdAndUpdate(req.params.id, {
                $set: req.body
            })
            res.status(200).json('Post updated successfully');
        }
        else {
            res.status(403).json('Unathourized')
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//delete post
router.put("/:id/delete", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        !post && res.status(403).json('No post available');
        if (post.userId === req.body.userId || req.body.isAdmin) {
            const deletePost = await Post.findByIdAndDelete(req.params.id);
            res.status(200).json('Post deleted successfully');
        }
        else {
            res.status(403).json('Unathourized')
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//like unlike a post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json('The post has been liked')
        }
        else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json('The post has been disliked')
        }
    } catch (error) {
        res.status(500).json(error)
    }
});

//get a post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        !post && res.status(403).json('No post available');
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
});

// get followers post
router.post('/timeline', async (req, res) => {
    let postArray = [];
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId: currentUser._id }).sort({ createdAt: -1 });
        await Promise.all(
            currentUser.following.map(async(followersId) => {
                console.log(followersId)
                const post= await Post.find({ userId: followersId }).sort({ createdAt: -1 });
                postArray.push(post)
            })
        );
        res.json(userPosts.concat(...postArray));
    } catch (err) {
        res.status(500).json(err);
    }
});

//get All post by userId;

router.post('/getPostByUserId', async (req, res) => {
    try {
        const userPost = await Post.find({ userId: req.body.userId }).sort({ createdAt: -1 });
        res.send(userPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id/likeList', async(req,res)=>{
    try {
        const likesId = await Post.find({_id:req.params.id});
        !likesId && res.status(403).json('No post available');
        let likeList = [];
            await Promise.all(likesId[0].likes.map(async(e)=>{
                console.log(e);
                const user = await User.find({ _id: e }, { userName: 1, profilePicture: 1, _id: 1 });
                likeList.push(user);
            }))
            res.send(likeList);
      
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/comment' , async(req,res)=>{
    try{
        const {_id,...commentReq} = req.body;
        commentReq.postId = _id
        const newComment = new Comments(commentReq);
        const comment = await newComment.save();
        await Post.updateOne({_id:_id},{$inc:{commentCount:1}})
        res.status(200).json(comment);

    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})

router.get('/:id/getComments',async(req,res)=>{
    try{
        const comments = await Comments.find({postId:req.params.id}).sort({createdAt:-1});
        return res.status(200).json(comments);
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})

module.exports = router