import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSnackbar } from 'notistack';
import ProfileModal from './miscellaneous/ProfileModal';
import ScrollableChat from './ScrollableChat';
import Lottie from 'react-lottie';
import animationData from '../animations/typing.json';
import io from 'socket.io-client';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import { useChat } from '../Context/ChatProvider';
import { getSender, getSenderFull } from '../config/ChatLogics';
import axios from 'axios';

const ENDPOINT = "http://localhost:5000"; // Update this after deployment
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);

  const { selectedChat, setSelectedChat, user, notification, setNotification } = useChat();
  const { enqueueSnackbar } = useSnackbar();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);

      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      enqueueSnackbar('Error occurred! Failed to load the messages.', { variant: 'error' });
      setLoading(false);
    }
  };

  const sendMessage = async (event) => {
    if (event.key === 'Enter' && newMessage) {
      if (editingMessage) {
        // Handle edit message
        try {
          const config = {
            headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.put(`/api/message/${editingMessage._id}`, { content: newMessage }, config);
          setMessages((prevMessages) => prevMessages.map((msg) => (msg._id === editingMessage._id ? data : msg)));

          socket.emit('new message', data);
          setEditingMessage(null);
          setNewMessage('');
        } catch (error) {
          enqueueSnackbar('Error occurred! Failed to update the message.', { variant: 'error' });
        }
      } else {
        // Handle new message
        socket.emit('stop typing', selectedChat._id);
        try {
          const config = {
            headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${user.token}`,
            },
          };
          setNewMessage('');
          const { data } = await axios.post('/api/message', { content: newMessage, chatId: selectedChat._id }, config);
          socket.emit('new message', data);
          setMessages((prevMessages) => [...prevMessages, data]);
        } catch (error) {
          enqueueSnackbar('Error occurred! Failed to send the message.', { variant: 'error' });
        }
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
    socket.on('message deleted', (messageId) => {
      setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));
    });


    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [user]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        if (!notification.find((notif) => notif._id === newMessageReceived._id)) {
          setNotification((prevNotifications) => [newMessageReceived, ...prevNotifications]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    });
    // eslint-disable-next-line
  }, [messages, notification, selectedChatCompare]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const handleEditClick = (message) => {
    setEditingMessage(message);
    setNewMessage(message.content);
  };

  const handleDeleteClick = (messageId) => {
    socket.emit('delete message', messageId);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            sx={{
              fontSize: { base: '28px', md: '30px' },
              paddingBottom: 3,
              paddingX: 2,
              width: '100%',
              fontFamily: 'Work sans',
              display: 'flex',
              justifyContent: { base: 'space-between' },
              alignItems: 'center',
            }}
          >
            <IconButton
              sx={{ display: { base: 'flex', md: 'none' } }}
              onClick={() => setSelectedChat(null)}
            >
              <ArrowBackIcon />
            </IconButton>
            {messages && (!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            ))}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 3,
              backgroundColor: '#E8E8E8',
              width: '100%',
              height: '100%',
              borderRadius: 'lg',
              overflowY: 'hidden',
            }}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ alignSelf: 'center', margin: 'auto' }} />
            ) : (
              <ScrollableChat messages={messages} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
            )}

            <Box
              component="form"
              onKeyDown={sendMessage}
              sx={{ display: 'flex', flexDirection: 'column', marginTop: 3 }}
            >
              {isTyping && (
                <Lottie options={defaultOptions} width={70} style={{ marginBottom: 15 }} />
              )}
              <TextField
                variant="filled"
                sx={{ backgroundColor: '#E0E0E0' }}
                placeholder="Enter a message..."
                value={newMessage}
                onChange={typingHandler}
                required
              />
            </Box>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <Typography variant="h3" paddingBottom={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Typography>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
