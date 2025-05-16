const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Ensure directories exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// iOS icon sizes
const iosIconSizes = [
  { size: 20, name: 'icon-20x20.png' },
  { size: 29, name: 'icon-29x29.png' },
  { size: 40, name: 'icon-40x40.png' },
  { size: 60, name: 'icon-60x60.png' },
  { size: 76, name: 'icon-76x76.png' },
  { size: 83.5, name: 'icon-83.5x83.5.png' },
  { size: 1024, name: 'icon-1024x1024.png' }
];

// Android icon sizes
const androidIconSizes = [
  { size: 48, name: 'icon-mdpi.png' },
  { size: 72, name: 'icon-hdpi.png' },
  { size: 96, name: 'icon-xhdpi.png' },
  { size: 144, name: 'icon-xxhdpi.png' },
  { size: 192, name: 'icon-xxxhdpi.png' }
];

// Android adaptive icon sizes
const androidAdaptiveIconSizes = [
  { size: 432, name: 'adaptive-icon-foreground.png' },
  { size: 432, name: 'adaptive-icon-background.png' }
];

// Android splash screen sizes
const androidSplashSizes = [
  { width: 320, height: 480, name: 'splash-mdpi.png' },
  { width: 480, height: 720, name: 'splash-hdpi.png' },
  { width: 720, height: 1280, name: 'splash-xhdpi.png' },
  { width: 960, height: 1600, name: 'splash-xxhdpi.png' },
  { width: 1280, height: 1920, name: 'splash-xxxhdpi.png' }
];

// iOS splash screen sizes
const iosSplashSizes = [
  { width: 640, height: 960, name: 'splash-640x960.png' }, // iPhone 4
  { width: 750, height: 1334, name: 'splash-750x1334.png' }, // iPhone 8, SE
  { width: 1242, height: 2208, name: 'splash-1242x2208.png' }, // iPhone 8 Plus
  { width: 1125, height: 2436, name: 'splash-1125x2436.png' }, // iPhone X, XS
  { width: 828, height: 1792, name: 'splash-828x1792.png' }, // iPhone XR
  { width: 1242, height: 2688, name: 'splash-1242x2688.png' }, // iPhone XS Max
  { width: 1170, height: 2532, name: 'splash-1170x2532.png' }, // iPhone 12, 13
  { width: 1284, height: 2778, name: 'splash-1284x2778.png' }, // iPhone 12 Pro Max, 13 Pro Max
  { width: 1620, height: 2160, name: 'splash-1620x2160.png' }, // iPad
  { width: 1668, height: 2224, name: 'splash-1668x2224.png' }, // iPad Pro 10.5"
  { width: 2048, height: 2732, name: 'splash-2048x2732.png' } // iPad Pro 12.9"
];

// Source files
const sourceIconPath = path.join(__dirname, '../src/assets/source/icon.png');
const sourceSplashPath = path.join(__dirname, '../src/assets/source/splash.png');
const sourceAdaptiveForegroundPath = path.join(__dirname, '../src/assets/source/adaptive-icon-foreground.png');
const sourceAdaptiveBackgroundPath = path.join(__dirname, '../src/assets/source/adaptive-icon-background.png');

// Output directories
const iosOutputDir = path.join(__dirname, '../src/assets/ios');
const androidOutputDir = path.join(__dirname, '../src/assets/android');
const rootOutputDir = path.join(__dirname, '../src/assets');

// Ensure output directories exist
ensureDirectoryExists(iosOutputDir);
ensureDirectoryExists(androidOutputDir);
ensureDirectoryExists(rootOutputDir);

// Generate iOS icons
const generateIosIcons = async () => {
  console.log('Generating iOS icons...');
  
  for (const { size, name } of iosIconSizes) {
    const outputPath = path.join(iosOutputDir, name);
    
    await sharp(sourceIconPath)
      .resize(size, size)
      .toFile(outputPath);
    
    console.log(`Generated ${outputPath}`);
  }
  
  // Copy the 1024x1024 icon to the root assets directory
  await sharp(sourceIconPath)
    .resize(1024, 1024)
    .toFile(path.join(rootOutputDir, 'icon.png'));
  
  console.log('iOS icons generated successfully!');
};

// Generate Android icons
const generateAndroidIcons = async () => {
  console.log('Generating Android icons...');
  
  for (const { size, name } of androidIconSizes) {
    const outputPath = path.join(androidOutputDir, name);
    
    await sharp(sourceIconPath)
      .resize(size, size)
      .toFile(outputPath);
    
    console.log(`Generated ${outputPath}`);
  }
  
  // Generate adaptive icons
  for (const { size, name } of androidAdaptiveIconSizes) {
    const sourcePath = name.includes('foreground') 
      ? sourceAdaptiveForegroundPath 
      : sourceAdaptiveBackgroundPath;
    
    const outputPath = path.join(androidOutputDir, name);
    
    await sharp(sourcePath)
      .resize(size, size)
      .toFile(outputPath);
    
    console.log(`Generated ${outputPath}`);
  }
  
  console.log('Android icons generated successfully!');
};

// Generate splash screens
const generateSplashScreens = async () => {
  console.log('Generating splash screens...');
  
  // Generate Android splash screens
  for (const { width, height, name } of androidSplashSizes) {
    const outputPath = path.join(androidOutputDir, name);
    
    await sharp(sourceSplashPath)
      .resize(width, height, { fit: 'contain', background: { r: 25, g: 118, b: 210 } })
      .toFile(outputPath);
    
    console.log(`Generated ${outputPath}`);
  }
  
  // Generate iOS splash screens
  for (const { width, height, name } of iosSplashSizes) {
    const outputPath = path.join(iosOutputDir, name);
    
    await sharp(sourceSplashPath)
      .resize(width, height, { fit: 'contain', background: { r: 25, g: 118, b: 210 } })
      .toFile(outputPath);
    
    console.log(`Generated ${outputPath}`);
  }
  
  // Generate main splash screen
  await sharp(sourceSplashPath)
    .resize(1242, 2436, { fit: 'contain', background: { r: 25, g: 118, b: 210 } })
    .toFile(path.join(rootOutputDir, 'splash.png'));
  
  console.log('Splash screens generated successfully!');
};

// Generate notification icon
const generateNotificationIcon = async () => {
  console.log('Generating notification icon...');
  
  await sharp(sourceIconPath)
    .resize(96, 96)
    .toFile(path.join(rootOutputDir, 'notification-icon.png'));
  
  console.log('Notification icon generated successfully!');
};

// Generate favicon
const generateFavicon = async () => {
  console.log('Generating favicon...');
  
  await sharp(sourceIconPath)
    .resize(32, 32)
    .toFile(path.join(rootOutputDir, 'favicon.png'));
  
  console.log('Favicon generated successfully!');
};

// Main function
const generateAssets = async () => {
  try {
    await generateIosIcons();
    await generateAndroidIcons();
    await generateSplashScreens();
    await generateNotificationIcon();
    await generateFavicon();
    
    console.log('All assets generated successfully!');
  } catch (error) {
    console.error('Error generating assets:', error);
    process.exit(1);
  }
};

// Run the script
generateAssets();
