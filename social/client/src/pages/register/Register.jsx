import axios from 'axios';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { userContext } from '../../userContext';
import DirectionSnackbar from './../../components/snackbar/DirectionSnackbar';
import Loader from './../../components/loader/Loader'

import './register.css';
import { TextField } from '@material-ui/core/';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Button, Checkbox, FormControlLabel, Paper, Tooltip } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Box } from '@mui/system';

const useStyles = makeStyles((theme) => ({
    root: {
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {

            borderColor: "blue"
        },
        "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "purple"
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "purple"
        }
    },
    input: {
        color: 'blue'
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(3),
        color: "blue",
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    button: {
        width: '100%'
    }
}));


const Register = () => {
    const classes = useStyles();
    const { setUser } = useContext(userContext);
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpGenereated, setOtpGenerated] = useState(false);
    const [password, setPassword] = useState('');
    const [termsConditon, setTermsCondition] = useState(false);
    const [message, setMessage] = useState('');
    const [snackbarStatus, setSnackbarStatus] = useState('');
    const navigate = useNavigate();
    const tocMessage = 'This web app is just a demo project. Please dont post any sensitive data as in we do not gaurentee if user data is compromised. No authentication security is implemeted in this project'

    const submitHandler = () => {
        const body = { password, email, userName, otp }
        setLoading(true)
        axios.post(`${process.env.REACT_APP_BASEURL}/auth/register`, body)
            .then(res => {
                setLoading(false);
                setMessage('Register successfull');
                setSnackbarStatus('success');
                localStorage.setItem('userId', res.data._id);
                setUser(res.data);
                localStorage.setItem('firstLogin', true);
                navigate('/welcome');
        })
            .catch(err => {
                console.log(err.response);
                setLoading(false);
                setMessage('Oops!!! Something went wrong. Please try again later.');
                setSnackbarStatus('error');
            })
    }

    const optMail = () => {
        setOtpGenerated(true);
        setLoading(true)
        axios.post(`${process.env.REACT_APP_BASEURL}/mail`, { email })
            .then(res => {
                setLoading(false);
            })
            .catch(err => {
                console.log(err?.response)
                setOtpGenerated(false)
                setLoading(false)
                if (err && err.response && err.response.data && typeof (err.response.data) === 'string') {
                    setMessage(err.response.data)
                } else setMessage('Please confirm your email address or else Please try again later');
                setSnackbarStatus('error')
            })
    }
    const navigateToLogin = () => {
        navigate('/')
    }

    return (
        <>
            <Container component="main" className='border'>
                <Grid container className='loginContainer'>
                    <Grid item lg={6} xs={12} >
                        <Typography component="h1" variant="h3" style={{ fontWeight: 'bold', marginLeft: '5%' }}>
                            Social
                        </Typography>
                    </Grid>
                    <Grid className={classes.paper} item xs={12} lg={5}>
                        <Paper elevation={24}>
                            <Box sx={{ m: 2 }} lg={{ m: 4 }}>
                                <form className={classes.form}  >
                                    <Grid container spacing={2}>
                                        {!otpGenereated ?
                                            <>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        variant="outlined"
                                                        required
                                                        fullWidth
                                                        type='email'
                                                        label="Email"
                                                        value={email}
                                                        InputLabelProps={{
                                                            style: { color: 'blue' },
                                                        }}
                                                        inputProps={{
                                                            style: { color: 'blue' }
                                                        }}
                                                        className={classes.root}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </Grid>
                                                {email.length > 1 ?

                                                    <Button variant="contained" size="medium" color="success" fullWidth onClick={(e) => { optMail() }} >
                                                        Generate OTP
                                                    </Button>
                                                    : <Button variant="contained" size="medium" color="success" disabled fullWidth >
                                                        Generate OTP
                                                    </Button>
                                                }


                                            </>
                                            : <>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        variant="outlined"
                                                        required
                                                        fullWidth
                                                        type='text'
                                                        label="User Name"
                                                        InputLabelProps={{
                                                            style: { color: 'blue' },
                                                        }}
                                                        inputProps={{
                                                            style: { color: 'blue' },
                                                            maxLength: 20
                                                        }}
                                                        value={userName}
                                                        placeholder='Mininum 3 characters'
                                                        className={classes.root}
                                                        onChange={(e) => setUserName(e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        variant="outlined"
                                                        required
                                                        fullWidth
                                                        type="number"
                                                        label="OTP"
                                                        InputLabelProps={{
                                                            style: { color: 'blue' },
                                                        }}
                                                        inputProps={{
                                                            style: { color: 'blue' }
                                                        }}
                                                        className={classes.root}
                                                        onChange={(e) => setOtp(e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        variant="outlined"
                                                        required
                                                        fullWidth
                                                        label="Password"
                                                        type="password"
                                                        className={classes.root}
                                                        InputLabelProps={{
                                                            className: classes.input
                                                        }}
                                                        inputProps={{
                                                            style: { color: 'blue' }
                                                        }}
                                                        placeholder='Mininum 6 characters'
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid>
                                                    <FormControlLabel
                                                        control={<Checkbox className='checkbox' color="secondary" style={{ color: 'purple' }} onClick={(e) => setTermsCondition(!termsConditon)} />}
                                                        label="I agree the terms and conditions"
                                                    />
                                                    <Tooltip title={tocMessage} arrow>
                                                        <HelpOutlineIcon />
                                                    </Tooltip>
                                                </Grid>

                                                {termsConditon && email.length > 1 && password.length > 5 && userName.length > 2 && otp.length > 5 ?
                                                    <Button variant="contained" size="medium" color="success" fullWidth onClick={(e) => submitHandler()}>
                                                        Register
                                                    </Button>
                                                    :
                                                    <Button variant="contained" size="medium" color="success" fullWidth disabled>
                                                        Register
                                                    </Button>
                                                }
                                            </>
                                        }
                                        {
                                            otpGenereated ?
                                                <div onClick={(e) => { optMail() }} className='cp'>    Resend OTP?</div>
                                                : <></>
                                        }
                                        <div className="hr"></div>
                                        Already have account? Login instead
                                        <Button variant="contained" size="medium" fullWidth onClick={navigateToLogin}>
                                            Login
                                        </Button>
                                    </Grid>
                                </form>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
                {snackbarStatus}
            </Container>
            <Loader loading={loading} />

            {snackbarStatus &&
                <DirectionSnackbar open={true} message={message}
                    status={snackbarStatus}
                />
            }
        </>
    );
}

export default Register;