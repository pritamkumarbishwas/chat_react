import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  InputBase,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Avatar,
  Drawer,
  List,
  Box,
  Tooltip,
  Typography,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import ChatLoading from "../ChatLoading";
import ProfileModal from "./ProfileModal";
import UserListItem from "../userAvatar/UserListItem";
import { useChat } from "../../Context/ChatProvider"; // Assuming useChat is properly defined
import { getSender } from "../../config/ChatLogics";
import NotificationsIcon from '@mui/icons-material/Notifications';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [notificationMenuAnchor, setNotificationMenuAnchor] = useState(null);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = useChat();

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      enqueueSnackbar("Please enter something in the search", { variant: "warning" });
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
      setSearchResult(data);
    } catch (error) {
      enqueueSnackbar("Failed to load the search results", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setDrawerOpen(false);
    } catch (error) {
      enqueueSnackbar("Error fetching the chat", { variant: "error" });
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Tooltip title="Search Users to chat">
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <SearchIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Talk-A-Tive
          </Typography>
          <IconButton color="inherit" onClick={(e) => setNotificationMenuAnchor(e.currentTarget)}>
            <Badge badgeContent={notification.length} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={notificationMenuAnchor}
            open={Boolean(notificationMenuAnchor)}
            onClose={() => setNotificationMenuAnchor(null)}
          >
            {!notification.length ? <MenuItem>No New Messages</MenuItem> : null}
            {notification.map((notif) => (
              <MenuItem
                key={notif._id}
                onClick={() => {
                  setSelectedChat(notif.chat);
                  setNotification(notification.filter((n) => n !== notif));
                  setNotificationMenuAnchor(null);
                }}
              >
                {notif.chat.isGroupChat
                  ? `New Message in ${notif.chat.chatName}`
                  : `New Message from ${getSender(user, notif.chat.users)}`}
              </MenuItem>
            ))}
          </Menu>
          <IconButton
            color="inherit"
            onClick={(e) => setProfileMenuAnchor(e.currentTarget)}
            edge="end"
          >
            <Avatar src={user.pic} alt={user.name} />
            <KeyboardArrowDownIcon />
          </IconButton>
          <Menu
            anchorEl={profileMenuAnchor}
            open={Boolean(profileMenuAnchor)}
            onClose={() => setProfileMenuAnchor(null)}
          >
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <Divider />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <Box sx={{ p: 2, display: 'flex' }}>
            <InputBase
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ ml: 1, flex: 1 }}
            />
            <Button onClick={handleSearch} variant="contained">Go</Button>
          </Box>
          {loading ? (
            <ChatLoading />
          ) : (
            <List>
              {searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))}
            </List>
          )}
          {loadingChat && <ChatLoading />}
        </Box>
      </Drawer>
    </>
  );
};

export default SideDrawer;
