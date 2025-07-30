# Google Play Store Keystore Configuration

## Current Status
✅ Keystore available  
⚠️ Needs configuration in build.gradle

## Steps to Configure Release Build

### 1. Update build.gradle with your keystore details:

```gradle
signingConfigs {
    release {
        storeFile file('path/to/your/keystore.jks')  // Update this path
        storePassword 'your_store_password'          // Your keystore password
        keyAlias 'your_key_alias'                    // Your key alias
        keyPassword 'your_key_password'              // Your key password
    }
}
```

### 2. Secure Keystore Information

**Option A: gradle.properties (Recommended)**
Create `gradle.properties` file with:
```
SOME_STORE_FILE=../path/to/keystore.jks
SOME_STORE_PASSWORD=your_store_password
SOME_KEY_ALIAS=your_key_alias  
SOME_KEY_PASSWORD=your_key_password
```

Then update build.gradle:
```gradle
signingConfigs {
    release {
        storeFile file(SOME_STORE_FILE)
        storePassword SOME_STORE_PASSWORD
        keyAlias SOME_KEY_ALIAS
        keyPassword SOME_KEY_PASSWORD
    }
}
```

**Option B: Environment Variables**
```gradle
signingConfigs {
    release {
        storeFile file(System.getenv("SOME_KEYSTORE_FILE") ?: "keystore.jks")
        storePassword System.getenv("SOME_KEYSTORE_PASSWORD")
        keyAlias System.getenv("SOME_KEY_ALIAS")
        keyPassword System.getenv("SOME_KEY_PASSWORD")
    }
}
```

### 3. Generate Signed APK

```bash
# Navigate to android project directory
cd android-integration

# Build release APK
./gradlew assembleRelease

# Or build AAB (Android App Bundle) for Play Store
./gradlew bundleRelease
```

### 4. Verify APK Signing

```bash
# Check APK signature
jarsigner -verify -verbose -certs app/build/outputs/apk/release/app-release.apk

# Or use apksigner
apksigner verify app/build/outputs/apk/release/app-release.apk
```

## Production Package Details

- **App ID**: `com.somefitnessmethod.healthconnect`
- **Version**: 1.0 (Code: 1)
- **Target SDK**: 34 (Android 14)
- **Min SDK**: 26 (Android 8.0)

## Security Checklist

- [ ] Keystore stored securely outside version control
- [ ] gradle.properties added to .gitignore
- [ ] Release build uses ProGuard/R8 obfuscation
- [ ] Debug and release builds have different package suffixes
- [ ] Store passwords not hardcoded in build files

## Play Store Upload

Once signed APK/AAB is generated:

1. **Google Play Console** → Create new app
2. **App details** → Enter S.O.M.E Health Connect information
3. **Release** → Production → Upload AAB file
4. **Store listing** → Add screenshots, descriptions
5. **Content rating** → Health & Fitness category
6. **Data safety** → Complete health data declarations
7. **Review and publish** → Submit for review

## Files Generated

- `app-release.apk` - Signed APK for direct installation
- `app-release.aab` - Android App Bundle for Play Store (Recommended)

## Next Steps

1. Update your keystore path in build.gradle
2. Test release build locally
3. Upload to Google Play Console internal testing
4. Complete store listing with screenshots and descriptions
5. Submit for Play Store review

---

**Ready for Production**: S.O.M.E Health Connect Android companion app