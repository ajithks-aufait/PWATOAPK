# 🚀 Launch Handler Guide

## ✅ **Launch Handler Added to Manifest**

Your manifest now includes a launch handler to control how your app is launched:

```json
{
  "launch_handler": {
    "client_mode": "focus-existing"
  }
}
```

## 🎯 **What is Launch Handler?**

Launch handler controls **how your PWA behaves** when users try to open it while it's already running.

### **Purpose:**
- ✅ **Single instance control** - Prevent multiple app windows
- ✅ **Focus management** - Bring existing window to front
- ✅ **Navigation control** - Handle new launches intelligently
- ✅ **User experience** - Consistent app behavior

## 🎯 **Current Configuration:**

### **`focus-existing` Mode:**
- **Behavior**: When app is already open, focus the existing window
- **New launches**: Bring existing window to front instead of opening new window
- **Best for**: Single-instance applications like your Plant Tour Management System

## 🔧 **Launch Handler Options:**

### **1. `focus-existing` (Current)**
```json
{
  "launch_handler": {
    "client_mode": "focus-existing"
  }
}
```
**Behavior:**
- ✅ **Focus existing window** when app is already open
- ✅ **Single instance** - no multiple windows
- ✅ **Bring to front** - existing window becomes active
- ✅ **Perfect for** productivity apps

### **2. `navigate-existing`**
```json
{
  "launch_handler": {
    "client_mode": "navigate-existing"
  }
}
```
**Behavior:**
- ✅ **Navigate in existing window** when app is already open
- ✅ **Single instance** - no multiple windows
- ✅ **Navigate to new URL** in existing window
- ✅ **Perfect for** multi-page applications

### **3. `navigate-new`**
```json
{
  "launch_handler": {
    "client_mode": "navigate-new"
  }
}
```
**Behavior:**
- ✅ **Always open new window** for each launch
- ✅ **Multiple instances** allowed
- ✅ **Independent windows** for each launch
- ✅ **Perfect for** multi-window workflows

## 📱 **Visual Examples:**

### **`focus-existing` (Current):**
```
User clicks app icon
         ↓
┌─────────────────┐
│ App already     │
│ running in      │
│ background      │
└─────────────────┘
         ↓
┌─────────────────┐
│ App window      │
│ comes to front  │
│ (focused)       │
└─────────────────┘
```

### **`navigate-existing`:**
```
User clicks app icon
         ↓
┌─────────────────┐
│ App already     │
│ running         │
└─────────────────┘
         ↓
┌─────────────────┐
│ Navigate to     │
│ new URL in      │
│ existing window │
└─────────────────┘
```

### **`navigate-new`:**
```
User clicks app icon
         ↓
┌─────────────────┐
│ App already     │
│ running         │
└─────────────────┘
         ↓
┌─────────────────┐
│ New window      │
│ opens alongside │
│ existing window │
└─────────────────┘
```

## 🎯 **For Plant Tour Management System:**

### **Why `focus-existing` is Perfect:**

#### **Single Instance Benefits:**
- ✅ **Prevents confusion** - Users won't have multiple app windows
- ✅ **Data consistency** - All data in one place
- ✅ **Resource efficiency** - Single app instance uses less memory
- ✅ **Simplified workflow** - Users focus on one task at a time

#### **Focus Management:**
- ✅ **Quick access** - App comes to front when clicked
- ✅ **No lost windows** - Existing window is always found
- ✅ **Better UX** - Consistent behavior across launches
- ✅ **Professional feel** - Behaves like native desktop apps

## 🔧 **Advanced Configuration:**

### **Multiple Client Modes:**
```json
{
  "launch_handler": {
    "client_mode": ["focus-existing", "navigate-existing"]
  }
}
```
**Behavior:**
- Try `focus-existing` first
- Fallback to `navigate-existing` if focus fails

### **Route-Specific Handling:**
```json
{
  "launch_handler": {
    "client_mode": "navigate-existing",
    "navigate_existing_client": "always"
  }
}
```
**Behavior:**
- Always navigate in existing window
- Never open new window

## 📊 **Browser Support:**

### **Full Support:**
- ✅ **Chrome 102+** - Full launch handler support
- ✅ **Edge 102+** - Full launch handler support
- ✅ **Chrome OS** - Full integration

### **Limited Support:**
- ⚠️ **Firefox** - Limited support
- ⚠️ **Safari** - No support
- ⚠️ **Mobile browsers** - Limited support

### **Fallback Behavior:**
- Browsers without support will use default behavior
- Usually opens new window/tab (like `navigate-new`)

