import React from 'react';
import { Box } from '@mui/material';

function TabPanel(props) {
  const { value, index, children } = props;

  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box sx={{ padding: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default TabPanel;
