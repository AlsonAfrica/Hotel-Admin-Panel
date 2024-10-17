import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import ImageIcon from "@mui/icons-material/Image";  // Gallery Icon
import Dashboard from "../Components/Dashboard";
import Users from "../Components/Users";
import Settings from "../Components/Settings";
import Rooms from "../Components/Rooms";
import AddRoomForm from "../Components/AddRoomForm";
import { db } from "../Config/firebaseconfig";
import { collection, doc, updateDoc, deleteDoc } from "firebase/firestore";
import Gallery from "../Components/Gallary";
import Facilities from "../Components/Facilities";
import { useNavigate } from "react-router-dom";
import AddGalleryForm from "../Components/addGalleryForm";
import AddFacilitiesForm from "../Components/addFacilityForm";
import BookIcon from '@mui/icons-material/Book';
import { Book } from "@mui/icons-material";


const drawerWidth = 260; // Slightly wider for better layout

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [anchorEl, setAnchorEl] = useState(null); // State for dropdown menu
  const [openDialog, setOpenDialog] = useState(false); // State for dialog
  const [roomList, setRoomList] = useState([]); // State to store rooms
  const [editRoomData, setEditRoomData] = useState(null); // State to store room data to be edited
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [openFacilityDialog, setOpenFacilityDialog]=useState(false);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleOpenImageDialog = ()=> setOpenImageDialog(true);
  const handleCloseImageDialog = ()=> setOpenImageDialog(false);
  const handleOpenFacilityDialog = ()=> setOpenFacilityDialog(true);
  const handleCloseFacilityDialog = ()=> setOpenFacilityDialog(false);
 
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditRoomData(null);
  };
  const handleAddRoom = (newRoom) => {
    setRoomList((prevList) => [...prevList, newRoom]);
    handleCloseDialog();
    handleClose();
  };
  const handleEditRoom = async (roomId, updatedRoom) => {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, updatedRoom);
    setRoomList((prevList) =>
      prevList.map((room) => (room.id === roomId ? { ...room, ...updatedRoom } : room))
    );
  };
  const navigate = useNavigate();
  
  const handleLogout = ()=>{  
    navigate('/');
  };

  const handleDeleteRoom = async (roomId) => {
    const roomRef = doc(db, "rooms", roomId);
    await deleteDoc(roomRef);
    setRoomList((prevList) => prevList.filter((room) => room.id !== roomId));
  };
  const openEditForm = (room) => {
    setEditRoomData(room);
    setOpenDialog(true);
  };

  const [anchorElGallery, setAnchorElGallery] = useState(null); // State for Gallery dropdown menu
  const [anchorElFacility,setAnchorElFacility] = useState(null);

  // Handle opening and closing Gallery menu
  const handleClickGallery = (event) => setAnchorElGallery(event.currentTarget);
  const handleCloseGallery = () => setAnchorElGallery(null);
  
  const handleClickFacility = (event) => setAnchorElFacility(event.currentTarget);
  const handleCloseFacility = () => setAnchorElFacility(null);
  
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "Logout":
          handleLogout(); // Call the logout function when this case is encountered
          return null; // Optionally return null since you're redirecting
      case "users":  
        return <Users />;
      case "Facilities":
        return <Facilities/>;
      case "Gallery":
        return <Gallery/>;
      case "Bookings":
        return <Book/>;
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
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#2196F3",
            color: "#FFF",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
            Admin Panel
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          <ListItem button onClick={() => setActiveTab("dashboard")}>
            <ListItemIcon>
              <DashboardIcon sx={{ color: "#FFF" }} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>

          {/* Gallery Button with Dropdown */}
          <ListItem button onClick={handleClickGallery}>
            <ListItemIcon>
              <ImageIcon sx={{ color: "#FFF" }} />
            </ListItemIcon>
            <ListItemText primary="Gallery" />
          </ListItem>

          <ListItem button onClick={handleClickFacility}>
            <ListItemIcon>
              <DashboardIcon sx={{ color: "#FFF" }} />
            </ListItemIcon>
            <ListItemText primary="Facilities" />
          </ListItem>
          <ListItem button onClick={() => setActiveTab("users")}>
            <ListItemIcon>
              <PeopleIcon sx={{ color: "#FFF" }} />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem button onClick={handleClick}>
            <ListItemIcon>
              <RoomServiceIcon sx={{ color: "#FFF" }} />
            </ListItemIcon>
            <ListItemText primary="Rooms" />
          </ListItem>
          <ListItem button onClick={() => setActiveTab("Bookings")}>
            <ListItemIcon>
              <BookIcon sx={{ color: "#FFF" }} />
            </ListItemIcon>
            <ListItemText primary="Bookings" />
          </ListItem>
          <ListItem button onClick={() => handleLogout()}>
            <ListItemIcon>
              <LogoutIcon sx={{ color: "#FFF" }} />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Dropdown for Gallery */}
      <Menu anchorEl={anchorElGallery} open={Boolean(anchorElGallery)} onClose={handleCloseGallery}>
        <MenuItem onClick={() => setActiveTab("Gallery")}>View Gallery</MenuItem>
        <MenuItem onClick={handleOpenImageDialog}>Add Image</MenuItem>
      </Menu>
      
      {/* Dropdown for Facilities */}
      <Menu anchorEl={anchorElFacility} open={Boolean(anchorElFacility)} onClose={handleCloseFacility}>
        <MenuItem onClick={() => setActiveTab("Facilities")}>View Facilities</MenuItem>
        <MenuItem onClick={handleOpenFacilityDialog}>Add Facilities</MenuItem>
      </Menu>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => setActiveTab("Rooms")}>View Rooms</MenuItem>
        <MenuItem onClick={handleOpenDialog}>Add Room</MenuItem>
      </Menu>
      
      {/* Rooms Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>{editRoomData ? "Edit Room" : "Add New Room"}</DialogTitle>
        <DialogContent>
          <AddRoomForm
            onAddRoom={handleAddRoom}
            editRoomData={editRoomData}
            onEditRoom={handleEditRoom}
          />
        </DialogContent>
      </Dialog>

      {/* Gallery Dialog */}
      <Dialog open={openImageDialog} onClose={handleCloseImageDialog} fullWidth maxWidth="md">
          <DialogContent>
            <AddGalleryForm  onAddImage={(data) => console.log("Image added:", data)}/> {/* Form component for adding image */}
          </DialogContent>
      </Dialog>
      
      {/* Gallary Dialog */}
      <Dialog open={openFacilityDialog} onClose={handleCloseFacilityDialog} fullWidth maxWidth="md">
          <DialogContent>
            <AddFacilitiesForm onAddImage={(data) => console.log("Image added:", data)}/>
          </DialogContent>
      </Dialog>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}>
        <Toolbar />
        <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </Typography>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdminPanel;
