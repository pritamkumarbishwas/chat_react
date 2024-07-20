import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { useChat } from '../Context/ChatProvider'; // Updated import
import Chatbox from '../components/Chatbox';
import MyChats from '../components/MyChats';
import SideDrawer from '../components/miscellaneous/SideDrawer';

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = useChat(); // Updated hook

  return (
    <div style={{ width: '100%' }}>
      {user && <SideDrawer />}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          height: '91.5vh',
          padding: '10px',
        }}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
};

export default Chatpage;
