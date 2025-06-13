# Android Build and Push Instructions

## Overview
This document contains the instructions for building and releasing the Weeki Android app.

## Prerequisites
- Must be run from the project root directory (where the `android` folder exists)
- Gradle and Android build tools must be properly configured

## Build Commands

### Build AAB Bundle (Recommended for Google Play)
```bash
cd android && ./gradlew bundleRelease
```

### Build APK (For direct installation)
```bash
cd android && ./gradlew assembleRelease
```

## Version Management

### Current Version Location
- **Build Version (versionCode)**: `android/app/build.gradle`
- **Version Name**: 
  - `app.json`
  - `package.json`
  - `android/app/build.gradle` (versionName)

### Updating Version

1. **Increment Build Version (versionCode)**
   - Find current: `grep -o 'versionCode [0-9]*' android/app/build.gradle`
   - Update: `sed -i "s/versionCode CURRENT/versionCode NEW/" android/app/build.gradle`

2. **Update Version Name (if needed)**
   - Update in `app.json`: `"version": "X.X.X"`
   - Update in `package.json`: `"version": "X.X.X"`
   - Update in `android/app/build.gradle`: `versionName "X.X.X"`

## Build Output Locations

### AAB Bundle
- **Path**: `android/app/build/outputs/bundle/release/app-release.aab`
- **Size**: ~32MB (optimized for Google Play)

### APK
- **Path**: `android/app/build/outputs/apk/release/app-release.apk`
- **Size**: ~65MB (includes all resources)

## Complete Build Process

1. **Update Build Version**
   ```bash
   # Get current version
   CURRENT_BUILD_VERSION=$(grep -o 'versionCode [0-9]*' android/app/build.gradle | grep -o '[0-9]*')
   NEW_BUILD_VERSION=$((CURRENT_BUILD_VERSION + 1))
   
   # Update build version
   sed -i.bak "s/versionCode $CURRENT_BUILD_VERSION/versionCode $NEW_BUILD_VERSION/" android/app/build.gradle
   ```

2. **Update Version Name (Optional)**
   ```bash
   VERSION="1.0.1"  # Your new version
   
   # Update all version references
   sed -i.bak "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" app.json
   sed -i.bak "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" package.json
   sed -i.bak "s/versionName \"[^\"]*\"/versionName \"$VERSION\"/" android/app/build.gradle
   ```

3. **Build AAB Bundle**
   ```bash
   cd android && ./gradlew bundleRelease
   ```

4. **Verify Build**
   ```bash
   ls -lh android/app/build/outputs/bundle/release/app-release.aab
   ```

## Next Steps After Build

1. **Upload to Google Play Console**
   - Navigate to your app in Google Play Console
   - Go to Release > Production (or Testing)
   - Upload the AAB file

2. **Test the Release**
   - Use internal testing track first
   - Verify all features work correctly

3. **Promote to Production**
   - Once testing is complete, promote to production

## Important Notes

- Always increment `versionCode` for each release (Google Play requirement)
- `versionName` is the user-visible version string
- AAB format is required for Google Play Store uploads
- Keep backup of previous builds before generating new ones