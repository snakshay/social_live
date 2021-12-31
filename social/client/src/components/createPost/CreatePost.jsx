import axios from 'axios';
import { useState, useContext } from "react";

import { userContext } from './../../userContext';
import Loader from './../../components/loader/Loader'
import DirectionSnackbar from './../../components/snackbar/DirectionSnackbar';

import { Container, Grid, Button} from "@mui/material";
import { TextField } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const useStyles = makeStyles((theme) => ({
    root: {
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {

            borderColor: "white"
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "purple"
        },
        marginBottom:"10px"
    }
}))
const CreatePost = () => {
    const classes = useStyles();
    const [message, setMessage] = useState('');
    const [desc, setDesc]=useState('');
    const [src, setSrc] = useState('');
    const [file,setFile]= useState('');
    const {user,setUser} = useContext(userContext);
    const [loading, setLoading] =useState(false);
    const [errorStatus, setErrorStatus]=useState();
    const [location, setLocation] = useState('');
    const onFileChanged = (e) =>{
        let filesize = Math.round((e.target.files.item(0).size)/1024/1024);
        if(!e.target.files[0].type.indexOf("image")>-1 || !e.target.files[0].type.indexOf("video")>-1){
            if(filesize<50){
                setSrc(URL.createObjectURL(e.target.files[0]));
                setFile(e.target.files[0]);
                setMessage('');
                setErrorStatus('');
            }
            else{
                setMessage('File size exceeds maximum limit of 50MB');
                setErrorStatus('error');
            }
        }
        else{
            setMessage('Only Images and Videos are allowed');
            setErrorStatus('error')
        }
    }

    const upload = () =>{
        if(desc||file){
            setLoading(true);
            let bodyFormData = new FormData();
            bodyFormData.append('userName', user.userName); 
            bodyFormData.append('userId', user._id);
            bodyFormData.append('desc',desc);
            bodyFormData.append('location',location);
            bodyFormData.append('userProfile', user.profilePicture);
            bodyFormData.append('image', file);
            axios.post(`${process.env.REACT_APP_BASEURL}/posts`,bodyFormData)
            .then(res=>{
                setErrorStatus('success');
                setMessage('Post added!');
                setLoading(false);
                setDesc('');
                setFile('');
                setSrc('');
                setLocation('');
                setTimeout(()=>{
                    let userCopy={...user};
                    if(userCopy.update){
                        userCopy.update =false;
                    }
                    else{
                        userCopy.update =true;
                    }
                    setUser(userCopy);
                },2000)
            })
            .catch(err=>{
                console.log(err.response);
                setLoading(false);
                setMessage(err.response?.data);
                setErrorStatus('error');
            })
        }
    }

    return (
        <div >
            <Container >
                <Grid item container lg={12} xs={12} style={{backgroundColor:"black", borderRadius:"10px"}}>
                    <Container className="m-10">
                      <TextField
                        variant="outlined"
                        fullWidth
                        type='text'
                        placeholder="What's on your mind, ?"
                        InputLabelProps={{
                            style: { color: 'white' },
                        }}
                        inputProps={{
                            style: { color: 'white' },
                            maxLength:250
                        }}
                        value={desc}
                        onChange={(e)=>{setDesc(e.target.value)}}
                        multiline
                        className={classes.root}
                        />

                        {file||desc?
                            <TextField
                            variant="outlined"
                            fullWidth
                            type='text'
                            placeholder="Enter Location?"
                            InputLabelProps={{
                                style: { color: 'white' },
                            }}
                            inputProps={{
                                style: { color: 'white' },
                                maxLength:50
                            }}
                            value={location}
                            onChange={(e)=>{setLocation(e.target.value)}}
                            className={classes.root}
                            />
                            :<></>
                        
                        }

                        {src &&
                            <div className="video-wrapper">
                                <iframe src={src} scrolling="no" title="myFrame" className="iframe"/>
                            </div>
                        }
                        <label htmlFor="file" className="cp"><CameraAltIcon/></label>

                        <input type="file"
                         id="file" 
                         accept="image/*,video/*" 
                         style={{display:"none"}}  
                         onChange={(e)=>onFileChanged(e)}/>
                        <Button variant="contained" 
                        style={{float:"right"}} 
                        onClick={(e)=>{upload()}}> Upload Post</Button>
                    </Container>

                </Grid>
            </Container>
            {message && 
                <DirectionSnackbar open={true}  message={message}
                status={errorStatus}
                />
            }
            <Loader loading={loading}/>
        </div>
    );
}
 
export default CreatePost;
