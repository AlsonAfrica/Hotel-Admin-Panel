import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Button, CardMedia, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../Config/firebaseconfig";
import AddRoomForm from "./addRoomForm";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null); // For editing
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog state

  // Fetch rooms from Firestore
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "rooms"));
        const roomsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRooms(roomsData);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };

    fetchRooms();
  }, []);

  // Delete a room from Firestore
  const handleDelete = async (roomId) => {
    try {
      await deleteDoc(doc(db, "rooms", roomId));
      setRooms(rooms.filter(room => room.id !== roomId)); // Remove from UI
      alert('Room deleted successfully');
    } catch (err) {
      console.error("Error deleting room:", err);
      alert('Error deleting room. Please try again.');
    }
  };

  // Open the dialog and set selected room for editing
  const handleEdit = (room) => {
    setSelectedRoom(room);
    setIsDialogOpen(true); // Open dialog
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedRoom(null); // Reset selected room when closing dialog
  };

  // Update room data in Firestore
  const updateRoomInFirestore = async (roomId, updatedData) => {
    try {
      const roomRef = doc(db, "rooms", roomId);
      await updateDoc(roomRef, updatedData);
      // Update local state
      setRooms(rooms.map(room => (room.id === roomId ? { ...room, ...updatedData } : room)));
      handleCloseDialog();
    } catch (err) {
      console.error("Error updating room:", err);
      alert('Error updating room. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)', // 5 columns
        gap: '16px',
        padding: '16px',
      }}
    >
      {rooms.map(room => (
        <Card key={room.id} sx={{ boxShadow: '0 3px 5px rgba(0,0,0,0.2)', height: '100%' }}>
          {room.image && (
            <CardMedia
              component="img"
              height="140"
              image={room.image}
              alt={`${room.roomType} image`}
            />
          )}
          <CardContent>
            <Typography variant="h6" gutterBottom>{room.roomType}</Typography>
            <Typography variant="body2" color="textSecondary">Amenities: {room.amenities.join(", ")}</Typography>
            <Typography variant="body2" color="textSecondary">Capacity: {room.capacity}</Typography>
            <Typography variant="body2" color="textSecondary">Price: ${room.price}</Typography>
            <Typography variant="body2" color="textSecondary">Availability: {room.availability ? 'Available' : 'Not Available'}</Typography>
            
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => handleEdit(room)} 
              sx={{ marginTop: '10px', marginRight: '10px' }}
            >
              Edit
            </Button>
            
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={() => handleDelete(room.id)} 
              sx={{ marginTop: '10px' }}
            >
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
      
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{selectedRoom ? 'Edit Room' : 'Add Room'}</DialogTitle>
        <DialogContent>
          <AddRoomForm 
            editRoomData={selectedRoom}
            onAddRoom={(room) => setRooms([...rooms, room])}
            onEditRoom={updateRoomInFirestore}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Rooms;
