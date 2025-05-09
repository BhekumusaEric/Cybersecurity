import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { SentimentVeryDissatisfied as SadIcon } from '@mui/icons-material';

const NotFound = () => {
  return (
    <Container maxWidth="md">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 5, 
          mt: 5, 
          textAlign: 'center',
          borderRadius: 2
        }}
      >
        <SadIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
        
        <Typography variant="h3" component="h1" gutterBottom>
          404 - Page Not Found
        </Typography>
        
        <Typography variant="body1" paragraph color="text.secondary">
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Button 
            component={Link} 
            to="/" 
            variant="contained" 
            color="primary" 
            size="large"
          >
            Go to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;
