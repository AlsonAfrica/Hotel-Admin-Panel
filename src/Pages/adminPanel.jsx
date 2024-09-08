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
import AddRoomForm from "../Components/AddRoomForm";
import { db } from "../Config/firebaseconfig"; // Import firebase config
import { collection, doc, updateDoc, deleteDoc } from "firebase/firestore";

const drawerWidth = 240;

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [anchorEl, setAnchorEl] = useState(null); // State for dropdown menu
  const [openDialog, setOpenDialog] = useState(false); // State for dialog
  const [roomList, setRoomList] = useState([]); // State to store rooms
  const [editRoomData, setEditRoomData] = useState(null); // State to store room data to be edited

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
    setEditRoomData(null); // Clear edit data
  };

  // Function to handle adding a room
  const handleAddRoom = (newRoom) => {
    setRoomList((prevList) => [...prevList, newRoom]);
    handleCloseDialog();
    handleClose();
  };

  // Function to handle editing a room
  const handleEditRoom = async (roomId, updatedRoom) => {
    const roomRef = doc(db, "rooms", roomId); // Get reference to the room document
    await updateDoc(roomRef, updatedRoom); // Update room in the Firebase database
    setRoomList((prevList) =>
      prevList.map((room) => (room.id === roomId ? { ...room, ...updatedRoom } : room))
    );
  };

  // Function to handle deleting a room
  const handleDeleteRoom = async (roomId) => {
    const roomRef = doc(db, "rooms", roomId); // Get reference to the room document
    await deleteDoc(roomRef); // Delete room from the Firebase database
    setRoomList((prevList) => prevList.filter((room) => room.id !== roomId));
  };

  // Function to open the form for editing a room
  const openEditForm = (room) => {
    setEditRoomData(room); // Set the data of the room to be edited
    setOpenDialog(true); // Open dialog for editing
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
              <Rooms
                key={index}
                {...room}
                onEdit={() => openEditForm(room)}
                onDelete={() => handleDeleteRoom(room.id)}
              />
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

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => setActiveTab("Rooms")}>View Rooms</MenuItem>
        <MenuItem onClick={handleOpenDialog}>Add Room</MenuItem>
      </Menu>

      {/* Dialog for Add/Edit Room Form */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{editRoomData ? "Edit Room" : "Add New Room"}</DialogTitle>
        <DialogContent>
          <AddRoomForm
            onAddRoom={handleAddRoom}
            editRoomData={editRoomData}
            onEditRoom={handleEditRoom}
          />
        </DialogContent>
      </Dialog>

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
