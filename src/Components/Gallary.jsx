import React, { useEffect, useState } from "react";
import { storage } from "../Config/firebaseconfig"; // Ensure this path is correct
import { listAll, ref, getDownloadURL, deleteObject } from "firebase/storage";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress for loader
import Snackbar from "@mui/material/Snackbar"; // Import Snackbar for success message

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false); // Loader state
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagesRef = ref(storage, "Gallery/"); // Reference to your Gallery folder
        const imageList = await listAll(imagesRef);

        // Get URLs along with the references
        const urlPromises = imageList.items.map(async (imageRef) => {
          const url = await getDownloadURL(imageRef); // Get download URL for each image
          return { url, ref: imageRef }; // Return both URL and reference
        });

        const imagesWithUrls = await Promise.all(urlPromises);
        setImages(imagesWithUrls); // Set the URLs and references in state
      } catch (error) {
        console.error("Error fetching images: ", error);
      }
    };

    fetchImages(); // Fetch images when the component mounts
  }, []);

  // Function to delete an image
  const handleDeleteImage = async (imageRef) => {
    setLoading(true); // Start loading
    setSuccessMessage(""); // Reset success message
    try {
      await deleteObject(imageRef); // Delete the image using its reference
      setImages((prevImages) => prevImages.filter((img) => img.ref !== imageRef)); // Update the state to remove the deleted image
      setSuccessMessage("Image deleted successfully!"); // Set success message
      console.log("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image: ", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Close Snackbar
  const handleCloseSnackbar = () => {
    setSuccessMessage(""); // Reset success message
  };

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {images.map(({ url, ref }, index) => (
          <div key={index} style={{ position: "relative" }}>
            <img
              src={url}
              alt={`Gallery image ${index + 1}`}
              style={{
                width: "200px",
                height: "auto",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
              }}
            />
            <button
              onClick={() => handleDeleteImage(ref)} // Pass the reference for deletion
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                padding: "5px",
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Delete"}
            </button>
          </div>
        ))}
      </div>
      
      {/* Snackbar for success message */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={successMessage}
      />
    </>
  );
};

export default Gallery;
