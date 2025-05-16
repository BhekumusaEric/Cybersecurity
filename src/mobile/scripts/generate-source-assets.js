const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Ensure directories exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Output directory
const outputDir = path.join(__dirname, '../src/assets/source');
ensureDirectoryExists(outputDir);

// Colors
const primaryBlue = '#1976d2';
const darkBlue = '#004ba0';
const lightBlue = '#63a4ff';
const white = '#ffffff';

// Generate app icon
const generateAppIcon = () => {
  console.log('Generating app icon...');
  
  // Create SVG for the app icon
  const svgIcon = `
  <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <!-- Background -->
    <rect width="1024" height="1024" rx="230" fill="${primaryBlue}"/>
    
    <!-- Shield Shape -->
    <path d="M512 164C353.6 164 224 293.6 224 452v240c0 44.2 35.8 80 80 80h416c44.2 0 80-35.8 80-80V452c0-158.4-129.6-288-288-288z" fill="${darkBlue}"/>
    
    <!-- Network Grid -->
    <g fill="none" stroke="${lightBlue}" stroke-width="12">
      <circle cx="512" cy="452" r="180"/>
      <circle cx="512" cy="452" r="120"/>
      <line x1="332" y1="452" x2="692" y2="452"/>
      <line x1="512" y1="272" x2="512" y2="632"/>
      <line x1="392" y1="332" x2="632" y2="572"/>
      <line x1="392" y1="572" x2="632" y2="332"/>
    </g>
    
    <!-- Lock -->
    <rect x="432" y="512" width="160" height="120" rx="20" fill="${white}"/>
    <rect x="472" y="452" width="80" height="120" rx="40" stroke="${white}" stroke-width="24" fill="none"/>
    
    <!-- EH Monogram -->
    <text x="512" y="592" font-family="Montserrat, Arial, sans-serif" font-size="80" font-weight="bold" text-anchor="middle" fill="${primaryBlue}">EH</text>
  </svg>
  `;
  
  // Write SVG to file
  fs.writeFileSync(path.join(outputDir, 'icon.svg'), svgIcon);
  
  // Convert SVG to PNG
  sharp(Buffer.from(svgIcon))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(outputDir, 'icon.png'))
    .then(() => {
      console.log('App icon generated successfully!');
    })
    .catch(err => {
      console.error('Error generating app icon:', err);
    });
};

// Generate splash screen
const generateSplashScreen = () => {
  console.log('Generating splash screen...');
  
  // Create SVG for the splash screen
  const svgSplash = `
  <svg width="2732" height="2732" viewBox="0 0 2732 2732" xmlns="http://www.w3.org/2000/svg">
    <!-- Background -->
    <rect width="2732" height="2732" fill="${primaryBlue}"/>
    
    <!-- Logo -->
    <g transform="translate(1366, 1366) scale(2.5)">
      <!-- Shield Shape -->
      <path d="M0 -200C-110.4 -200 -200 -110.4 -200 0v120c0 22.1 17.9 40 40 40h320c22.1 0 40-17.9 40-40V0c0-110.4-89.6-200-200-200z" fill="${darkBlue}"/>
      
      <!-- Network Grid -->
      <g fill="none" stroke="${lightBlue}" stroke-width="6">
        <circle cx="0" cy="0" r="120"/>
        <circle cx="0" cy="0" r="80"/>
        <line x1="-120" y1="0" x2="120" y2="0"/>
        <line x1="0" y1="-120" x2="0" y2="120"/>
        <line x1="-84.85" y1="-84.85" x2="84.85" y2="84.85"/>
        <line x1="-84.85" y1="84.85" x2="84.85" y2="-84.85"/>
      </g>
      
      <!-- Lock -->
      <rect x="-60" y="40" width="120" height="80" rx="15" fill="${white}"/>
      <rect x="-30" y="0" width="60" height="80" rx="30" stroke="${white}" stroke-width="12" fill="none"/>
      
      <!-- EH Monogram -->
      <text x="0" y="90" font-family="Montserrat, Arial, sans-serif" font-size="50" font-weight="bold" text-anchor="middle" fill="${primaryBlue}">EH</text>
    </g>
    
    <!-- App Name -->
    <text x="1366" y="1866" font-family="Montserrat, Arial, sans-serif" font-size="120" font-weight="bold" text-anchor="middle" fill="${white}">Ethical Hacking LMS</text>
  </svg>
  `;
  
  // Write SVG to file
  fs.writeFileSync(path.join(outputDir, 'splash.svg'), svgSplash);
  
  // Convert SVG to PNG
  sharp(Buffer.from(svgSplash))
    .resize(2732, 2732)
    .png()
    .toFile(path.join(outputDir, 'splash.png'))
    .then(() => {
      console.log('Splash screen generated successfully!');
    })
    .catch(err => {
      console.error('Error generating splash screen:', err);
    });
};

