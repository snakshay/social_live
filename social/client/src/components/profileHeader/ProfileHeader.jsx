import axios from 'axios';
import { useState } from 'react';

import SimpleDialog from './../dialog/Dialog';

import './profileHeader.css';
import { Container, Button } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';


const ProfileHeader = (props) => {
    const [open, setOpen] = useState(false);
    const [isFollower,setIsFollower] = useState();
    const [dialogList, setDialogList] = useState();
  
    const handleClickOpen = (isFollowerModal,id) => {
      setOpen(true);
      setIsFollower(isFollowerModal);
      if(isFollowerModal==="Followers"){
          axios.get(`${process.env.REACT_APP_BASEURL}/users/${id}/findFollowers`)
              .then(res=>{setDialogList(res.data);});
      }
      else if(isFollowerModal==="Following"){
          axios.get(`${process.env.REACT_APP_BASEURL}/users/${id}/findFollowing`)
              .then(res=>{setDialogList(res.data);});
      }
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    return ( 
        <>
            {
                props.user?
                    <div>
                        <Container >
                            {props.user.coverPicture?
                            <>
                                {props.selfView?
                                        <Button 
                                        variant="contained" 
                                        onClick={(e) => { props.editProfile('/editCover')}}
                                        size="small" 
                                        endIcon={<EditRoundedIcon fontSize="large"  />} 
                                        className="editIcon"/>
                                    :<></>
                                }
                                <img src={props.user.coverPicture} className='coverPicture ' alt="Cover" />
                            </>
                            :<div className='noCover'></div>
                            }
                            <div className='profileContainer'>
                                {
                                    props.user.profilePicture?
                                    <>
                                        {props.selfView?
                                                <Button 
                                                variant="contained" 
                                                onClick={(e) => { props.editProfile('/editProfile') }} 
                                                size="small" endIcon={<EditRoundedIcon fontSize="small" />} 
                                                className="editProfile" />
                                            :<></>
                                        }
                                        <img src={props.user.profilePicture} alt="Profile " className='profileIcon ' />
                                    </>
                                    :
                                    <>
                                        <Button 
                                        variant="contained" 
                                        size="small" 
                                        endIcon={<EditRoundedIcon fontSize="small" />} 
                                        className="editProfile" />
                                        <img src="assets/profile.png" alt="Upload Profile" className='profileIcon' />
                                    </>  
                                }
                                <div className="userDetailsContainer p-10 m-10">
                                    <div className="userDetails ">
                                        <span className='h m-center'>{props.user.userName}</span>
                                        <div className="followFollowing m-center">
                                            {props.showFollow?
                                                <div className="followers p">
                                                    <div className="center">
                                                            {props.postCounts}<br/>
                                                        </div>
                                                    <span className='small-p'>
                                                    Posts
                                                    </span>
                                                </div>
                                                :<></>
                                            }
                                            <div className="followers p">
                                                <div className="center cp" onClick={(e)=>{handleClickOpen('Followers',props.user._id)}}>
                                                        {props.user.followers.length}<br/>
                                                    </div>
                                                <span className='small-p'>
                                                    Followers
                                                </span>
                                            </div>
                                            <div className="followers p">
                                                <div className="center cp" onClick={(e)=>{handleClickOpen('Following',props.user._id)}}>
                                                        {props.user.following.length}<br/>
                                                    </div>
                                                <span className='small-p'>
                                                Following
                                                </span>
                                            </div>
                                        </div>
                                        {/* <div className='m-center'>
                                            {props.user.description}
                                        </div>
                                        <div className='m-center'>
                                            {props.user.city}
                                        </div>
                                        <div className='m-center'>
                                            {props.user.from}
                                        </div>
                                        <div className='m-center'>
                                            {relationShipMap[props.user.relationship]}
                                        </div> */}
                                    </div>
                                </div>
                                {props.showButton ?
                                    <div className='followUser p-10 m-10'>
                                        {props.showFollow?
                                            <Button variant="outlined" onClick={(e)=>  props.handleUnfollow()}>Following</Button>
                                            :
                                            <Button variant="contained" onClick={(e)=> props.handleFollow()}>Follow</Button>
                                        }
                                        </div>
                                    :<></>
                                }
                            </div>
                        </Container>
                        {open?
                            <SimpleDialog
                                open={open}
                                onClose={handleClose}
                                header={isFollower}
                                list={dialogList}
                            />:<></>
                            }
                    </div>
                :
                    <>
                    </>
            }
        </>
     );
}
 
export default ProfileHeader;
