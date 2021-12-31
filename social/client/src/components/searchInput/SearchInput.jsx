import axios from 'axios'
import { useState, useEffect, useContext} from 'react';
import { userContext } from './../../userContext';
import { useNavigate } from 'react-router-dom';

import { searchUserContext } from '../../searchUser';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { Avatar } from '@mui/material';

const SearchInput = () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const {user,setUser} = useContext(userContext);
  const {setSearchUser} = useContext(searchUserContext);
  const navigate = useNavigate()
  const loading = open && options.length === 0;

  useEffect(() => {
    if (!loading) {
      return undefined;
    }
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const onChangeHandle = async value => {
    if(value && value!==""){
        const response = await axios.get(
            `${process.env.REACT_APP_BASEURL}/users/finduser/${value}`
        );
        setOptions(response.data);
        setOpen(true)
        if(response.data.length===0) setOpen(false);
    }
  };

  const userSelected = (search)=>{
    const userCopy={...user}
    if (user._id !== search._id){
      userCopy.selfView = false;
    } else userCopy.selfView = true;
    setSearchUser(search);
    setUser(userCopy);
    navigate('/profile');
    setOpen(false);
  }

  return (
    <Autocomplete
      id="asynchronous-demo"
      noOptionsText={'Your Customized No Options Text'}
      sx={{ width: 300 }}
      open={open}
      freeSolo
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.userName === value._id}
      getOptionLabel={(option) => option.userName}
      options={options}
      loading={loading}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option._id} onClick={(e)=>{userSelected(option)}}>
              <Avatar src={option.profilePicture} alt={option.userName}  sx={{ width: 30, height: 30 }} /> 
            {option.userName}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search People"
          onChange={ev => {
            if (ev.target.value !== "" || ev.target.value !== null) {
              onChangeHandle(ev.target.value);
            }
          }}
          InputLabelProps={{
            style: { color: 'white' },
          }}
          InputProps={{
            ...params.InputProps,
            style: { color: 'white' },
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}


export default SearchInput;