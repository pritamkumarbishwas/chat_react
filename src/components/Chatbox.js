import React from 'react';
import { Box } from '@mui/material';
import SingleChat from './SingleChat';
import { useChat } from '../Context/ChatProvider'; // Updated import

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useChat(); // Updated hook

  return (
    <Box
      display={{ xs: selectedChat ? 'flex' : 'none', md: 'flex' }}
      alignItems="center"
      flexDirection="column"
      p={3}
      bgcolor="white"
      width={{ xs: '100%', md: '68%' }}
      borderRadius="8px"
      border={1}
      borderColor="grey.300"
    >
      {selectedChat ? (
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      ) : (
        <div>Select a chat to start messaging</div>
      )}
    </Box>
  );
};

export default Chatbox;
