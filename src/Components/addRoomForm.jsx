import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db } from '../Config/firebaseconfig'; // Adjust the path as needed

const AddRoomForm = () => {
  const [image, setImage] = useState('');
  const [amenities, setAmenities] = useState('');
  const [roomType, setRoomType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [availability, setAvailability] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        price: parseFloat(price.replace(/[^0-9.]/g, '')), // Remove non-numeric characters
        availability
      };

      await addDoc(collection(db, 'rooms'), roomData);
      alert('Room added successfully');
      // Clear the form
      setImage('');
      setAmenities('');
      setRoomType('');
      setCapacity('');
      setPrice('');
      setAvailability(true);
    } catch (err) {
      setError('Failed to add room');
      console.error('Error adding room:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (e) => {
    // Remove non-numeric characters except for the decimal point
    const formattedPrice = e.target.value.replace(/[^0-9.]/g, '');
    setPrice(formattedPrice);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 2,
        bgcolor: '#f5f5f5',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Add New Room
      </Typography>

      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '600px',
        }}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Image URL"
          variant="outlined"
          fullWidth
          margin="normal"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <TextField
          label="Amenities (comma separated)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={amenities}
          onChange={(e) => setAmenities(e.target.value)}
        />
        <TextField
          label="Room Type"
          variant="outlined"
          fullWidth
          margin="normal"
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
        />
        <TextField
          label="Capacity"
          variant="outlined"
          type="number"
          fullWidth
          margin="normal"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />
        <TextField
          label="Price"
          variant="outlined"
          type="text" // Changed to text to allow formatting
          fullWidth
          margin="normal"
          value={price ? `R${price}` : ''} // Display price with Rand sign
          onChange={handlePriceChange}
        />
        <TextField
          label="Availability"
          variant="outlined"
          type="checkbox"
          checked={availability}
          onChange={(e) => setAvailability(e.target.checked)}
        />
        
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Room'}
        </Button>
      </Box>
    </Box>
  );
};

export default AddRoomForm;
