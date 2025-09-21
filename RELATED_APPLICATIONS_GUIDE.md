# Related Applications Configuration Guide

## Overview

Your PWA manifest now includes `related_applications` configuration. This field helps browsers and app stores understand the relationship between your PWA and any native mobile apps you have.

## Current Configuration

```json
"related_applications": [
  {
    "platform": "play",
    "url": "https://play.google.com/store/apps/details?id=com.ptms.app",
    "id": "com.ptms.app"
  },
  {
    "platform": "itunes",
    "url": "https://apps.apple.com/app/plant-tour-management-system/id123456789",
    "id": "123456789"
  }
]
```

## 🔧 How to Update with Your Actual App IDs

### For Google Play Store (Android)
1. **Get your App ID**: 
   - Go to Google Play Console
   - Navigate to your app
   - The App ID is in the format: `com.yourcompany.yourapp`

2. **Update the configuration**:
   ```json
   {
     "platform": "play",
     "url": "https://play.google.com/store/apps/details?id=YOUR_ACTUAL_APP_ID",
     "id": "YOUR_ACTUAL_APP_ID"
   }
   ```

### For Apple App Store (iOS)
1. **Get your App ID**:
   - Go to App Store Connect
   - Navigate to your app
   - The App ID is a numeric identifier

2. **Update the configuration**:
   ```json
   {
     "platform": "itunes",
     "url": "https://apps.apple.com/app/your-app-name/idYOUR_ACTUAL_APP_ID",
     "id": "YOUR_ACTUAL_APP_ID"
   }
   ```

## 📱 Platform Options

The `related_applications` field supports these platforms:

- **"play"** - Google Play Store (Android)
- **"itunes"** - Apple App Store (iOS)
- **"webapp"** - Web App Store (Windows)
- **"windows"** - Microsoft Store (Windows)

## 🎯 Use Cases

### Scenario 1: PWA Only
If you only have a PWA and no native apps:
```json
"related_applications": [],
"prefer_related_applications": false
```

### Scenario 2: Native Apps Available
If you have native apps and want to promote them:
```json
"related_applications": [
  {
    "platform": "play",
    "url": "https://play.google.com/store/apps/details?id=com.ptms.app",
    "id": "com.ptms.app"
  }
],
"prefer_related_applications": true
```

### Scenario 3: PWA Preferred
If you prefer users to use your PWA over native apps:
```json
"related_applications": [
  {
    "platform": "play",
    "url": "https://play.google.com/store/apps/details?id=com.ptms.app",
    "id": "com.ptms.app"
  }
],
"prefer_related_applications": false
```

## 🔄 Current Settings Explained

Your current configuration:
- **`prefer_related_applications: false`** - Users will see the PWA installation option first
- **Placeholder App IDs** - You need to replace with your actual app store IDs
- **Both platforms included** - Ready for both Android and iOS

## ✅ Benefits

1. **App Store Integration**: Browsers can suggest your native app if available
2. **User Choice**: Users can choose between PWA and native app
3. **Cross-Platform**: Works across different app stores
4. **SEO Benefits**: Better app discoverability
5. **Analytics**: Track conversions between PWA and native apps

## 🚀 Next Steps

1. **Get your actual App Store IDs** from Google Play Console and App Store Connect
2. **Update the manifest.json** with your real app IDs and URLs
3. **Test the configuration** by installing your PWA
4. **Deploy and monitor** user behavior between PWA and native apps

## 📝 Notes

- The current configuration uses placeholder IDs that need to be updated
- You can remove platforms you don't have native apps for
- The `prefer_related_applications` setting controls which option is shown first
- This configuration is especially useful for PWA-to-APK conversions

## 🔗 Example with Real App IDs

```json
"related_applications": [
  {
    "platform": "play",
    "url": "https://play.google.com/store/apps/details?id=com.yourcompany.ptms",
    "id": "com.yourcompany.ptms"
  }
],
"prefer_related_applications": false
```

Remember to replace the placeholder values with your actual app store information!
