import React, { useState } from 'react';
import {
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Typography,
  Box,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../Context/ChatProvider'; // Corrected import

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [pic, setPic] = useState('');
  const [picLoading, setPicLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useChat(); // Corrected hook usage

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      alert('Please fill all the fields');
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      alert('Passwords do not match');
      setPicLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      const { data } = await axios.post(
        '/api/user',
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      alert('Registration successful');
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setPicLoading(false);
      navigate('/chats');
    } catch (error) {
      alert('Error occurred: ' + (error.response?.data?.message || 'Unknown error'));
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      alert('Please select an image!');
      setPicLoading(false);
      return;
    }
    if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
      const data = new FormData();
      data.append('file', pics);
      data.append('upload_preset', 'chat-app');
      data.append('cloud_name', 'piyushproj');
      fetch('https://api.cloudinary.com/v1_1/piyushproj/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      alert('Please select an image!');
      setPicLoading(false);
    }
  };

  return (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 400, margin: 'auto' }}>
      <Box>
        <Typography variant="h5" component="div">
          Sign Up
        </Typography>
      </Box>
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        required
        placeholder="Enter your name"
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Email Address"
        variant="outlined"
        fullWidth
        required
        type="email"
        placeholder="Enter your email address"
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        required
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter password"
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="Confirm Password"
        variant="outlined"
        fullWidth
        required
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder="Confirm password"
        onChange={(e) => setConfirmpassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle confirm password visibility"
                onClick={handleClickShowConfirmPassword}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        variant="contained"
        color="primary"
        component="label"
        fullWidth
        disabled={picLoading}
      >
        {picLoading ? 'Uploading...' : 'Upload Your Picture'}
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </Button>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={submitHandler}
        disabled={picLoading}
      >
        Sign Up
      </Button>
    </Stack>
  );
};

export default Signup;
