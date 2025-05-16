import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#1976d2',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Ethical Hacking LMS</h1>
      <p>Test application is working!</p>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);

export default App;
