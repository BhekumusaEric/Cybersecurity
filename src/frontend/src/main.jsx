import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { AuthProvider } from './context/AuthContext.jsx'
import { OfflineProvider } from './context/OfflineContext.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import './index.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <OfflineProvider>
            <CssBaseline />
            <App />
          </OfflineProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
/*
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    // Show a notification when a new version is available
    if (registration && registration.waiting) {
      // Create a custom event to notify the app about the update
      window.dispatchEvent(new CustomEvent('swUpdate', { detail: registration }));
    }
  },
  onSuccess: (registration) => {
    console.log('Service worker registered successfully');
  }
});
*/
