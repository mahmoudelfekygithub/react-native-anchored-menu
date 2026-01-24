# Setting Up Example App Assets

The Expo example app requires some basic asset files. Here are a few ways to create them:

## Option 1: Use Placeholder Images

Create simple colored square PNG files:

1. **icon.png** (1024x1024) - App icon
2. **adaptive-icon.png** (1024x1024) - Android adaptive icon  
3. **splash.png** (1242x2208) - Splash screen
4. **favicon.png** (48x48) - Web favicon

You can create these with any image editor or online tool.

## Option 2: Download from Expo

```bash
# Download default Expo assets
npx create-expo-app --template blank temp_assets
cp temp_assets/assets/* assets/
rm -rf temp_assets
```

## Option 3: Use Online Tools

- **Favicon Generator**: https://favicon.io/favicon-generator/
- **App Icon Generator**: https://appicon.co/
- **Placeholder Images**: https://placeholder.com/

## Quick Setup Script

```bash
# Create simple placeholder PNGs (requires ImageMagick)
mkdir -p assets
convert -size 1024x1024 xc:"#007AFF" assets/icon.png
convert -size 1024x1024 xc:"#007AFF" assets/adaptive-icon.png  
convert -size 1242x2208 xc:"#FFFFFF" assets/splash.png
convert -size 48x48 xc:"#007AFF" assets/favicon.png
```

After creating the assets, you can run:

```bash
npm start
```