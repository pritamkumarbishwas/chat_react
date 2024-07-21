import React, { useState } from 'react';
import {
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  Stack,
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useChat } from '../../Context/ChatProvider'; // Corrected import

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');

  const navigate = useNavigate();
  const { setUser } = useChat(); // Corrected hook usage

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      setSnackbarMessage('Please fill all the fields');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/user/login', // Ensure this endpoint is correct
        { email, password },
        config
      );

      setSnackbarMessage('Login Successful');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      navigate('/chats');
    } catch (error) {
      console.log("error", error);
      setSnackbarMessage('Error occurred: ' + (error.response?.data?.message || 'Unknown error'));
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: 400, margin: 'auto' }}>
      <Box>
        <Typography variant="h5" component="div">
          Login
        </Typography>
      </Box>
      <TextField
        label="Email Address"
        variant="outlined"
        fullWidth
        required
        value={email}
        type="email"
        placeholder="Enter Your Email Address"
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        required
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter password"
        value={password}
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
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={submitHandler}
        disabled={loading}
      >
        {loading ? 'Logging In...' : 'Login'}
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        onClick={() => {
          setEmail('guest@example.com');
          setPassword('123456');
        }}
      >
        Get Guest User Credentials
      </Button>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default Login;
