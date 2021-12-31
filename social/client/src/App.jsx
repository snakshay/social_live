import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { userContext } from './userContext';
import { searchUserContext } from './searchUser';
import Home from "./pages/home/Home";
import Login from "./pages/login/login";
import Register from './pages/register/Register';
import Loader from './components/loader/Loader';
import Profile from './pages/Profile/Profile';
import GenericStepper from './components/stepper/Stepper';
import UploadProfile from './components/uploadProfile/UploadProfile'
import UploadCover from './components/uploadCover/UploadCover';
import TopBar from './components/topbar/Topbar';
import UserDetails from './components/userDetails/userDetails';

function App() {
  const [user, setUser] = useState(null);
  const [searchUser, setSearchUser] = useState(null);
  const [appLoaded, setAppLoaded] = useState(false);

  useEffect(() => {
    getLoggedInUser();
    console.clear();
  }, []);

  const getLoggedInUser = () => {
    if (localStorage.getItem('userId')) {
      const userId = localStorage.getItem('userId');
      axios.get(`${process.env.REACT_APP_BASEURL}/users/` + userId)
        .then(res => {
          setAppLoaded(true);
          res.data.selfView = true;
          setUser(res.data);
        })
        .catch(err => {
          console.log(err);
          setAppLoaded(true);
          setUser(null)
        })
    }
    else {
      setUser(null);
      setAppLoaded(true);
    }
  }

  return (
    < >
      <Loader loading={!appLoaded} />
      <searchUserContext.Provider value={{ searchUser, setSearchUser }}>
        <userContext.Provider value={{ user, setUser }}>
          {appLoaded ?
            <BrowserRouter>
              <Routes className='darkBackground'>
                <Route path="/" element={<Login />}></Route>
                <Route path='/home' element={<Home />}></Route>
                <Route path='/register' element={<Register />}></Route>
                <Route path='/profile' element={<Profile />}></Route>
                <Route path='/welcome' element={<GenericStepper/>}></Route>
                <Route path='/editProfile' element={<><TopBar/><UploadProfile/></>}></Route>
                <Route path='/editCover' element={<><TopBar /><UploadCover /></>}></Route>
                <Route path='/editIntro' element={<><TopBar /><UserDetails /></>}></Route>
              </Routes>
            </BrowserRouter>
          :<></>
          }
        </userContext.Provider>
        </searchUserContext.Provider>
    </>
  )
}
export default App;
