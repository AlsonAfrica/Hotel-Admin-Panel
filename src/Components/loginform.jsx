import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../Config/firebaseconfig';
import { useNavigate } from 'react-router-dom'; // Correct import

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize navigate
  const navigate = useNavigate();

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Perform Firebase authentication with email and password
      const userCredential = await signInWithEmailAndPassword(auth, username, pin);
      const user = userCredential.user;
      console.log('Logged in as:', user);

      // Navigate to AdminPanel after successful login
      navigate('/AdminPanel');
    } catch (error) {
      console.error('Error logging in:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 2,
        bgcolor: '#f5f5f5',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>

      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '400px',
        }}
        onSubmit={handleLogin}
        noValidate
        autoComplete="off"
      >
        {/* Username Field */}
        <TextField
          required
          id="username"
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* PIN Field */}
        <TextField
          required
          id="pin"
          label="PIN"
          variant="outlined"
          type="password" // Makes the PIN field masked
          fullWidth
          margin="normal"
          inputProps={{ maxLength: 6 }} // Restricts input to 6 characters
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        {/* Display Error */}
        {error && <Typography color="error">{error}</Typography>}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;
