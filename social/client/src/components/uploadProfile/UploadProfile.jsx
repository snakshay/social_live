import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { userContext } from './../../userContext';
import DirectionSnackbar from './../../components/snackbar/DirectionSnackbar';
import Loader from './../../components/loader/Loader'
import { useNavigate } from 'react-router-dom';

import { Container, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
const Input = styled('input')({
    display: 'none',
  });
const UploadProfile = () => {
    const {user,setUser} = useContext(userContext);
    const [errorStatus, setErrorStatus]=useState();
    const [message, setMessage] = useState('');
    const [loading, setLoading] =useState(false);
    const [isProfileEdit, setIsProfileEdit] = useState(false);
    const navigate = useNavigate();

    const uploadProfile =(e) =>{
        if(e){
            let file= e.target.files[0]
            let filesize = Math.round((file.size)/1024/1024);
            if(!file.type.indexOf("image")>-1 || !file.type.indexOf("video")>-1){
                if(filesize<50){
                    setMessage('');
                    setErrorStatus('');
                    const src = URL.createObjectURL(file)
                    upload(file,src);
                }
                else{
                    setMessage('File size exceeds maximum limit of 50MB');
                    setErrorStatus('error');
    
                }
            }
            else{
                setMessage('File format not supported');
                setErrorStatus('error')
            }
        }
        else upload('','');
    }

    const upload =(file,src) =>{
       console.log(file)
        setLoading(true);
        let bodyFormData = new FormData();
        bodyFormData.append('image', file); 
        bodyFormData.append('userId', user._id);
        axios.post(`${process.env.REACT_APP_BASEURL}/upload/profilePicture`,bodyFormData)
        .then(res=>{
            setErrorStatus('success');
            if(file&& src){
                setMessage('You look Great!!!');
            }else setMessage('Profile photo removed');
            setLoading(false);
            let userCopy ={...user};
            userCopy.profilePicture = src
            setUser(userCopy)
        })
        .catch(err=>{
            console.log(err.response);
            setLoading(false);
            setMessage("Oops!!! Something went wrong. Please try again later");
            setErrorStatus('error');
        })
    }

    useEffect(()=>{
        if (!localStorage.getItem('firstLogin')){
            setIsProfileEdit(true);
        }
        else setIsProfileEdit(false);
    },[]);

    return ( 
    <>
        <Container>
            {user && 
            <>
                    {isProfileEdit && <Button onClick={(e) => { navigate('/profile')}}><ArrowBackIosNewRoundedIcon/> Back To profile</Button>}
                <div className="center my-50 pt-100">
                
                </div>
                <div className='center my-50'>
                {
                    user.profilePicture?
                    <img src={user.profilePicture} alt="Profile " className='profileIcon ' />
                    :  <img src="assets/profile.png" alt="Upload Profile"  className='profileIcon' />
                }
                </div>
                <div  className='center'>
                    <label htmlFor="contained-button-file">
                    <Input accept="image/*" id="contained-button-file"  type="file" onChange={(e)=>{uploadProfile(e)}}/>
                    <Button variant="contained" component="span" >
                       {user.profilePicture?'Change':'Upload'}
                    </Button>
                    </label>
                </div>
                <div style={{ float: 'right' }} >
                    <Button   onClick={(e) => { uploadProfile('') }}>
                        Remove Profile
                    </Button>
                </div>
            </>
            }
        </Container>
        {message && 
            <DirectionSnackbar open={true}  message={message}
            status={errorStatus}
            />
        }
        <Loader loading={loading}/>
    </>
    );
}
 
export default UploadProfile;