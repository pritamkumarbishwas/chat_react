import React from 'react';
import { Avatar, Box, Typography, Tooltip } from '@mui/material';
import { ChatState } from '../../Context/ChatProvider';

const UserListItem = ({ handleFunction }) => {
  const { user } = ChatState();

  return (
    <Box
      onClick={handleFunction}
      sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#E8E8E8',
        cursor: 'pointer',
        borderRadius: '8px',
        padding: '8px',
        marginBottom: '8px',
        '&:hover': {
          backgroundColor: '#38B2AC',
          color: 'white',
        },
      }}
    >
      <Tooltip title={user.name}>
        <Avatar
          sx={{ marginRight: '8px' }}
          src={user.pic}
          alt={user.name}
        />
      </Tooltip>
      <Box>
        <Typography variant="body1" color="textPrimary">
          {user.name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <b>Email: </b>{user.email}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserListItem;
