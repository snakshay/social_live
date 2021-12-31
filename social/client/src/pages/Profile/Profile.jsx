import axios from 'axios';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { userContext } from './../../userContext';
import { searchUserContext } from './../../searchUser';
import TopBar from './../../components/topbar/Topbar';
import ProfileHeader from '../../components/profileHeader/ProfileHeader';
import Loader from './../../components/loader/Loader';
import Post from '../../components/post/Post';
import CreatePost from '../../components/createPost/CreatePost';
import Intro from '../../components/intro/Intro';

import {  Container, Grid } from '@mui/material';

const Profile = (props) => {
    const {user, setUser} = useContext(userContext);
    const {searchUser, setSearchUser} = useContext(searchUserContext);
    const [posts, setPosts] = useState ([]);
    const [loading, setLoading] = useState(true);
    const [followButton,setFollowButton] = useState(false);
    const navigate = useNavigate();
    useEffect(()=>{
        if(user && user._id){
            if(searchUser && searchUser.followers.includes(user._id)){
                setFollowButton(true);
            }
            else{
                setFollowButton(false)
            }
        }
    },[user,searchUser]);

    useEffect(()=>{
            let obj ={ userId:""};
            if(user && user.selfView && user._id){
                obj.userId =user._id; //see self profile
            } else if(searchUser && searchUser._id) {
                obj.userId = searchUser._id;
            }
            if(followButton ||(user && user.selfView)){

                axios.post(`${process.env.REACT_APP_BASEURL}/posts/getPostByUserId`,obj)
                .then(res=>{
                    setPosts(res.data);
                    setLoading(false);
                })
                .catch(err=>console.log(err));
            }
            else{
                setLoading(false)
            }
    },[user,followButton,searchUser]);

    const handleFollow = () =>{
        let searchUserCopy ={...searchUser};
        searchUserCopy.followers.push(user._id);
        setSearchUser(searchUserCopy);
        axios.put(`${process.env.REACT_APP_BASEURL}/users/${searchUser._id}/follow`,{userId:user._id});

        let userCopy ={...user};
        userCopy.following.push(searchUser._id);
        setUser(userCopy);

    }

    const handleUnfollow = () =>{
        let searchUserCopy ={...searchUser};
        searchUserCopy.followers = searchUserCopy.followers.filter(item => item !== user._id);
        setSearchUser(searchUserCopy);
        axios.put(`${process.env.REACT_APP_BASEURL}/users/${searchUser._id}/unfollow`,{userId:user._id});

        let userCopy ={...user};
        userCopy.following = userCopy.following.filter(item => item !== searchUser._id);
        setUser(userCopy);
    }

    const editProfile = (path) =>{
        navigate(path);
    }

    return ( 
        <>
            <TopBar></TopBar>
            {
                user?
                    <div className='darkBackground'>
                        {user.selfView?
                            <>
                                <ProfileHeader
                                 user={user}
                                 showButton={false}
                                 showFollow={false}
                                 postCounts={posts.length}
                                 selfView={user.selfView}
                                 editProfile={editProfile}/>
                                 <Container >
                                    <Grid container spacing={2} columns={12}>
                            
                                        <Grid item lg={6} xs={12}  >
                                            <div className="darkBackground2 br-20 p-10">
                                                <Intro user={user} selfView={true} editProfile={editProfile}/>
                                            </div>
                                        </Grid>
                                        <Grid item lg={6} xs={12} >
                                            <div className="darkBackground2 br-20 p-10">
                                                <CreatePost/>
                                                {posts.length===0?
                                                    <div className='p-10 center pt-100'>
                                                        Your Post will appear here
                                                    </div>:
                                                    <>
                                                        {posts.map((e,index)=>{return<Post key={index} post = {e} loggedInUser={user._id} loggedInUserName={user.userName}/>})}
                                                    </>
                                                }
                                            </div>
                                        </Grid>
                                    </Grid>
                                 </Container>
                            </>
                        :
                            <>
                                <ProfileHeader 
                                user={searchUser}
                                postCounts={posts.length}
                                showButton={true}
                                showFollow={followButton}
                                handleFollow={handleFollow}
                                handleUnfollow={handleUnfollow}
                                selfView={user.selfView}/>
                                <>
                                    {
                                        followButton?
                                            <Container>
                                                <Grid container spacing={2} columns={12}>
                                                    <Grid item lg={6} xs={12} >
                                                        <div className="darkBackground2 br-20 p-10">
                                                            <Intro user={searchUser} selfView={false} />
                                                        </div>
                                                    </Grid>
                                                    <Grid item lg={6} xs={12} >
                                                        {posts.length===0?
                                                            <div className='center darkBackground2 br-20 p-10  pt-100'>
                                                            No Post Yet
                                                            </div>
                                                        :
                                                            <>
                                                            {posts.map((e,index)=>{return<Post key={index} post = {e} loggedInUser={user._id} loggedInUserName={user.userName}/>})}
                                                            </>
                                                        }
                                                    </Grid>
                                                </Grid>
                                            </Container>
                                        :<Container>
                                            <Grid item lg={12} xs={12} >
                                                <div className="darkBackground2 br-20 p-10">
                                                    <Intro user={searchUser} selfView={false} />
                                                </div>
                                            </Grid>
                                        </Container>
                                    }
                                </>
                            </> 
                        }
                    </div>
                :
                    <>
                    </>
            }
            <Loader loading={loading}/>
        </>
     );
}
 
export default Profile;
