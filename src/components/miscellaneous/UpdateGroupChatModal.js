import { useState } from "react";
import axios from "axios";
import { useChat } from "../../Context/ChatProvider"; // Use useChat instead of ChatState
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  Box,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Visibility as ViewIcon } from "@mui/icons-material";
import { useSnackbar } from "notistack";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { selectedChat, setSelectedChat, user } = useChat(); // Use useChat hook

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      enqueueSnackbar("Failed to Load the Search Results", { variant: "error" });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      enqueueSnackbar("User Already in group!", { variant: "error" });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      enqueueSnackbar("Only admins can add someone!", { variant: "error" });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      enqueueSnackbar("Only admins can remove someone!", { variant: "error" });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat(null) : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <ViewIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{selectedChat.chatName}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexWrap="wrap" pb={3}>
            {selectedChat.users.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                admin={selectedChat.groupAdmin}
                handleFunction={() => handleRemove(u)}
              />
            ))}
          </Box>
          <Box display="flex" mb={3}>
            <TextField
              fullWidth
              placeholder="Chat Name"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleRename}
              disabled={renameloading}
              sx={{ ml: 1 }}
            >
              {renameloading ? <CircularProgress size={24} /> : "Update"}
            </Button>
          </Box>
          <TextField
            fullWidth
            placeholder="Add User to group"
            onChange={(e) => handleSearch(e.target.value)}
            mb={1}
          />
          {loading ? (
            <CircularProgress />
          ) : (
            searchResult.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => handleAddUser(user)}
              />
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleRemove(user)} color="secondary">
            Leave Group
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateGroupChatModal;
