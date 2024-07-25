import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Avatar,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { Visibility } from "@mui/icons-material";
import axios from "axios";

// Validation functions
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateURL = (url) => /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/.test(url);

const validateProfile = ({ name, email, password, confirmPassword }) => {
  const errors = {};

  if (!name) {
    errors.name = 'Name is required';
  }

  if (!email || !validateEmail(email)) {
    errors.email = 'Invalid email address';
  }


  if (password && password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (password && password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

const ProfileModal = ({ user,  children }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [pic, setPic] = useState(user.pic);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleUpdate = async () => {
    setLoading(true);

    // Validation
    const errors = validateProfile({ name, email, pic, password, confirmPassword });

    if (Object.keys(errors).length > 0) {
      setSnackbarMessage(Object.values(errors).join(', '));
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      setLoading(false);
      console.log("test")
      // return;
    } else {

      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };

        // Prepare the data to be sent
        const updateData = { name, email, pic };
        if (password) {
          updateData.password = password;
        }
        console.log("userId", user._id);
        // Make sure to replace `user._id` with the actual ID of the user
        const { data } = await axios.post(
          `/api/user/${user._id}`,
          updateData,
          config
        );

        setSnackbarMessage('Profile Update Successful');
        setSnackbarSeverity('success');
        // onUpdate(data); // Pass the updated user data to the parent component
        setLoading(false);
        handleClose();
      } catch (error) {
        console.error("Error updating profile:", error);
        setSnackbarMessage('Error occurred: ' + (error.response?.data?.message || 'Unknown error'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setLoading(false);
      }
    }
  };

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
          Edit Profile
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px",
          }}
        >
          <Avatar
            src={pic}
            alt={name}
            sx={{ width: 100, height: 100, borderRadius: "50%", marginBottom: "20px" }}
          />
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ marginBottom: "10px" }}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ marginBottom: "10px" }}
          />

          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: "10px" }}
          />
          <TextField
            label="Confirm Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ marginBottom: "20px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProfileModal;
