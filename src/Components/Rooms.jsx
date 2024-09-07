import React, { useState } from 'react';
import { Card, CardContent, Typography, CardMedia, CardActions, Button, Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../Config/firebaseconfig'; // Adjust the path as needed

const Rooms = ({ id, image, amenities, roomType, capacity, price, availability }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editedRoom, setEditedRoom] = useState({
    image,
    amenities: amenities.join(', '),
    roomType,
    capacity,
    price,
    availability
  });

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedRoom(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveChanges = async () => {
    const roomRef = doc(db, 'rooms', id);
    try {
      await updateDoc(roomRef, {
        ...editedRoom,
        amenities: editedRoom.amenities.split(',').map(amenity => amenity.trim())
      });
      alert('Room updated successfully');
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating room:', error);
      alert('Failed to update room');
    }
  };

  const handleDelete = async () => {
    const roomRef = doc(db, 'rooms', id);
    try {
      await deleteDoc(roomRef);
      alert('Room deleted successfully');
      // Handle deletion in the parent component
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Failed to delete room');
    }
  };

  return (
    <>
      <Card sx={{ maxWidth: 345, mb: 2 }}>
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt="Room Image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {roomType}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Amenities: {amenities.join(', ')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Capacity: {capacity} persons
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Price: ${price} per night
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Availability: {availability ? 'Available' : 'Not Available'}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleOpenDialog}>Edit</Button>
          <Button size="small" color="error" onClick={handleDelete}>Delete</Button>
        </CardActions>
      </Card>

      {/* Dialog for Editing Room */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Edit Room</DialogTitle>
        <DialogContent>
          <TextField
            label="Image URL"
            variant="outlined"
            fullWidth
            margin="normal"
            name="image"
            value={editedRoom.image}
            onChange={handleEditChange}
          />
          <TextField
            label="Amenities (comma separated)"
            variant="outlined"
            fullWidth
            margin="normal"
            name="amenities"
            value={editedRoom.amenities}
            onChange={handleEditChange}
          />
          <TextField
            label="Room Type"
            variant="outlined"
            fullWidth
            margin="normal"
            name="roomType"
            value={editedRoom.roomType}
            onChange={handleEditChange}
          />
          <TextField
            label="Capacity"
            variant="outlined"
            type="number"
            fullWidth
            margin="normal"
            name="capacity"
            value={editedRoom.capacity}
            onChange={handleEditChange}
          />
          <TextField
            label="Price"
            variant="outlined"
            type="number"
            fullWidth
            margin="normal"
            name="price"
            value={editedRoom.price}
            onChange={handleEditChange}
          />
          <TextField
            label="Availability"
            variant="outlined"
            type="checkbox"
            name="availability"
            checked={editedRoom.availability}
            onChange={handleEditChange}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
            sx={{ mt: 2 }}
          >
            Save Changes
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Rooms;
