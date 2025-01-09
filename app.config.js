export default {
  expo: {
    name: 'weeki',
    slug: 'weeki',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    fonts: [
      {
        asset: './assets/fonts/VarelaRound-Regular.ttf',
        family: 'VarelaRound-Regular',
      },
    ],
    android: {
      package: 'Weeki',
      versionCode: 2,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#0C0313',
      },
    },
    ios: {
      bundleIdentifier: 'Weeki',
      icon: './assets/icon.png',
      buildNumber: '1',
    },
    extra: {
      deepgramApiKey: 'ne',
      eas: {
        projectId: '721922e4-fff0-4a3a-9cfb-2d5b3f373b2e',
      },
    },
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#0C0313',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: [
      '**/*',
      'assets/**/*',
      'assets/icons/*',
      'assets/icons/Logo_Violet.png',
      'assets/icons/icon.png',
    ],
  },
};
