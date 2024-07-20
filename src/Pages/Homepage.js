import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';  // Updated import
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';
import TabPanel from '../components/TabPanel'; 

function Homepage() {
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();  // Updated hook

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));

    if (user) navigate('/chats');  // Updated method
  }, [navigate]);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Chat Application
        </Typography>
      </Paper>
      <Box sx={{ marginTop: 4 }}>
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          variant="fullWidth"
          centered
        >
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>
        <Box sx={{ padding: 2 }}>
          <TabPanel value={tabIndex} index={0}>
            <Login />
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <Signup />
          </TabPanel>
        </Box>
      </Box>
    </Container>
  );
}

export default Homepage;
