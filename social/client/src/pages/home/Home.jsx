import { useEffect, useState } from 'react';
import { useContext } from 'react';
import axios from 'axios';

import { userContext } from './../../userContext';
import TopBar from "../../components/topbar/Topbar";
import Post from '../../components/post/Post';
import Loader from './../../components/loader/Loader';
import CreatePost from '../../components/createPost/CreatePost';
import SideBar from '../../components/sideBar/SideBar';
import Intro from '../../components/intro/Intro';

import './home.css';
import { Container, Grid } from '@mui/material';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

function Home() {
  const { user } = useContext(userContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user._id) {
      axios.post(`${process.env.REACT_APP_BASEURL}/posts/timeline`, { userId: user._id })
        .then(res => {
          setPosts(res.data);
          setLoading(false);
        })
        .catch(err => console.log(err));
    }
  }, [user])

  return (
    <>
      <TopBar></TopBar>
      <div >
        {
          user ?
            <div className='darkBackground'>
              <div className=' py-50'>
                {posts.length === 0 ?
                  <div className='center'>Follow People to see their posts</div> :
                  <>
                    <Container>
                      <Grid container columns={12}>
                        <Grid item lg={2} xs={12} sx={{ display: { xs: 'none', lg: 'block' } }} className='darkBackground2 br-20 sidebar'>
             
                            <SideBar />
    
                        </Grid>
                        <Grid item lg={8} xs={12} >
                          <CreatePost />
                          {posts.map((e, index) => { return <Post post={e} key={index} loggedInUser={user._id} loggedInUserName={user.userName} /> })}
                          <div className='center'>
                            <CheckCircleOutlineRoundedIcon />
                            <div className='p'>
                              All Caught up!
                            </div><br />
                          </div>
                          <div className='center small-p m-10'>
                            Come back later for more posts, or follow more people
                          </div>
                        </Grid>
                        <Grid item lg={2} xs={12} >
                          <div className='darkBackground2 br-20' >
                            <Intro user={user} selfView={true} />
                          </div>
                        </Grid>
                      </Grid>
                    </Container>

                  </>}
              </div>
            </div>
            : <></>
        }
      </div>
      <Loader loading={loading} />
    </>
  );
}

export default Home;