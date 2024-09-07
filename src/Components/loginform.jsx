import React from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

const LoginForm = () => {
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
          inputProps={{ maxLength: 4 }} // Restricts input to 4 characters
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;
