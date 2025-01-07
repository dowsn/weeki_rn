export default {
  expo: {
    name: 'weeki',
    slug: 'weeki',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    android: {
      package: 'ai.weeki',
      versionCode: 2,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
    },
    ios: {
      bundleIdentifier: 'ai.weeki',
      icon: './assets/icon.png',
      buildNumber: '1',
    },
    extra: {
      deepgramApiKey: 'ne',
      eas: {
        projectId: '721922e4-fff0-4a3a-9cfb-2d5b3f373b2e', // Add this line
      },
    },
    // Add these if you're not already using them
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
  },
};
