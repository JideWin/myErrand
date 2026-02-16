const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Fix: Add 'cjs' to source extensions so Firebase loads correctly
defaultConfig.resolver.sourceExts.push('cjs');

module.exports = defaultConfig;