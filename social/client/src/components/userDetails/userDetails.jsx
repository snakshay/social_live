import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { userContext } from './../../userContext';
import { useNavigate } from 'react-router-dom';

import Loader from './../../components/loader/Loader'
import DirectionSnackbar from './../../components/snackbar/DirectionSnackbar';

import { Button, Container, Grid } from "@mui/material";
import { TextField } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

const useStyles = makeStyles((theme) => ({
    root: {
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "white"
        },
        "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "white"
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
        }
    },
    input: {
        color: "white"
    }
}));

const UserDetails = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const { user, setUser } = useContext(userContext);
    const [userName, setUserName] = useState('');
    const [from, setFrom] = useState('');
    const [city, setCity] = useState('');
    const [relationship, setRelationsip] = useState('');
    const [description, setDesc] = useState('');
    const [errorStatus, setErrorStatus] = useState();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isProfileEdit, setIsProfileEdit] = useState(false);

    useEffect(() => {
        setUserName(user?.userName);
        setCity(user?.city);
        setFrom(user?.from);
        setRelationsip(user?.relationship);
        setDesc(user?.description);
    }, [user]);

    useEffect(() => {
        if (!localStorage.getItem('firstLogin')) {
            setIsProfileEdit(true);
        }
        else setIsProfileEdit(false);
    }, []);

    const saveUser = () => {
        let userCopy = { ...user };
        userCopy.userName = userName;
        userCopy.from = from;
        userCopy.city = city;
        userCopy.relationship = relationship;
        userCopy.description = description;
        const body={
            userId : user._id,
            description,
            city,
            from,
            relationship,
            userName
        }
        setLoading(true)
        axios.put(`${process.env.REACT_APP_BASEURL}/users/${user._id}`,body)
        .then((res)=>{
            setUser(userCopy);
            setErrorStatus('success');
            setLoading(false);
            if(localStorage.getItem('firstLogin')){
                setMessage('Thanks for using Social!');
                localStorage.removeItem('firstLogin');
                setTimeout(()=>{
                    navigate('/home');

                },1000)
            }
            else setMessage(res.data);
        })
        .catch((err)=>{
            setLoading(false);
            setErrorStatus('success');
            setMessage('Oops!!! something went wrong. Please try again later')
        })
    }

    return (
        <div className="userForm">
            {user &&
                <Container >
                    {isProfileEdit && <Button onClick={(e) => { navigate('/profile') }} className="my-50"><ArrowBackIosNewRoundedIcon /> Back To profile</Button>}
                    <Grid container spacing={2} columns={12}>
                        <Grid item lg={12} xs={12} >

                            <TextField variant="outlined"
                                InputLabelProps={{
                                    style: { color: 'white' },
                                }}
                                inputProps={{
                                    style: { color: 'white' },
                                    maxLength:20
                                }}
                                fullWidth
                                required
                                className={classes.root}
                                label="User Name"
                                value={userName}
                                onChange={(e) => { setUserName(e.target.value) }}
                            />
                        </Grid>
                        <Grid item lg={6} xs={12} >

                            <TextField variant="outlined"
                                InputLabelProps={{
                                    style: { color: 'white' },
                                }}
                                inputProps={{
                                    style: { color: 'white' },
                                    maxLength:500
                                }}
                                fullWidth
                                className={classes.root}
                                label="City"
                                value={city}
                                onChange={(e) => { setCity(e.target.value) }}
                            />
                        </Grid>
                        <Grid item lg={6} xs={12}  >

                            <TextField variant="outlined"
                                InputLabelProps={{
                                    style: { color: 'white' },
                                }}
                                inputProps={{
                                    style: { color: 'white' },
                                    maxLength:500
                                }}
                                fullWidth
                                className={classes.root}
                                label="From"
                                value={from}
                                onChange={(e) => { setFrom(e.target.value) }}
                            />
                        </Grid>
                        <Grid item lg={12} xs={12}>

                            <TextField variant="outlined"
                                InputLabelProps={{
                                    style: { color: 'white' },
                                }}
                                inputProps={{
                                    style: { color: 'white' },
                                    maxLength:500
                                }}
                                fullWidth
                                className={classes.root}
                                label="Description"
                                value={description}
                                onChange={(e) => { setDesc(e.target.value) }}
                            />
                        </Grid>
                        <Grid item lg={12} xs={12} >

                            <FormControl >
                                <FormLabel className={classes.input}>Relationship</FormLabel>
                                <RadioGroup
                                    aria-label="gender"
                                    name="radio-buttons-group"
                                    value={relationship}
                                    row
                                    onChange={(e) => { setRelationsip(e.target.value) }}
                                >
                                    <FormControlLabel value={1} control={<Radio />} label="Single" />
                                    <FormControlLabel value={2} control={<Radio />} label="In Relationship" />
                                    <FormControlLabel value={3} control={<Radio />} label="Prefer not to say" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <div className='center'>
                        {userName?.length>2? 

                            <Button variant="contained" onClick={(e)=>{saveUser()}}>
                                Save Details
                            </Button>
                        :   <Button variant="contained" color="error" style={{color:'red'}} disabled>
                                Save Details
                            </Button>
                        }
                    </div>
                </Container>}
                {message &&
                <DirectionSnackbar open={true} message={message}
                    status={errorStatus}
                />
            }
            <Loader loading={loading} />
        </div>
    );
}

export default UserDetails;