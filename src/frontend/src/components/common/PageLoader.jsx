import { Box, CircularProgress, Typography } from '@mui/material';

const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%',
        minHeight: '200px',
        p: 3
      }}
    >
      <CircularProgress size={40} thickness={4} />
      <Typography variant="body1" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default PageLoader;
