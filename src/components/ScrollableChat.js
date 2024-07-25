import React from 'react';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ScrollableFeed from 'react-scrollable-feed';
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from '../config/ChatLogics';
import { useChat } from '../Context/ChatProvider';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const ScrollableChat = ({ messages, onEditClick, onDeleteClick }) => {
  const { user } = useChat();
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async (messageId) => {
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.delete(`/api/message/${messageId}`, config);
      enqueueSnackbar('Message deleted successfully', { variant: 'success' });

      // Remove message from state
      onDeleteClick(messageId);
    } catch (error) {
      enqueueSnackbar('Error occurred! Failed to delete the message.', { variant: 'error' });
    }
  };

  return (
    <ScrollableFeed>
      {messages && messages.length > 0 ? (
        messages.map((m, i) => (
          <div style={{ display: 'flex', alignItems: 'center' }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
                <Tooltip title={m.sender.name} placement="bottom-start" arrow>
                  <Avatar
                    style={{ marginTop: '7px', marginRight: '4px' }}
                    alt={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              )}
            <span
              style={{
                backgroundColor: `${m.sender._id === user._id ? '#BEE3F8' : '#B9F5D0'}`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: '20px',
                padding: '5px 15px',
                maxWidth: '75%',
              }}
            >
              {m.content}
            </span>
            {m.sender._id === user._id && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <IconButton size="small" onClick={() => onEditClick(m)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(m._id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            )}
          </div>
        ))
      ) : (
        <div>No messages</div>
      )}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
