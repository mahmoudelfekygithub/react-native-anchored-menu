# React Native Anchored Menu - Example App

This example app demonstrates the capabilities of `react-native-anchored-menu` with various real-world usage scenarios.

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 18)
- React Native development environment set up
- iOS Simulator or Android Emulator/Device

### Installation

1. **Navigate to the example directory:**
   ```bash
   cd example
   ```

2. **Install Expo CLI globally (if not already installed):**
   ```bash
   npm install -g @expo/cli
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```
   
   This will automatically install the parent library as a local dependency and link it for live development.

4. **Add placeholder assets (required by Expo):**
   Create these basic placeholder files in `example/assets/`:
   - `icon.png` (1024x1024 app icon)
   - `adaptive-icon.png` (1024x1024 Android adaptive icon)  
   - `splash.png` (1242x2208 splash screen)
   - `favicon.png` (48x48 web favicon)
   
   You can use any PNG images or download from [Expo assets](https://docs.expo.dev/develop/user-interface/app-icons/).

### Running the App

#### Start the development server
```bash
npm start
# or
expo start
```

This will open the Expo Developer Tools in your browser. From there you can:

#### Run on iOS Simulator
- Press `i` in the terminal, or
- Click "Run on iOS simulator" in the web interface

#### Run on Android Emulator  
- Press `a` in the terminal, or
- Click "Run on Android device/emulator" in the web interface

#### Run on Physical Device
- Install the **Expo Go** app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- Scan the QR code shown in the terminal or web interface

#### Run on Web
```bash
npm run web
# or 
expo start --web
```

## 📱 Examples Included

### 1. **Basic Usage**
- Simple button with menu
- Profile menu with actions
- Quick action menus
- Understanding the fundamentals

### 2. **FlatList Integration**
- Context menus for list items
- Menu positioning during scroll
- Dynamic menu content
- Real-world task list example

### 3. **Modal Usage**
- Menus inside React Native modals
- Proper provider setup for modals
- Sheet and fullscreen modal examples
- Correct layering and rendering

### 4. **Placement Options**
- All placement combinations (auto/top/bottom × start/center/end)
- Custom offset and margin settings
- Responsive positioning demonstration
- Edge case handling

### 5. **Custom Styling**
- Multiple design themes
- Animation options
- Contextual menu designs
- Advanced patterns like nested menus

## 🛠 Development Notes

This example app links directly to the parent library source code via Metro configuration, so any changes to the library are immediately reflected in the example.

The app uses React Navigation for easy navigation between examples and includes comprehensive TypeScript support.

## 📖 Learn More

- Check the source code of each example screen for implementation details
- Each example includes inline code samples and explanations
- Try different device orientations and screen sizes to see responsive behavior

## 🐛 Found an Issue?

If you encounter any issues with the examples, please open an issue in the main repository with details about:
- Which example is problematic
- Device/simulator details
- Steps to reproduce
- Expected vs actual behavior