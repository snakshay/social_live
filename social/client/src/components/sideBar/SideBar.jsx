import axios from 'axios';
import { useContext, useState } from 'react';
import { userContext } from './../../userContext';
import { useNavigate } from 'react-router-dom';

import SimpleDialog from './../dialog/Dialog';
import GroupsIcon from '@mui/icons-material/Groups';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';

import { Container, Grid } from "@mui/material";
import Avatar from '@mui/material/Avatar';

const SideBar = () => {
    const { user } = useContext(userContext);
    const [open, setOpen] = useState(false);
    const [isFollower, setIsFollower] = useState();
    const [dialogList, setDialogList] = useState();
    const navigate = useNavigate();

    const handleClickOpen = (isFollowerModal, id) => {
        setOpen(true);
        setIsFollower(isFollowerModal);
        if (isFollowerModal === "Followers") {
            axios.get(`${process.env.REACT_APP_BASEURL}/users/${id}/findFollowers`)
                .then(res => { setDialogList(res.data); });
        }
        else if (isFollowerModal === "Following") {
            axios.get(`${process.env.REACT_APP_BASEURL}/users/${id}/findFollowing`)
                .then(res => { setDialogList(res.data); });
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        
        <Container >
            <Grid container columns={12}>
                
                <Grid item lg={12} xs={12}>
                    <div className='m-10  vcenter cp' onClick={(e)=>{navigate('/profile')}}>
                        <Avatar src={user.profilePicture} sx={{ height: 30, width: 30 }}></Avatar> 
                        <span className='p-10'>{user.userName}</span>
                    </div>
                </Grid>
                <Grid item lg={12} xs={12}>
                    <div className='m-10 vcenter cp' onClick={(e) => { handleClickOpen('Followers', user._id) }}>
                        <GroupsIcon/> Followers
                    </div>
                </Grid>
                <Grid item lg={12} xs={12}>
                    <div className='m-10 vcenter cp' onClick={(e) => { handleClickOpen('Following', user._id) }}>
                        <PeopleOutlineIcon/> Following
                    </div>
                </Grid>
                <Grid item lg={12} xs={12}>
                    <div className='side-footer'>

                    <div className='m-10 vcenter cp' >
                        <a href="https://www.linkedin.com/in/snakshay">
                            Developed by Akshay Nair
                        </a>
                    </div>
                    <div className='m-10 vcenter cp' >
                        Created using MERN and AWS s3
                    </div>
                    </div>
                </Grid>
            

            </Grid>
            {open &&
                <SimpleDialog
                    open={open}
                    onClose={handleClose}
                    header={isFollower}
                    list={dialogList}
                />
            }
        </Container>
                
    );
}

export default SideBar;