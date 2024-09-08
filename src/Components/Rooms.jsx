import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Button, CardMedia } from "@mui/material";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../Config/firebaseconfig";
import AddRoomForm from "./AddRoomForm";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null); // For editing

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

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '16px',
        padding: '16px'
      }}
    >
      {rooms.map(room => (
        <Card key={room.id} sx={{ width: '300px', margin: '16px', boxShadow: '0 3px 5px rgba(0,0,0,0.2)' }}>
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
              onClick={() => setSelectedRoom(room)} 
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

      {/* Add/Edit Room Form */}
      {/* {selectedRoom && (
        <AddRoomForm roomData={selectedRoom} setSelectedRoom={setSelectedRoom} />
      )} */}
    </Box>
  );
};

export default Rooms;

