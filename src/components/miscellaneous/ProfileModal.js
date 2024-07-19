import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  IconButton,
  Typography,
  Avatar,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useState } from "react";

const ProfileModal = ({ user, children }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {children ? (
        <span onClick={handleOpen}>{children}</span>
      ) : (
        <IconButton onClick={handleOpen}>
          <Visibility />
        </IconButton>
      )}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ textAlign: "center", fontSize: "40px", fontFamily: "Work Sans" }}>
          {user.name}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", height: "410px" }}>
          <Avatar
            src={user.pic}
            alt={user.name}
            sx={{ width: 150, height: 150, borderRadius: "50%" }}
          />
          <Typography sx={{ fontSize: { xs: "28px", md: "30px" }, fontFamily: "Work Sans" }}>
            Email: {user.email}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfileModal;
