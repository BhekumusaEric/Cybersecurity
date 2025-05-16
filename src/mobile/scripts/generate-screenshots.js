const puppeteer = require('puppeteer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Ensure directories exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Screenshot configurations
const screenshotConfigs = [
  // iOS Screenshots
  {
    name: 'iphone-6.5',
    width: 1242,
    height: 2688,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    platform: 'ios',
  },
  {
    name: 'iphone-5.5',
    width: 1242,
    height: 2208,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    platform: 'ios',
  },
  {
    name: 'ipad-12.9',
    width: 2048,
    height: 2732,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    platform: 'ios',
  },
  // Android Screenshots
  {
    name: 'pixel-5',
    width: 1080,
    height: 2340,
    deviceScaleFactor: 2.75,
    isMobile: true,
    hasTouch: true,
    platform: 'android',
  },
  {
    name: 'pixel-tablet',
    width: 1280,
    height: 800,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    platform: 'android',
  },
];

// Screenshot scenarios
const scenarios = [
  {
    name: 'dashboard',
    path: '/dashboard',
    title: 'Dashboard',
    description: 'Track your progress and access your courses',
  },
  {
    name: 'courses',
    path: '/courses',
    title: 'Courses',
    description: 'Browse our comprehensive ethical hacking courses',
  },
  {
    name: 'lab',
    path: '/labs/1',
    title: 'Interactive Labs',
    description: 'Practice your skills in our secure lab environment',
  },
  {
    name: 'lesson',
    path: '/courses/1/lessons/1',
    title: 'Engaging Lessons',
    description: 'Learn with interactive content and videos',
  },
  {
    name: 'profile',
    path: '/profile',
    title: 'Track Progress',
    description: 'Monitor your achievements and certificates',
  },
];

// Output directories
const iosOutputDir = path.join(__dirname, '../src/assets/screenshots/ios');
const androidOutputDir = path.join(__dirname, '../src/assets/screenshots/android');

// Ensure output directories exist
ensureDirectoryExists(iosOutputDir);
ensureDirectoryExists(androidOutputDir);

// Generate screenshots
const generateScreenshots = async () => {
  console.log('Launching browser...');
  
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });
  
  try {
    for (const config of screenshotConfigs) {
      console.log(`Generating screenshots for ${config.name}...`);
      
      const page = await browser.newPage();
      
      // Set viewport
      await page.setViewport({
        width: config.width,
        height: config.height,
        deviceScaleFactor: config.deviceScaleFactor,
        isMobile: config.isMobile,
        hasTouch: config.hasTouch,
      });
      
      // Set user agent
      if (config.platform === 'ios') {
        await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1');
      } else {
        await page.setUserAgent('Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Mobile Safari/537.36');
      }
      
      // Take screenshots for each scenario
      for (const scenario of scenarios) {
        console.log(`  - Scenario: ${scenario.name}`);
        
        // Navigate to the page
        await page.goto(`http://localhost:3000${scenario.path}`, {
          waitUntil: 'networkidle2',
        });
        
        // Wait for content to load
        await page.waitForTimeout(2000);
        
        // Take screenshot
        const screenshotBuffer = await page.screenshot({ fullPage: false });
        
        // Add title and description overlay
        const overlayBuffer = await addOverlay(
          screenshotBuffer,
          scenario.title,
          scenario.description,
          config.width,
          config.height
        );
        
        // Save screenshot
        const outputDir = config.platform === 'ios' ? iosOutputDir : androidOutputDir;
        const outputPath = path.join(outputDir, `${config.name}-${scenario.name}.png`);
        
        fs.writeFileSync(outputPath, overlayBuffer);
        
        console.log(`    Saved to ${outputPath}`);
      }
      
      await page.close();
    }
  } finally {
    await browser.close();
  }
  
  console.log('All screenshots generated successfully!');
};

// Add title and description overlay to screenshot
const addOverlay = async (imageBuffer, title, description, width, height) => {
  // Create a transparent overlay with text
  const overlayBuffer = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: {
          text: {
            text: `<span foreground="white" size="40000" weight="bold">${title}</span>`,
            width: width - 100,
            height: 200,
            rgba: true,
          },
        },
        gravity: 'southwest',
        left: 50,
        top: -250,
      },
      {
        input: {
          text: {
            text: `<span foreground="white" size="20000">${description}</span>`,
            width: width - 100,
            height: 100,
            rgba: true,
          },
        },
        gravity: 'southwest',
        left: 50,
        top: -200,
      },
    ])
    .toBuffer();
  
  // Composite the original screenshot with the overlay
  return sharp(imageBuffer)
    .composite([
      {
        input: Buffer.from(
          `<svg>
            <rect x="0" y="${height - 300}" width="${width}" height="300" fill="rgba(0,0,0,0.5)" />
          </svg>`
        ),
        top: 0,
        left: 0,
      },
      {
        input: overlayBuffer,
        top: 0,
        left: 0,
      },
    ])
    .toBuffer();
};

// Run the script
generateScreenshots().catch((error) => {
  console.error('Error generating screenshots:', error);
  process.exit(1);
});
