
# ✅ Health Connect Integration Checklist for Replit App

## 🔧 Setup

- [ ] Add Health Connect dependency:
  ```groovy
  implementation "androidx.health.connect:connect-client:1.1.0-alpha04"
  ```
- [ ] Check if Health Connect is available via `HealthConnectClient.sdkStatus`
- [ ] Create `HealthConnectClient` instance:
  ```kotlin
  val healthConnectClient = HealthConnectClient.getOrCreate(context)
  ```

---

## 🔐 Permissions

- [ ] Declare permissions in `AndroidManifest.xml`:
  ```xml
  <uses-permission android:name="android.permission.health.READ" />
  <uses-permission android:name="android.permission.health.WRITE" />
  ```
- [ ] Request runtime permissions using Health Connect API:
  ```kotlin
  val permissions = setOf(
      Permission.createReadPermission(Steps::class),
      Permission.createWritePermission(Steps::class)
  )
  ```
- [ ] Handle permission result and revocation with user feedback

---

## 🔄 Data Access & Sync

- [ ] Use appropriate data types (`Steps`, `Distance`, `SleepSession`, `ExerciseSession`, etc.)
- [ ] Use `readRecords()` and `insertRecords()` methods to interact with Health Connect
- [ ] Handle sync errors and cases where permissions are revoked

---

## 🛡 Privacy & Security

- [ ] Add a privacy policy:
  - Clearly explain what health data is collected
  - Why it is collected
  - How it is used and stored
  - How users can revoke access
- [ ] Ensure data is stored securely (encrypted storage if needed)

---

## 🏪 Google Play Compliance

- [ ] Complete **Data safety** section in Play Console accurately
- [ ] Explain Health Connect usage clearly in-app before requesting permissions
- [ ] Only request the minimum required data permissions

---

## 📲 Testing

- [ ] Test full permission request flows: granted, denied, and revoked
- [ ] Test read/write logic with dummy or real device data
- [ ] Handle cases when Health Connect is not available or installed

---
