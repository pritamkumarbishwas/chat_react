import React from 'react';
import { Chip, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Chip
      label={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {user.name}
          {admin === user._id && <span style={{ marginLeft: '4px' }}>(Admin)</span>}
        </div>
      }
      onDelete={handleFunction}
      deleteIcon={<CloseIcon />}
      style={{ margin: '4px', fontSize: '12px' }}
      color="primary"
      variant="outlined"
    />
  );
};

export default UserBadgeItem;
