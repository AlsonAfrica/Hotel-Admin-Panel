import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { styled } from '@mui/system';
import UploadIcon from '@mui/icons-material/Upload';
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../Config/firebaseconfig";

const Input = styled('input')({
  display: 'none',
});

const AddGalleryForm = ({ onAddImage }) => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title && image) {
      const storageRef = ref(storage, `Gallery/${image.name}`);
      try {
        // Upload the file to Firebase Storage
        await uploadBytes(storageRef, image);
        
        // Call the parent function if needed to update the state
        onAddImage({ title, imageName: image.name });

        // Set the success message
        setSuccessMessage("Image uploaded successfully!");

        // Clear form fields
        setTitle("");
        setImage(null);
        setImagePreview(null);

        // Optionally clear the message after some time
        setTimeout(() => {
          setSuccessMessage(""); // Clear the message after 3 seconds
        }, 3000);

      } catch (error) {
        console.error("Error uploading image: ", error);
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Add Image to Gallery
      </Typography>

      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label htmlFor="image-upload">
        <Input
          accept="image/*"
          id="image-upload"
          type="file"
          onChange={handleImageUpload}
        />
        <Button
          variant="contained"
          component="span"
          startIcon={<UploadIcon />}
          sx={{ margin: "16px 0" }}
        >
          Upload Image
        </Button>
      </label>

      {image && (
        <Typography variant="body1" color="textSecondary">
          {image.name}
        </Typography>
      )}

      {imagePreview && (
        <Box sx={{ marginTop: 2 }}>
          <img
            src={imagePreview}
            alt="Preview"
            style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
          />
        </Box>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ marginTop: 2 }}
      >
        Submit
      </Button>

      {/* Display success message if available */}
      {successMessage && (
        <Typography variant="body1" color="green" sx={{ marginTop: 2 }}>
          {successMessage}
        </Typography>
      )}
    </Box>
  );
};

export default AddGalleryForm;
