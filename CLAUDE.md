# Weeki React Native App - Build Documentation

## App Overview
- **App Name**: exhibitionary_rn (Internal name: weeki)
- **Version**: 1.0.0
- **Platform**: React Native with Expo
- **Architecture**: New Architecture enabled
- **Orientation**: Portrait only

## Build Process

### Android Build Process

#### Recommended Command (AAB for Play Store)
```bash
cd android && ./gradlew bundleRelease
```

#### Alternative Command (APK for Direct Install)
```bash
cd android && ./gradlew assembleRelease
```

#### Build Details
- **Build Tool**: Gradle Wrapper
- **Recommended Build Type**: Release AAB Bundle
- **Metro Bundler**: Used for JavaScript bundling (12040ms bundling time)
- **Modules Bundled**: 1307 modules
- **Assets**: 28 asset files copied

#### Key Dependencies
- React Native 0.76.5
- Expo SDK (latest)
- Multiple Expo modules (asset, av, constants, location, etc.)
- React Navigation 6.x
- Various React Native community packages

#### Build Environment
- **Platform**: macOS (Darwin 23.4.0)
- **Architecture**: New React Native Architecture enabled
- **Metro Bundle Output**: `index.android.bundle`
- **Proguard**: Configured for release builds

#### Build Success
✅ APK successfully generated at: `/Users/lukasmeinhart/Documents/Repos/weeki_rn/android/app/build/outputs/apk/release/app-release.apk`

### App Features
Based on the project structure, this appears to be a chat/conversation app with:
- User authentication (login/registration)
- Chat functionality with speech support
- Topics management
- Dashboard with old sessions
- Profile management
- Location services
- Secure storage capabilities
- Audio/video support
- Encrypted storage

### Android App Bundle (AAB) Build

#### Command Used
```bash
cd android && ./gradlew bundleRelease
```

#### Generated AAB Bundle
- **Location**: `android/app/build/outputs/bundle/release/app-release.aab`
- **Size**: 32MB (smaller than APK due to bundle optimization)
- **Generated**: June 12, 2025 at 13:25

#### Key Differences: APK vs AAB
- **APK**: 65MB - Direct install file
- **AAB**: 32MB - Google Play Bundle format (optimized)
- **AAB Benefits**: Dynamic delivery, smaller download sizes, Google Play optimization

### Future Builds

#### For Google Play Store (AAB):
```bash
cd android && ./gradlew bundleRelease
```

#### For Direct Install (APK):
```bash
cd android && ./gradlew assembleRelease
```

Both files will be regenerated in their respective locations.