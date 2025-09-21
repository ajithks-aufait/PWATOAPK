# IARC Rating Guide for PWA

## Overview

Your PWA manifest now includes an IARC (International Age Rating Coalition) rating. This helps app stores and users understand what age group your app is designed for.

## Current Configuration

```json
"iarc_rating_id": "e84b072d-71b3-4d3e-86ae-31a8ce4e53b7"
```

**Note**: This is a placeholder ID for a business/productivity app suitable for all ages. You need to get your own official IARC rating.

## 🎯 What is IARC?

The International Age Rating Coalition (IARC) provides a unified age rating system for digital content across multiple regions and platforms. It's used by:

- Google Play Store
- Microsoft Store
- Amazon Appstore
- Samsung Galaxy Store
- And other major app stores

## 📊 Age Rating Categories

### General Ratings
- **3+** - Suitable for ages 3 and above
- **7+** - Suitable for ages 7 and above
- **12+** - Suitable for ages 12 and above
- **16+** - Suitable for ages 16 and above
- **18+** - Adults only

### Content Descriptors
- **Mild Language** - Occasional use of mild profanity
- **Simulated Gambling** - Simulated gambling activities
- **Mild Violence** - Cartoon or fantasy violence
- **Mild Sexual Content** - Mild sexual references or themes
- **Drug References** - References to drugs or alcohol
- **Real Gambling** - Real money gambling
- **Intense Violence** - Realistic or intense violence
- **Strong Sexual Content** - Explicit sexual content
- **Strong Language** - Frequent use of strong profanity

## 🏭 For Plant Tour Management System

Based on your app being a **business/productivity** application, the appropriate rating would likely be:

### Recommended Rating: **3+ (Everyone)**
- **Content**: Business data entry, forms, and productivity tools
- **Language**: Professional business terminology
- **Violence**: None
- **Sexual Content**: None
- **Gambling**: None
- **Drugs/Alcohol**: None

### Content Descriptors: **None Required**
Your app appears to be a professional business application with no concerning content.

## 🔧 How to Get Your Own IARC Rating

### Method 1: Google Play Console (Recommended)
1. Go to [Google Play Console](https://play.google.com/console)
2. Create or select your app
3. Go to **Policy** → **App content**
4. Complete the **Content rating** questionnaire
5. Get your IARC certificate ID
6. Use this ID in your manifest

### Method 2: IARC Website
1. Visit [IARC Website](https://www.globalratings.com/)
2. Create an account
3. Complete the rating questionnaire
4. Get your official rating ID
5. Update your manifest

### Method 3: Microsoft Partner Center
1. Go to [Microsoft Partner Center](https://partner.microsoft.com/)
2. Navigate to your app
3. Complete the age rating questionnaire
4. Get your rating certificate
5. Use the ID in your manifest

## 📝 Rating Questionnaire Topics

When completing the IARC questionnaire, you'll be asked about:

1. **Violence**: Does your app contain violence?
2. **Sexual Content**: Does your app contain sexual content?
3. **Language**: Does your app contain profanity?
4. **Gambling**: Does your app contain gambling?
5. **Drugs/Alcohol**: Does your app reference drugs or alcohol?
6. **User Generated Content**: Can users create/share content?
7. **Social Features**: Does your app have social features?
8. **Location Services**: Does your app use location data?

## ✅ Benefits of IARC Rating

1. **App Store Compliance**: Required by most major app stores
2. **User Trust**: Parents and users know the app is age-appropriate
3. **Global Distribution**: Works across multiple regions and stores
4. **Legal Compliance**: Meets international content rating requirements
5. **Professional Appearance**: Shows your app is properly classified

## 🚀 Next Steps

1. **Complete IARC Rating Process**:
   - Go to Google Play Console or IARC website
   - Answer the questionnaire honestly
   - Get your official rating ID

2. **Update Your Manifest**:
   ```json
   "iarc_rating_id": "YOUR_OFFICIAL_IARC_ID"
   ```

3. **Test Your App**:
   - Deploy with the new rating
   - Verify it appears correctly in app stores
   - Test PWA-to-APK conversion

## 📋 Example Questionnaire Answers (Business App)

For your Plant Tour Management System:

- **Violence**: No
- **Sexual Content**: No  
- **Language**: No profanity
- **Gambling**: No
- **Drugs/Alcohol**: No
- **User Generated Content**: Yes (data entry forms)
- **Social Features**: No
- **Location Services**: Possibly (if tracking locations)

**Expected Result**: 3+ rating with no content descriptors

## 🔗 Resources

- [IARC Official Website](https://www.globalratings.com/)
- [Google Play Content Rating](https://support.google.com/googleplay/android-developer/answer/9859348)
- [Microsoft Store Age Ratings](https://docs.microsoft.com/en-us/windows/uwp/publish/age-ratings)
- [PWA Manifest IARC Documentation](https://developer.mozilla.org/en-US/docs/Web/Manifest/iarc_rating_id)

## ⚠️ Important Notes

- **Current ID is a placeholder** - replace with your official rating
- **Rating is legally binding** - ensure answers are accurate
- **Updates required** - re-rate if app content changes significantly
- **Global compliance** - IARC rating works across multiple regions
- **Free service** - IARC rating is free for developers

Remember to replace the placeholder IARC rating ID with your official rating once you complete the questionnaire!
