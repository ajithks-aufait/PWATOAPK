# Manifest Cache Busting Guide

## Issue: Persistent Manifest Caching

Your PWA manifest includes `scope_extensions` correctly, but browsers are aggressively caching the old version. Here's a comprehensive solution.

## ✅ **Updated Configuration**

### **Enhanced Manifest Structure:**
```json
{
  "id": "/",
  "name": "Plant Tour Management System",
  "short_name": "PTMS",
  "version": "1.0.2",
  "scope_extensions": [
    {
      "origin": "https://api.ptms.com",
      "hasOriginWildcard": false
    },
    {
      "origin": "https://docs.ptms.com",
      "hasOriginWildcard": false
    },
    {
      "origin": "https://support.ptms.com",
      "hasOriginWildcard": false
    }
  ]
}
```

### **Cache-Busting HTML Link:**
```html
<link rel="manifest" href="/manifest.json?v=1.0.2" />
```

## 🚀 **Immediate Solutions**

### **Method 1: Nuclear Cache Clear**
```javascript
// Run this in browser console
async function nuclearCacheClear() {
  // Unregister all service workers
  const registrations = await navigator.serviceWorker.getRegistrations();
  for (let registration of registrations) {
    await registration.unregister();
  }
  
  // Clear all caches
  const cacheNames = await caches.keys();
  for (let cacheName of cacheNames) {
    await caches.delete(cacheName);
  }
  
  // Clear storage
  localStorage.clear();
  sessionStorage.clear();
  
  // Clear IndexedDB
  if ('indexedDB' in window) {
    const databases = await indexedDB.databases();
    for (let db of databases) {
      indexedDB.deleteDatabase(db.name);
    }
  }
  
  // Force reload
  location.reload(true);
}

nuclearCacheClear();
```

### **Method 2: Service Worker Force Update**
```javascript
// Force service worker update
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistration().then(registration => {
    if (registration) {
      registration.update().then(() => {
        location.reload();
      });
    }
  });
}
```

### **Method 3: Manifest Direct Access**
1. Open `your-domain.com/manifest.json?v=1.0.2` directly
2. Verify you see the `scope_extensions` field
3. If not visible, there's a deployment issue

## 🔧 **Browser-Specific Solutions**

### **Chrome/Edge:**
1. Press `F12` → **Application** tab
2. **Storage** → **Clear storage** → **Clear site data**
3. **Service Workers** → **Unregister**
4. **Manifest** → Check if `scope_extensions` appears
5. Hard refresh: `Ctrl + Shift + R`

### **Firefox:**
1. Press `F12` → **Storage** tab
2. Right-click your domain → **Delete All**
3. **Service Workers** → **Unregister**
4. Hard refresh: `Ctrl + Shift + R`

### **Safari:**
1. **Develop** menu → **Empty Caches**
2. **Develop** → **Clear Service Worker Registrations**
3. Hard refresh: `Cmd + Option + R`

## 📱 **Mobile Device Solutions**

### **Android Chrome:**
1. Chrome → **Settings** → **Privacy and security**
2. **Clear browsing data** → **Advanced**
3. Select **All time** → **Clear data**
4. Uninstall and reinstall PWA

### **iOS Safari:**
1. **Settings** → **Safari** → **Clear History and Website Data**
2. **Settings** → **General** → **iPhone Storage**
3. **Safari** → **Website Data** → **Remove All**

## 🌐 **Deployment Verification**

### **Check Manifest URL:**
```
https://your-domain.com/manifest.json?v=1.0.2
```

### **Expected Response:**
```json
{
  "id": "/",
  "name": "Plant Tour Management System",
  "short_name": "PTMS",
  "version": "1.0.2",
  "scope_extensions": [
    {
      "origin": "https://api.ptms.com",
      "hasOriginWildcard": false
    },
    {
      "origin": "https://docs.ptms.com",
      "hasOriginWildcard": false
    },
    {
      "origin": "https://support.ptms.com",
      "hasOriginWildcard": false
    }
  ],
  "lang": "en",
  "dir": "ltr"
}
```

## 🔄 **Alternative Approaches**

### **Method 1: Version Increment**
Update the version in manifest.json:
```json
{
  "version": "1.0.3",
  "scope_extensions": [...]
}
```

And update the HTML link:
```html
<link rel="manifest" href="/manifest.json?v=1.0.3" />
```

### **Method 2: Timestamp Cache Busting**
```html
<link rel="manifest" href="/manifest.json?t=1703123456789" />
```

### **Method 3: Hash-Based Cache Busting**
```html
<link rel="manifest" href="/manifest.json?hash=abc123def456" />
```

## 🎯 **Verification Steps**

### **Step 1: Direct Manifest Check**
1. Visit `your-domain.com/manifest.json?v=1.0.2`
2. Look for `scope_extensions` field
3. Verify version is `1.0.2`

### **Step 2: Developer Tools Check**
1. Press `F12` → **Application** → **Manifest**
2. Check for `scope_extensions` field
3. Verify version number

### **Step 3: Network Tab Check**
1. Press `F12` → **Network** tab
2. Refresh page
3. Look for `manifest.json?v=1.0.2` request
4. Check response includes `scope_extensions`

### **Step 4: PWA Installation Test**
1. Try installing PWA again
2. Check if warning about `scope_extensions` disappears
3. Verify cross-domain navigation works

## 🔒 **CDN and Hosting Cache**

### **Vercel:**
```bash
# Force redeploy
vercel --prod --force
```

### **Netlify:**
1. Go to **Site settings** → **Build & deploy**
2. Click **Clear cache and retry deploy**

### **Cloudflare:**
1. Go to **Caching** → **Configuration**
2. Click **Purge Everything**

## 📊 **Monitoring and Debugging**

### **Check Manifest Status:**
```javascript
// Check manifest in console
fetch('/manifest.json?v=1.0.2')
  .then(response => response.json())
  .then(manifest => {
    console.log('Manifest version:', manifest.version);
    console.log('Scope extensions:', manifest.scope_extensions);
  });
```

### **Service Worker Status:**
```javascript
// Check service worker status
navigator.serviceWorker.getRegistration().then(registration => {
  console.log('Service worker:', registration ? 'Active' : 'None');
  if (registration) {
    console.log('Scope:', registration.scope);
  }
});
```

## ⚡ **Quick Fix Commands**

### **Terminal Commands:**
```bash
# Clear build cache
npm run clean
rm -rf node_modules/.cache
rm -rf dist

# Rebuild
npm run build

# Force deploy
npm run deploy --force
```

## 🎯 **Expected Results**

After applying these solutions:

- ✅ **No more scope_extensions warning**
- ✅ **Manifest version shows 1.0.2**
- ✅ **scope_extensions field visible in manifest**
- ✅ **Cross-domain navigation enabled**
- ✅ **PWA installation works without warnings**

## 📝 **Prevention for Future**

### **Auto-Versioning:**
```javascript
// Auto-increment version on build
const version = new Date().getTime();
// Update manifest.json version field
// Update HTML link with new version
```

### **Cache Headers:**
```javascript
// Add to your server configuration
app.get('/manifest.json', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  // Serve manifest
});
```

Your manifest is correctly configured - the issue is just aggressive caching! These solutions should resolve it completely.