// Generate Android adaptive icon foreground
const generateAdaptiveIconForeground = () => {
  console.log('Generating Android adaptive icon foreground...');
  
  // Create SVG for the adaptive icon foreground
  const svgForeground = `
  <svg width="432" height="432" viewBox="0 0 432 432" xmlns="http://www.w3.org/2000/svg">
    <!-- Network Grid -->
    <g fill="none" stroke="${lightBlue}" stroke-width="8" transform="translate(216, 216)">
      <circle cx="0" cy="0" r="120"/>
      <circle cx="0" cy="0" r="80"/>
      <line x1="-120" y1="0" x2="120" y2="0"/>
      <line x1="0" y1="-120" x2="0" y2="120"/>
      <line x1="-84.85" y1="-84.85" x2="84.85" y2="84.85"/>
      <line x1="-84.85" y1="84.85" x2="84.85" y2="-84.85"/>
    </g>
    
    <!-- Lock -->
    <g transform="translate(216, 216)">
      <rect x="-60" y="40" width="120" height="80" rx="15" fill="${white}"/>
      <rect x="-30" y="0" width="60" height="80" rx="30" stroke="${white}" stroke-width="12" fill="none"/>
      
      <!-- EH Monogram -->
      <text x="0" y="90" font-family="Montserrat, Arial, sans-serif" font-size="50" font-weight="bold" text-anchor="middle" fill="${primaryBlue}">EH</text>
    </g>
  </svg>
  `;
  
  // Write SVG to file
  fs.writeFileSync(path.join(outputDir, 'adaptive-icon-foreground.svg'), svgForeground);
  
  // Convert SVG to PNG
  sharp(Buffer.from(svgForeground))
    .resize(432, 432)
    .png()
    .toFile(path.join(outputDir, 'adaptive-icon-foreground.png'))
    .then(() => {
      console.log('Android adaptive icon foreground generated successfully!');
    })
    .catch(err => {
      console.error('Error generating Android adaptive icon foreground:', err);
    });
};

// Generate Android adaptive icon background
const generateAdaptiveIconBackground = () => {
  console.log('Generating Android adaptive icon background...');
  
  // Create SVG for the adaptive icon background
  const svgBackground = `
  <svg width="432" height="432" viewBox="0 0 432 432" xmlns="http://www.w3.org/2000/svg">
    <!-- Background -->
    <rect width="432" height="432" fill="${primaryBlue}"/>
    
    <!-- Shield Shape -->
    <path d="M216 72C142.5 72 83 131.5 83 205v100c0 18.8 15.2 34 34 34h198c18.8 0 34-15.2 34-34V205c0-73.5-59.5-133-133-133z" fill="${darkBlue}"/>
  </svg>
  `;
  
  // Write SVG to file
  fs.writeFileSync(path.join(outputDir, 'adaptive-icon-background.svg'), svgBackground);
  
  // Convert SVG to PNG
  sharp(Buffer.from(svgBackground))
    .resize(432, 432)
    .png()
    .toFile(path.join(outputDir, 'adaptive-icon-background.png'))
    .then(() => {
      console.log('Android adaptive icon background generated successfully!');
    })
    .catch(err => {
      console.error('Error generating Android adaptive icon background:', err);
    });
};

// Generate notification icon
const generateNotificationIcon = () => {
  console.log('Generating notification icon...');
  
  // Create SVG for the notification icon
  const svgNotification = `
  <svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
    <!-- Shield Shape -->
    <path d="M48 12C33.6 12 22 23.6 22 38v24c0 4.4 3.6 8 8 8h36c4.4 0 8-3.6 8-8V38c0-14.4-11.6-26-26-26z" fill="${white}"/>
    
    <!-- EH Monogram -->
    <text x="48" y="54" font-family="Montserrat, Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="${primaryBlue}">EH</text>
  </svg>
  `;
  
  // Write SVG to file
  fs.writeFileSync(path.join(outputDir, 'notification-icon.svg'), svgNotification);
  
  // Convert SVG to PNG
  sharp(Buffer.from(svgNotification))
    .resize(96, 96)
    .png()
    .toFile(path.join(outputDir, 'notification-icon.png'))
    .then(() => {
      console.log('Notification icon generated successfully!');
    })
    .catch(err => {
      console.error('Error generating notification icon:', err);
    });
};

// Main function
const generateSourceAssets = async () => {
  try {
    generateAppIcon();
    generateSplashScreen();
    generateAdaptiveIconForeground();
    generateAdaptiveIconBackground();
    generateNotificationIcon();
    
    console.log('All source assets generated successfully!');
  } catch (error) {
    console.error('Error generating source assets:', error);
    process.exit(1);
  }
};

// Run the script
generateSourceAssets();
