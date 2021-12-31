import axios from 'axios';
import { useState,useEffect } from 'react';
import { format } from 'timeago.js';

import DirectionSnackbar from './../../components/snackbar/DirectionSnackbar';
import Loader from './../../components/loader/Loader'
import AddComment from '../addComment/AddComment';
import ViewComments from '../viewComments/ViewComments';
import SimpleDialog from './../dialog/Dialog';

import { Container, Grid, Tooltip } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const useStyles = makeStyles(theme => ({
    menuColor: {
      color: 'grey',
      fontSize:"14px",
      display:"inline"
    },
    cardSpacing:{
        marginTop:'2%',
        marginBottom:'2%'
    },
    likeCounter:{
        paddingRight:'10px',
        color:'white'
    },
    center:{
        alignItems:"center",
        justifyContent:"center"
    },
    card:{
        minWidth:"300px"
    },
    commentCounter:{
        paddingLeft:'10px'
    }
}));

const Post = (props) => {
    const classes = useStyles();
    const [likes,setLikes] = useState([]); //for likes count
    const [commentsCount,setCommentsCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isDeleted, setIsDeleted] = useState(false);
    const [message, setMessage] = useState('');
    const [errorStatus, setErrorStatus]=useState();
    const [loading, setLoading] =useState(false);
    const [openLikesPopup,setOpenLikesPopup] =useState(false); //for all likes popup
    const [likesList, setLikesList] = useState([]);
    const [viewAllComments,setViewAllComments] = useState(false);

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const handleCloseLikesPopup = () => {
        setOpenLikesPopup(false);
      };
  

    useEffect(()=>{
        if(props.post.likes){
            setLikes(props.post.likes);
        }
    },[props.post.likes])

    useEffect(()=>{
        if(props.post.commentCount){
            setCommentsCount(props.post.commentCount);
        }
    },[props.post.commentCount]);

    const likePost = (id) =>{
        if(!likes.includes(props.loggedInUser)){ //only single like
            let likeCopy= [...likes];
            likeCopy.push(props.loggedInUser);
            setLikes(likeCopy);
            likeApi(id)
        }
    }

    const unLikePost = (id) =>{
        let likeCopy= [...likes];
        likeCopy.pop(props.loggedInUser);
        setLikes(likeCopy);
        likeApi(id)
    }

    const likeApi = (id) =>{
        axios.put(`${process.env.REACT_APP_BASEURL}/posts/${id}/like`,{userId:props.loggedInUser})
    }

    const deletePost = async (id) =>{
        handleClose();
        setLoading(true);
        axios.put(`${process.env.REACT_APP_BASEURL}/posts/${id}/delete`,{userId:props.loggedInUser})
            .then((res)=>{
                setErrorStatus('success');
                setMessage(res.data);
                setIsDeleted(true);
                setLoading(false);
            })
            .catch(err=>{
                console.log(err.response);
                setErrorStatus('error');
                setMessage(err.response?.data);
                setLoading(false);
            })
    }

    const viewAllLikes = (id) =>{
        setLoading(true);
        axios.get(`${process.env.REACT_APP_BASEURL}/posts/${id}/likeList`)
        .then((res)=>{
            setLikesList(res.data);
            setLoading(false);
            setOpenLikesPopup(true);
        })
        .catch(err=>{
            console.log(err.response);
            setErrorStatus('error');
            setMessage('Oops!!! something went wrong. Please try again later');
            setLoading(false);
        })
    }

    const commentCountInc = () =>{
        let count = commentsCount+1;
        setCommentsCount(count);
    }
    
    return ( 
        <>
        {props && props.post && !isDeleted ?
                <Container className={classes.cardSpacing}>
                    <Grid item container  lg={12} xs={12}>
                        <Card  style={{color:'white', backgroundColor:"black" , width:"100%", borderRadius:"10px"}} onDoubleClick={(e)=> likePost(props.post._id)} >
                            <CardHeader
                                avatar={
                                <Avatar sx={{ bgcolor: red[500] }} 
                                aria-label={props.post.userName} 
                                src={props.post.userProfile}/>}
                                title={props.post.userName}
                                titleTypographyProps={{variant:'h6' }}
                                className={classes.header}
                                subheader={
                                    <>
                                        <Typography className={classes.menuColor}>
                                            {props.post.location?<>{props.post.location}<br/></>:""}
                                            {format(props.post.createdAt)}
                                        </Typography>
                                        {props.post.userId===props.loggedInUser?
                                            <MoreHorizIcon
                                                id="basic-button"
                                                aria-controls="basic-menu"
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                                onClick={handleClick}
                                                style={{float:'right', color:"white"}}
                                            >
                                            </MoreHorizIcon>
                                            :<></>
                                        }
                                    </>
                                }
                            />
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={(e)=>{deletePost(props.post._id)}}><DeleteOutlineRoundedIcon/>Delete Post</MenuItem>
                                {/* <MenuItem onClick={handleClose}>My account</MenuItem>
                                <MenuItem onClick={handleClose}>Logout</MenuItem> */}
                            </Menu>
                            {props.post.img?   
                                    props.post.img.includes('.mp4')?
                                        <CardMedia
                                            component="video"
                                            image={props.post.img}
                                            alt="Post"
                                            controls
                                        
                                        />
                                    :
                                        <CardMedia
                                            className={classes.card}
                                            component="img"
                                            image={props.post.img}
                                            alt="Post"
                                            controls
                                        />
                            :<></>
                            }
                            <CardContent>
                                <Typography variant="body2" >
                                    {props.post.desc}
                                </Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                                {likes && likes.includes(props.loggedInUser)?
                                    <>
                                        <IconButton aria-label="add to favorites" style={{color:'red'}} onClick = {(e)=>{unLikePost(props.post._id)}} >
                                        <FavoriteIcon />
                                        </IconButton>
                                        <Tooltip title="View All Likes" arrow className="cp">

                                            <Typography component="h4" className={classes.likeCounter} onClick={(e)=>{viewAllLikes(props.post._id)}}> {likes.length} </Typography> 
                                        </Tooltip>
                                    </>
                                :
                                    <>
                                        <IconButton aria-label="add to favorites" style={{color:'white'}} onClick={(e)=>{likePost(props.post._id)}}>
                                        <FavoriteIcon  />
                                        </IconButton>
                                        <Tooltip title="View All Likes" arrow className="cp">

                                            <Typography component="h4" className={classes.likeCounter} onClick={(e)=>{viewAllLikes(props.post._id)}}> {likes.length} </Typography> 
                                        </Tooltip>
                                    </>
                                }
                                 <ChatBubbleOutlineIcon></ChatBubbleOutlineIcon>
                                 <Tooltip title="View All Comments" arrow className="cp">
                                    <Typography component="h4" className={classes.commentCounter} > {commentsCount} </Typography> 
                                 </Tooltip>
                            </CardActions>
                            {commentsCount>0?
                                <>
                                    {!viewAllComments
                                        ?
                                        <div style={{ color: 'grey', fontSize: '12px' }} className="cp m-10" onClick={(e) => { setViewAllComments(true) }}>
                                            View All Comments
                                        </div>
                                        :
                                        <div style={{ color: 'grey', fontSize: '12px' }} className="cp m-10" onClick={(e) => { setViewAllComments(false) }}>
                                            Hide Comments
                                        </div>
                                    }
                                </>
                            :<></>
                            }
                           
            
                            <AddComment userProfile={props.post.userProfile}
                                postId = {props.post._id}
                                loggedInUserName={props.loggedInUserName}
                                commentCountInc={commentCountInc}
                                />
                            {viewAllComments?
                            
                                <ViewComments postId={props.post._id}/>
                                :<></>
                            }
                        </Card>
                    </Grid>
                    {message && 
                        <DirectionSnackbar open={true}  message={message}
                        status={errorStatus}
                        />
                    }
                   <Loader loading={loading}/>
                   {openLikesPopup && likesList.length>0?
                            <SimpleDialog
                                open={openLikesPopup}
                                list= {likesList}
                                onClose={handleCloseLikesPopup}
                                header="Likes"

                            />:<></>
                            }
                </Container>
                
           :<></>
        }
        </>
     );
}
 
export default Post;