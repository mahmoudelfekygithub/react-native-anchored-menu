const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Watch the parent directory for changes so we get live updates
config.watchFolders = [path.resolve(__dirname, '..')];

// Add alias for the library and ensure proper dependency resolution
config.resolver.alias = {
  'react-native-anchored-menu': path.resolve(__dirname, '../src'),
};

// Ensure React and React Native resolve from the example app's node_modules
// This prevents the "react not found" error when the library imports React
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];

module.exports = config;