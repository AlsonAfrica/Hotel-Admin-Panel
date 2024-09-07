import React, { useState } from "react";
import { Box, CssBaseline, Drawer, Toolbar, List, ListItem, ListItemIcon, ListItemText, Typography, Menu, MenuItem, Dialog, DialogTitle, DialogContent } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import RoomServiceIcon from '@mui/icons-material/RoomService';
import LogoutIcon from "@mui/icons-material/Logout";
import Dashboard from "../Components/Dashboard";
import Users from "../Components/Users";
import Settings from "../Components/Settings";
import Rooms from "../Components/Rooms";
import AddRoomForm from "../Components/addRoomForm";

const drawerWidth = 240;

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [anchorEl, setAnchorEl] = useState(null); // State for dropdown menu
  const [openDialog, setOpenDialog] = useState(false); // State for dialog
  const [roomList, setRoomList] = useState([]); // State to store rooms

  // Function to handle opening the dropdown
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to handle closing the dropdown
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Function to handle opening the dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Function to handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Function to handle adding a room
  const handleAddRoom = (newRoom) => {
    setRoomList((prevList) => [...prevList, newRoom]);
    handleCloseDialog();
    handleClose();
  };

  // Function to render the active component based on the state
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "users":
        return <Users />;
      case "settings":
        return <Settings />;
      case "Rooms":
        return (
          <Box>
            {roomList.map((room, index) => (
              <Rooms key={index} {...room} />
            ))}
          </Box>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Admin Panel
          </Typography>
        </Toolbar>
        <List>
          <ListItem button onClick={() => setActiveTab("dashboard")}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => setActiveTab("users")}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem button onClick={handleClick}>
            <ListItemIcon>
              <RoomServiceIcon />
            </ListItemIcon>
            <ListItemText primary="Rooms" />
          </ListItem>
          <ListItem button onClick={() => setActiveTab("settings")}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem button onClick={() => setActiveTab("logout")}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => setActiveTab("Rooms")}>View Rooms</MenuItem>
        <MenuItem onClick={handleOpenDialog}>Add Room</MenuItem>
      </Menu>

      {/* Dialog for Add Room Form */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Add New Room</DialogTitle>
        <DialogContent>
          <AddRoomForm onAddRoom={handleAddRoom} />
        </DialogContent>
      </Dialog>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
        }}
      >
        <Toolbar />
        <Typography variant="h4" component="h1">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </Typography>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdminPanel;