## 🚀 **Implementation Details:**

### **Launch Handler Detection:**
```javascript
// Check if launch handler is supported
if ('launchQueue' in window) {
  console.log('Launch handler supported');
  
  // Handle launch events
  window.launchQueue.setConsumer((launchParams) => {
    console.log('App launched with:', launchParams);
    
    // Handle different launch scenarios
    if (launchParams.targetURL) {
      // Navigate to specific URL
      window.location.href = launchParams.targetURL;
    }
  });
} else {
  console.log('Launch handler not supported');
}
```

### **Launch Parameters:**
```javascript
window.launchQueue.setConsumer((launchParams) => {
  // Access launch parameters
  const targetURL = launchParams.targetURL;
  const files = launchParams.files;
  
  // Handle file launches
  if (files && files.length > 0) {
    files.forEach(file => {
      console.log('File launched:', file.name);
      // Process file
    });
  }
  
  // Handle URL launches
  if (targetURL) {
    console.log('URL launched:', targetURL);
    // Navigate to URL
  }
});
```

## 🎯 **Use Cases for Different Modes:**

### **`focus-existing` (Current) - Best for:**
- ✅ **Productivity apps** - Plant Tour Management
- ✅ **Data entry apps** - Forms and records
- ✅ **Single-user workflows** - One person, one session
- ✅ **Resource-intensive apps** - Avoid multiple instances

### **`navigate-existing` - Best for:**
- ✅ **Multi-page apps** - Different sections
- ✅ **Document viewers** - Multiple documents
- ✅ **Dashboard apps** - Different views
- ✅ **Content management** - Multiple items

### **`navigate-new` - Best for:**
- ✅ **Multi-window workflows** - Compare data
- ✅ **Collaborative apps** - Multiple users
- ✅ **Development tools** - Multiple projects
- ✅ **Reference apps** - Keep multiple open

## 🔧 **Testing Launch Handler:**

### **Method 1: Install and Test**
1. **Install your PWA** on supported platform
2. **Launch the app** - first instance
3. **Click app icon again** - test launch behavior
4. **Verify** existing window comes to front
5. **Test multiple launches** - ensure single instance

### **Method 2: Browser DevTools**
1. Open DevTools → **Application** → **Manifest**
2. Check if `launch_handler` field appears
3. Verify `client_mode` is set to "focus-existing"

### **Method 3: Direct Manifest Check**
Visit: `your-domain.com/manifest.json?v=20241217220000`

You should see:
```json
{
  "launch_handler": {
    "client_mode": "focus-existing"
  }
}
```

## 🎨 **User Experience:**

### **Before Launch Handler:**
```
User clicks app icon
         ↓
┌─────────────────┐
│ New window      │
│ opens (even if  │
│ app already     │
│ running)        │
└─────────────────┘
```

### **After Launch Handler:**
```
User clicks app icon
         ↓
┌─────────────────┐
│ Existing window │
│ comes to front  │
│ (no new window) │
└─────────────────┘
```

## ✅ **Benefits for Your Plant Tour App:**

### **User Experience:**
- ✅ **No confusion** - Single app window
- ✅ **Quick access** - App always comes to front
- ✅ **Consistent behavior** - Predictable app launches
- ✅ **Professional feel** - Native app-like behavior

### **Technical Benefits:**
- ✅ **Resource efficiency** - Single instance
- ✅ **Data consistency** - All data in one place
- ✅ **Simplified state management** - One app state
- ✅ **Better performance** - No multiple instances

### **Business Value:**
- ✅ **Reduced support** - Users won't get confused
- ✅ **Better adoption** - Professional app behavior
- ✅ **Improved workflow** - Users focus on one task
- ✅ **Competitive advantage** - Modern PWA features

## 🔄 **Future Enhancements:**

### **Advanced Launch Handling:**
- **Route-specific behavior** - Different modes for different URLs
- **User preference** - Let users choose launch behavior
- **Context-aware launching** - Different behavior based on context
- **Multi-window workflows** - Selective multi-window support

### **Launch Analytics:**
- **Track launch patterns** - How users open your app
- **Optimize launch behavior** - Based on usage data
- **A/B testing** - Test different launch modes
- **User feedback** - Gather launch behavior preferences

## ✅ **Expected Results:**

With this configuration:
- ✅ **Single instance** behavior
- ✅ **Focus existing window** on launch
- ✅ **Professional app experience**
- ✅ **Consistent launch behavior**
- ✅ **Better resource management**

Your Plant Tour Management System now has controlled launch behavior, ensuring users always have a single, focused instance of your app running!
