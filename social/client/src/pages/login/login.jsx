import './login.css';
import axios from 'axios';
import React, { useState ,useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { userContext } from '../../userContext';

import DirectionSnackbar from './../../components/snackbar/DirectionSnackbar';
import Loader from './../../components/loader/Loader'

import { TextField } from '@material-ui/core/';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Button, Paper } from '@mui/material';
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
    button:{
        width:'100%'
    }
}));


const Login = () => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [snackbarStatus, setSnackbarStatus] = useState('');
    const {setUser} =useContext(userContext);
    const navigate = useNavigate();

    const submitHandler = ()=>{
    const body={password,email}
    setLoading(true)
     axios.post(`${process.env.REACT_APP_BASEURL}/auth/login`,body)
        .then(res=>{
            setSnackbarStatus('success');
            setMessage('Login successfull');
            localStorage.setItem('userId',res.data._id);
            setUser(res.data);
            setLoading(false);
            navigate('/home');
        })
        .catch(err=>{
            console.log(err.response)
            setLoading(false)
            setMessage(err.response.data)
            setSnackbarStatus('error')
        })
   }

   const navigateToRegsiter = () =>{
    navigate('/register')
   }
   
    return (  
        <>
            <Container component="main"  className='border'>
                <Grid container className='loginContainer'>
                    <Grid item lg={6} xs={12} >
                        <Typography component="h1" variant="h3" style={{ fontWeight: 'bold' ,marginLeft:'5%'}}>
                            Social
                        </Typography>
                    </Grid>
                    <Grid className={classes.paper} item xs={12} lg={5}>
                        <Paper elevation={24}>
                            <Box sx={{ m: 2 }} lg={{ m:4 }}>
                                <form className={classes.form}  >
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                variant="outlined"
                                                required
                                                fullWidth
                                                type='text'
                                                label="Email"
                                                InputLabelProps={{
                                                    style: { color: 'blue' },
                                                }}
                                                inputProps={{
                                                    style: { color: 'blue' }
                                                }}
                                                className={classes.root}
                                                onChange={(e)=>setEmail(e.target.value)}
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
                                                onChange={(e)=>setPassword(e.target.value)}
                                            />
                                        </Grid>
                                      
                                        {email.length>2 && password.length>5?
                                            <Button variant="contained" size="medium" fullWidth onClick={(e)=>submitHandler()}>
                                                Log In
                                            </Button>
                                            :
                                            <Button variant="contained" size="medium" fullWidth disabled>
                                                Log In
                                            </Button>
                                        }
                                        <div className="hr"></div>
                                        <Button variant="contained" size="medium" fullWidth color="success" onClick={navigateToRegsiter}>
                                               Register
                                        </Button>
                                    </Grid>
                                </form>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
           <Loader loading={loading}/>
            {snackbarStatus && 
                <DirectionSnackbar open={true}  message={message}
                status={snackbarStatus} 
                />
            }
        </>
    );
}
 
export default Login;