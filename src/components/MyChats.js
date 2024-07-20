import React, { useEffect, useState } from 'react';
import { Add as AddIcon } from '@mui/icons-material';
import { Box, Stack, Typography, Button } from '@mui/material';
import axios from 'axios';
import { getSender } from '../config/ChatLogics';
import ChatLoading from './ChatLoading';
import GroupChatModal from './miscellaneous/GroupChatModal';
import { useChat } from '../Context/ChatProvider'; // Updated import
import { useSnackbar } from 'notistack';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = useChat(); // Updated hook

  const { enqueueSnackbar } = useSnackbar();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get('/api/chat', config);
      setChats(data);
    } catch (error) {
      enqueueSnackbar('Failed to load the chats', { variant: 'error' });
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    setLoggedUser(userInfo);
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      display={{ xs: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDirection="column"
      alignItems="center"
      padding={3}
      bgcolor="white"
      width={{ xs: '100%', md: '31%' }}
      borderRadius="lg"
      border={1}
      borderColor="grey.300"
    >
      <Box
        paddingBottom={3}
        paddingX={3}
        fontSize={{ xs: 28, md: 30 }}
        fontFamily="Work sans"
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ xs: 17, md: 10, lg: 17 }}
            endIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        padding={3}
        bgcolor="#F8F8F8"
        width="100%"
        height="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bgcolor={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                color={selectedChat === chat ? 'white' : 'black'}
                paddingX={3}
                paddingY={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Typography variant="body1">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Typography>
                {chat.latestMessage && (
                  <Typography variant="body2" fontSize="small">
                    <b>{chat.latestMessage.sender.name}:</b>{' '}
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + '...'
                      : chat.latestMessage.content}
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
