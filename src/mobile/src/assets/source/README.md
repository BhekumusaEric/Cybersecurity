# Source Assets for Ethical Hacking LMS

This directory contains the source assets for the Ethical Hacking LMS mobile app. These high-resolution source files are used to generate all the required assets for iOS and Android platforms.

## Files

- `icon.png`: Main app icon (1024x1024 PNG)
- `splash.png`: Splash screen image (2732x2732 PNG)
- `adaptive-icon-foreground.png`: Android adaptive icon foreground (432x432 PNG)
- `adaptive-icon-background.png`: Android adaptive icon background (432x432 PNG)

## Design Guidelines

### App Icon

The app icon follows these design guidelines:

- Simple, recognizable design that works at small sizes
- Uses the primary brand color (#1976d2) as the main color
- Includes a shield symbol to represent security
- Avoids text or small details that would be lost at smaller sizes
- Has a safe zone margin of 10% from each edge
- Uses a flat design style with subtle shadows

### Splash Screen

The splash screen follows these design guidelines:

- Centered logo with ample space around it
- Uses the primary brand color (#1976d2) as the background
- Simple animation that doesn't distract from the loading process
- Consistent with the app icon design language

### Android Adaptive Icons

The Android adaptive icons follow these guidelines:

- Foreground element fits within a circle with 66dp padding
- Background uses a solid color or simple pattern
- Design works well with various mask shapes (circle, square, rounded square, etc.)
- Foreground and background have separate layers

## Generating Assets

These source files are used by the asset generation scripts to create all the required assets for iOS and Android. To generate the assets, follow these steps:

```bash
# First, ensure dependencies are installed
npm run setup:assets

# Then generate the assets
npm run generate:source-assets
npm run generate:assets
npm run generate:screenshots

# Or run all at once
npm run prepare:appstore
```

This will create all the necessary icon and splash screen sizes for both platforms, as well as screenshots for app store submission.

## Updating Assets

When updating these source assets, make sure to:

1. Maintain the same dimensions and format
2. Keep the design consistent with the brand guidelines
3. Test the generated assets on various devices to ensure they look good at all sizes
4. Run the asset generation script after making changes

## Design Specifications

### Color Palette

- Primary Blue: #1976d2
- Dark Blue: #004ba0
- Light Blue: #63a4ff
- White: #ffffff
- Black: #000000
- Gray: #757575

### Typography

- Primary Font: Roboto
- Secondary Font: Roboto Condensed
- Logo Font: Montserrat Bold

### Logo Specifications

- Shield shape with network/lock icon
- "EH" monogram in the center
- Minimum clear space: 10% of logo height on all sides
- Minimum size: 32px height for digital use

## Troubleshooting

If you encounter issues with asset generation:

1. Make sure all required source files exist in this directory
2. Verify that the files have the correct dimensions
3. Ensure that the `sharp` and `puppeteer` dependencies are installed:
   ```bash
   npm run setup:assets
   ```
4. Check the console output for specific error messages
5. If you're having issues with the dependencies, try installing them globally:
   ```bash
   npm install -g sharp puppeteer
   ```
