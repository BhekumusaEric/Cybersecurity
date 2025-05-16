/**
 * Setup script for asset generation dependencies
 * 
 * This script ensures that the required dependencies for asset generation
 * (sharp and puppeteer) are properly installed before running the asset
 * generation scripts.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Log with color
const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
};

// Check if a package is installed
const isPackageInstalled = (packageName) => {
  try {
    require.resolve(packageName);
    return true;
  } catch (e) {
    return false;
  }
};

// Install a package if not already installed
const ensurePackageInstalled = (packageName, version = null) => {
  const packageString = version ? `${packageName}@${version}` : packageName;
  
  if (!isPackageInstalled(packageName)) {
    log.info(`Installing ${packageString}...`);
    try {
      execSync(`npm install --no-save ${packageString}`, { stdio: 'inherit' });
      log.success(`${packageName} installed successfully.`);
      return true;
    } catch (error) {
      log.error(`Failed to install ${packageName}: ${error.message}`);
      return false;
    }
  } else {
    log.info(`${packageName} is already installed.`);
    return true;
  }
};

// Check if the source assets directory exists
const checkSourceAssetsDirectory = () => {
  const sourceDir = path.join(__dirname, '..', 'src', 'assets', 'source');
  
  if (!fs.existsSync(sourceDir)) {
    log.warning(`Source assets directory not found: ${sourceDir}`);
    log.info('Creating source assets directory...');
    
    try {
      fs.mkdirSync(sourceDir, { recursive: true });
      log.success('Source assets directory created successfully.');
    } catch (error) {
      log.error(`Failed to create source assets directory: ${error.message}`);
      return false;
    }
  }
  
  return true;
};

// Check if required source assets exist
const checkRequiredSourceAssets = () => {
  const sourceDir = path.join(__dirname, '..', 'src', 'assets', 'source');
  const requiredAssets = [
    { file: 'icon.png', description: 'Main app icon (1024x1024 PNG)' },
    { file: 'splash.png', description: 'Splash screen image (2732x2732 PNG)' },
    { file: 'adaptive-icon-foreground.png', description: 'Android adaptive icon foreground (432x432 PNG)' },
    { file: 'adaptive-icon-background.png', description: 'Android adaptive icon background (432x432 PNG)' }
  ];
  
  let allAssetsExist = true;
  
  for (const asset of requiredAssets) {
    const assetPath = path.join(sourceDir, asset.file);
    
    if (!fs.existsSync(assetPath)) {
      log.warning(`Required source asset not found: ${asset.file}`);
      log.info(`Description: ${asset.description}`);
      allAssetsExist = false;
    }
  }
  
  if (!allAssetsExist) {
    log.info('Please create the missing source assets before running the asset generation scripts.');
  } else {
    log.success('All required source assets found.');
  }
  
  return allAssetsExist;
};

// Main function
const setupAssetGeneration = async () => {
  log.info('Setting up asset generation dependencies...');
  
  // Check if sharp is installed
  const sharpInstalled = ensurePackageInstalled('sharp', '0.32.5');
  
  // Check if puppeteer is installed
  const puppeteerInstalled = ensurePackageInstalled('puppeteer', '21.1.1');
  
  // Check source assets directory
  const sourceDirectoryExists = checkSourceAssetsDirectory();
  
  // Check required source assets
  const sourceAssetsExist = checkRequiredSourceAssets();
  
  // Summary
  log.info('\nSetup Summary:');
  log.info(`- sharp: ${sharpInstalled ? 'Installed ✓' : 'Not installed ✗'}`);
  log.info(`- puppeteer: ${puppeteerInstalled ? 'Installed ✓' : 'Not installed ✗'}`);
  log.info(`- Source directory: ${sourceDirectoryExists ? 'Exists ✓' : 'Does not exist ✗'}`);
  log.info(`- Source assets: ${sourceAssetsExist ? 'All found ✓' : 'Some missing ✗'}`);
  
  if (sharpInstalled && puppeteerInstalled && sourceDirectoryExists) {
    log.success('\nAsset generation dependencies are set up correctly!');
    
    if (!sourceAssetsExist) {
      log.warning('However, some source assets are missing. Please create them before running the asset generation scripts.');
    } else {
      log.info('\nYou can now run the asset generation scripts:');
      log.info('npm run generate:source-assets');
      log.info('npm run generate:assets');
      log.info('npm run generate:screenshots');
      log.info('\nOr run them all at once:');
      log.info('npm run prepare:appstore');
    }
    
    return true;
  } else {
    log.error('\nAsset generation setup failed. Please fix the issues above and try again.');
    return false;
  }
};

// Run the script
setupAssetGeneration().catch((error) => {
  log.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});
