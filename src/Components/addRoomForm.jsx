import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Grid, FormControlLabel, Checkbox } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import { collection, addDoc, updateDoc } from "firebase/firestore";
import { db } from '../Config/firebaseconfig'; // Adjust the path as needed

const AddRoomForm = ({ onAddRoom, editRoomData, onEditRoom }) => {
  const [image, setImage] = useState(null);
  const [amenities, setAmenities] = useState('');
  const [roomType, setRoomType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [availability, setAvailability] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (editRoomData) {
      setImage(editRoomData.image);
      setAmenities(editRoomData.amenities.join(', '));
      setRoomType(editRoomData.roomType);
      setCapacity(editRoomData.capacity);
      setPrice(editRoomData.price);
      setAvailability(editRoomData.availability);
      setRating(editRoomData.rating || 0);
    }
  }, [editRoomData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
        availability,
        rating,
      };

      if (editRoomData) {
        // If editing, update the room in Firestore
        await onEditRoom(editRoomData.id, roomData);
        alert('Room updated successfully');
      } else {
        // If adding, call the onAddRoom function
        const docRef = await addDoc(collection(db, 'rooms'), roomData);
        onAddRoom({ id: docRef.id, ...roomData });
        alert('Room added successfully');
      }

      // Reset form after submission
      setImage(null);
      setAmenities('');
      setRoomType('');
      setCapacity('');
      setPrice('');
      setAvailability(true);
      setRating(0);
    } catch (err) {
      setError('Error adding/updating room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ padding: 3, borderRadius: 1, boxShadow: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>{editRoomData ? 'Edit Room' : 'Add Room'}</Typography>

      <input 
        accept="image/*" 
        type="file" 
        onChange={handleImageChange} 
        style={{ display: 'none' }} 
        id="image-upload" 
      />
      <label htmlFor="image-upload">
        <Button variant="contained" component="span" sx={{ mb: 2 }}>
          {image ? 'Change Image' : 'Upload Image'}
        </Button>
      </label>
      {image && <img src={image} alt="Room" style={{ width: '100%', borderRadius: '4px', marginBottom: '16px' }} />}
      
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
      <FormControlLabel
        control={
          <Checkbox
            checked={availability}
            onChange={(e) => setAvailability(e.target.checked)}
          />
        }
        label="Available"
        sx={{ mb: 2 }}
      />

      <Typography variant="subtitle1">Rating:</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <StarIcon
            key={index}
            onClick={() => setRating(index + 1)}
            sx={{
              cursor: 'pointer',
              color: index < rating ? 'gold' : 'grey',
              '&:hover': { color: 'gold' },
            }}
          />
        ))}
      </Box>

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
