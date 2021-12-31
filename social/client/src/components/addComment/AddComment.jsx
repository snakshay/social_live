import axios from 'axios'
import { useState } from 'react';

import DirectionSnackbar from './../../components/snackbar/DirectionSnackbar';

import { TextField } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';

const useStyles = makeStyles((theme) => ({
    root: {
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "purple"
        }
    }
}));

const AddComment = (props) => {
    const classes = useStyles();
    const [comment,setComment] = useState();
    const [errorStatus, setErrorStatus] = useState();
    const [message, setMessage] = useState();
    const addComment = (props) =>{
        if(comment){
            const body={
                userProfile :props.userProfile,
                _id:props.postId,
                userName:props.loggedInUserName,
                desc:comment
            }
            axios.post(`${process.env.REACT_APP_BASEURL}/posts/comment`,body)
            .then((res)=>{
                setMessage("Comment added successfully")
                setComment('');
                setErrorStatus('success');
                props.commentCountInc();
            })
            .catch((err)=>{
                console.log(err);
                setErrorStatus('error');
                setMessage("Oops something went wrong!!! Please try again later")

            })
        }
    }
    return ( 
        <>
            <Box sx={{ display: 'flex', alignItems: 'center',margin:'10px' }}>
                <Avatar src={props.userProfile} sx={{height:24,width:24}}></Avatar>

                <TextField  variant="outlined"
                multiline
                fullWidth
                 InputLabelProps={{
                    style: { color: 'white' },
                }}
                inputProps={{
                    style: { color: 'white' },
                    maxLength:500
                }}
                value={comment}
                onChange={(e)=>{setComment(e.target.value)}}
                placeholder="Add Comment..."
                className={classes.root}/>
               
                <SendIcon className="cp" onClick={(e)=>{addComment(props)}}/>
            </Box>
            {message?
                <DirectionSnackbar open={true} 
                    message={message}
                    status={errorStatus}
                    />
                :<></>
            }
        </>
    );
}
 
export default AddComment;