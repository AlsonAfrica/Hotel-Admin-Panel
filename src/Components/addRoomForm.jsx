import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db } from '../Config/firebaseconfig'; // Adjust the path as needed

const AddRoomForm = ({ onAddRoom, editRoomData, onEditRoom }) => {
  const [image, setImage] = useState('');
  const [amenities, setAmenities] = useState('');
  const [roomType, setRoomType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [availability, setAvailability] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editRoomData) {
      setImage(editRoomData.image);
      setAmenities(editRoomData.amenities.join(', '));
      setRoomType(editRoomData.roomType);
      setCapacity(editRoomData.capacity);
      setPrice(editRoomData.price);
      setAvailability(editRoomData.availability);
    }
  }, [editRoomData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const roomData = {
        image,
        amenities: amenities.split(',').map(amenity => amenity.trim()),
        roomType,
        capacity: parseInt(capacity),
        price: parseFloat(price),
        availability
      };

      if (editRoomData) {
        // If editing, call the onEditRoom function
        await onEditRoom(editRoomData.id, roomData);
        alert('Room updated successfully');
      } else {
        // If adding, call the onAddRoom function
        await addDoc(collection(db, 'rooms'), roomData);
        onAddRoom(roomData);
        alert('Room added successfully');
      }

      // Reset form after submission
      setImage('');
      setAmenities('');
      setRoomType('');
      setCapacity('');
      setPrice('');
      setAvailability(true);
    } catch (err) {
      setError('Error adding room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6">{editRoomData ? 'Edit Room' : 'Add Room'}</Typography>
      <TextField
        fullWidth
        label="Room Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Amenities (comma separated)"
        value={amenities}
        onChange={(e) => setAmenities(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Room Type"
        value={roomType}
        onChange={(e) => setRoomType(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Capacity"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        margin="normal"
        type="number"
      />
      <TextField
        fullWidth
        label="Price per night"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        margin="normal"
        type="number"
      />
      <TextField
        fullWidth
        label="Availability"
        type="checkbox"
        checked={availability}
        onChange={(e) => setAvailability(e.target.checked)}
        margin="normal"
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? 'Saving...' : editRoomData ? 'Update Room' : 'Add Room'}
      </Button>
    </Box>
  );
};

export default AddRoomForm;
