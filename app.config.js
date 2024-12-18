export default {
  android: {
    package: 'ai.weeki',
  },
  icon: './assets/icon.png', // Adjust the path based on your icon's location
  ios: {
    bundleIdentifier: 'ai.weeki',
    icon: './assets/icon.png',
  },
  name: 'weeki',
  // ... other existing configs
  extra: {
    deepgramApiKey: process.env.DEEPGRAM_API_KEY,
    // Add other environment variables here
  },
};
