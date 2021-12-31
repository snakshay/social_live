import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { userContext } from './../../userContext';
import { useNavigate } from 'react-router-dom';

import DirectionSnackbar from './../../components/snackbar/DirectionSnackbar';
import Loader from './../../components/loader/Loader';

import { Container, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

const Input = styled('input')({
    display: 'none',
});
const UploadCover = () => {
    const { user, setUser } = useContext(userContext);
    const [errorStatus, setErrorStatus] = useState();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isProfileEdit, setIsProfileEdit] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('firstLogin')) {
            setIsProfileEdit(true);
        }
        else setIsProfileEdit(false);
    }, []);

    const uploadCover = (e) => {
        if(e){
            let file = e.target.files[0]
            let filesize = Math.round((file.size) / 1024 / 1024);
            if (!file.type.indexOf("image") > -1 || !file.type.indexOf("video") > -1) {
                if (filesize < 50) {
                    setMessage('');
                    setErrorStatus('');
                    const src = URL.createObjectURL(file)
                    upload(file, src);
                }
                else {
                    setMessage('File size exceeds maximum limit of 50MB');
                    setErrorStatus('error');
    
                }
            }
            else {
                setMessage('File format not supported');
                setErrorStatus('error')
            }
        }
        else upload('','')
    }

    const upload = (file, src) => {
        console.log(file)
        setLoading(true);
        let bodyFormData = new FormData();
        bodyFormData.append('image', file);
        bodyFormData.append('userId', user._id);
        axios.post(`${process.env.REACT_APP_BASEURL}/upload/coverPicture`, bodyFormData)
            .then(res => {
                setErrorStatus('success');
                if(file&& src){
                    setMessage('Thats a great cover!!!');
                }else setMessage('Cover removed');
                setLoading(false);
                let userCopy = { ...user };
                userCopy.coverPicture = src
                setUser(userCopy)
            })
            .catch(err => {
                console.log(err.response);
                setLoading(false);
                setMessage("Oops!!! Something went wrong. Please try again later");
                setErrorStatus('error');
            })
    }
    return (
        <>
            <Container>
                {user &&
                    <>
                    {isProfileEdit && <Button onClick={(e) => { navigate('/profile') }}><ArrowBackIosNewRoundedIcon /> Back To profile</Button>}
                        {user.coverPicture ?
                            <img src={user.coverPicture} className='coverPicture ' alt="Cover" />
                            : <div className='noCover center'>Upload Your Cover Photo</div>
                        }
                        <div className='center'>
                            <label htmlFor="contained-button-file" className="center">
                                <Input accept="image/*" id="contained-button-file" type="file" onChange={(e) => { uploadCover(e) }} />
                                <Button variant="contained" component="span" >
                                    {user.coverPicture ? 'Change' : 'Upload'}
                                </Button>
                            </label>

                        </div>
                        <div style={{ float: 'right' }} >
                            <Button  onClick={(e) => { uploadCover('') }}>
                                Remove Cover
                            </Button>
                        </div>

                    </>
                }
            </Container>
            {message &&
                <DirectionSnackbar open={true} message={message}
                    status={errorStatus}
                />
            }
            <Loader loading={loading} />
        </>
    );
}

export default UploadCover;