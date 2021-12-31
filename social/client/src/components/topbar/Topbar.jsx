import * as React from 'react';
import axios from 'axios';
import { useContext, useState } from 'react';
import { userContext } from './../../userContext';
import { useNavigate } from 'react-router-dom';

import SearchInput from './../searchInput/SearchInput';
import { searchUserContext } from './../../searchUser';
import SimpleDialog from './../dialog/Dialog';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Avatar, Tooltip } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import GroupsIcon from '@mui/icons-material/Groups';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import FeedIcon from '@mui/icons-material/Feed';


const TopBar = () => {
  const { user, setUser } = useContext(userContext);
  const { setSearchUser } = useContext(searchUserContext);
  const [open, setOpen] = useState(false);
  const [isFollower, setIsFollower] = useState();
  const [dialogList, setDialogList] = useState();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

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

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List className='cp'>
        <div className ='m-10 vcenter' onClick={(e) => { navigate('/home') }}>
         
            <FeedIcon/>Social
        
        </div>
      </List>
      <List className='cp'>
        <div className='m-10 vcenter cp' onClick={(e) => { handleClickOpen('Followers', user._id) }}>
        <GroupsIcon /> Followers
        </div>
      </List>
      <List className='cp'>
        <div className='m-10 vcenter cp' onClick={(e) => { handleClickOpen('Following', user._id) }}>
          <PeopleOutlineIcon /> Following
        </div>
      </List>
       
        
      <Divider  />
      <List style={{ position: 'absolute', bottom: 0 }} >
        <List>
          <div className='m-10 vcenter cp ' >
            <a href="https://www.linkedin.com/in/snakshay" className='black'>
              Developed by Akshay Nair
            </a>
          </div>
        </List>
        <div className='m-10 vcenter cp' >
          Created using MERN and AWS s3
        </div>
      </List>
    </Box>
  );
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const logout = () => {
    handleMenuClose();
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  }

  const goToProfile = () => {
    handleMenuClose();
    const obj = user._id;
    const userState = { ...user };
    userState.profileView = obj;
    userState.selfView = true;
    setUser(userState);
    setSearchUser('');
    navigate('/profile');
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={goToProfile}>Profile</MenuItem>
      <MenuItem onClick={logout}>Log Out</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {/* <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem> */}
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          {user ?
            <Tooltip title={user.userName}>
              <Avatar src={user.profilePicture} alt={user.userName} sx={{ width: 30, height: 30 }} className='cp' />
            </Tooltip>
            : <Avatar />}
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <Box sx={{ flexGrow: 1 }} style={{marginBottom: '80px'}}>
        <AppBar position="fixed" style={{ backgroundColor: 'black' }}>
          <Drawer
            anchor={'left'}
            open={state['left']}
            onClose={toggleDrawer('left', false)}
          >
            {list('left')}
          </Drawer>
          <Toolbar >
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2, display: { xs: 'block', sm: 'none' }  }}
              onClick={toggleDrawer('left', true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: 'none', sm: 'block' } }}
              className="cp"
              onClick={(e) => { navigate('/home') }}
            >
              Social
            </Typography>

            <span style={{ marginLeft: '10px' }} />
            <SearchInput />
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {/* <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton> */}
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                {user ?
                  <Tooltip title={user.userName}>
                    <Avatar src={user.profilePicture} alt={user.userName} sx={{ width: 30, height: 30 }} className='cp' />
                  </Tooltip>
                  : <Avatar />}
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
        {open &&
          <SimpleDialog
            open={open}
            onClose={handleClose}
            header={isFollower}
            list={dialogList}
          />
        }
      </Box>
    </>
  );
}


export default TopBar;