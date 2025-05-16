import React from 'react';
import { Box, Typography, Button } from '@mui/material';

function App() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#1976d2',
        color: 'white',
        padding: 3,
      }}
    >
      <Typography variant="h2" component="h1" gutterBottom>
        Ethical Hacking LMS
      </Typography>
      <Typography variant="h5" gutterBottom>
        Professional Cybersecurity Training
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          sx={{ mr: 2 }}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          size="large"
        >
          Register
        </Button>
      </Box>
    </Box>
  );
}

export default App;
