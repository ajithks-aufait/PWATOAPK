# Scope Extensions Guide for PWA

## Overview

Your PWA manifest now includes `scope_extensions` to enable navigation to additional domains or subdomains. This allows your PWA to work seamlessly across multiple related websites and services.

## Current Configuration

```json
"scope_extensions": [
  {
    "origin": "https://api.ptms.com"
  },
  {
    "origin": "https://docs.ptms.com"
  },
  {
    "origin": "https://support.ptms.com"
  }
]
```

## 🎯 What Scope Extensions Do

### **Primary Scope vs Extensions**
- **`scope: "/"`** - Your main PWA domain
- **`scope_extensions`** - Additional domains your PWA can navigate to

### **Benefits**
1. **Seamless Navigation**: Users can navigate between related domains without leaving the PWA
2. **Single App Experience**: Multiple domains feel like one unified application
3. **Cross-Domain Functionality**: Access APIs, documentation, and support from the same PWA
4. **Better User Experience**: No need to open external browsers or apps

## 🌐 Common Use Cases

### **1. API Integration**
```json
{
  "origin": "https://api.ptms.com"
}
```
- **Purpose**: Connect to backend APIs
- **Use Case**: Data synchronization, user authentication, file uploads

### **2. Documentation Access**
```json
{
  "origin": "https://docs.ptms.com"
}
```
- **Purpose**: Access help documentation
- **Use Case**: User guides, API documentation, troubleshooting

### **3. Support Portal**
```json
{
  "origin": "https://support.ptms.com"
}
```
- **Purpose**: Customer support and help desk
- **Use Case**: Ticket creation, live chat, knowledge base

### **4. Additional Services**
```json
{
  "origin": "https://analytics.ptms.com"
}
```
- **Purpose**: Analytics and reporting
- **Use Case**: Usage statistics, performance metrics, business intelligence

## 🔧 Configuration Options

### **Basic Origin**
```json
{
  "origin": "https://subdomain.example.com"
}
```

### **Origin with Path**
```json
{
  "origin": "https://api.example.com",
  "hasOriginWildcard": false
}
```

### **Wildcard Subdomain**
```json
{
  "origin": "https://*.example.com",
  "hasOriginWildcard": true
}
```

### **Multiple Paths**
```json
{
  "origin": "https://example.com",
  "paths": ["/api/*", "/docs/*", "/support/*"]
}
```

## 📱 For Plant Tour Management System

### **Current Configuration Analysis**
Your current setup includes:

1. **API Domain** (`https://api.ptms.com`)
   - **Purpose**: Backend API for data operations
   - **Use Cases**: Plant tour data, user management, file uploads

2. **Documentation** (`https://docs.ptms.com`)
   - **Purpose**: User guides and help documentation
   - **Use Cases**: How-to guides, API documentation, troubleshooting

3. **Support Portal** (`https://support.ptms.com`)
   - **Purpose**: Customer support and help desk
   - **Use Cases**: Ticket system, live chat, knowledge base

### **Additional Recommendations**
Consider adding these domains if applicable:

```json
"scope_extensions": [
  {
    "origin": "https://api.ptms.com"
  },
  {
    "origin": "https://docs.ptms.com"
  },
  {
    "origin": "https://support.ptms.com"
  },
  {
    "origin": "https://reports.ptms.com"
  },
  {
    "origin": "https://admin.ptms.com"
  }
]
```

## 🚀 Implementation Benefits

### **1. Seamless User Experience**
- Users stay within the PWA environment
- No external browser redirects
- Consistent UI/UX across domains

### **2. Enhanced Functionality**
- Access to external APIs and services
- Integrated documentation and support
- Cross-domain data sharing

### **3. Better Performance**
- Faster navigation between related services
- Reduced context switching
- Optimized resource loading

### **4. Improved Security**
- Controlled access to specific domains
- Secure cross-origin communication
- Protected user sessions

## 🔒 Security Considerations

### **Trusted Origins Only**
- Only include domains you control
- Avoid wildcard origins for security
- Regularly audit included domains

### **HTTPS Required**
- All origins must use HTTPS
- No HTTP or localhost origins in production
- Valid SSL certificates required

### **CORS Configuration**
- Configure proper CORS headers on target domains
- Set appropriate Access-Control-Allow-Origin headers
- Handle preflight requests correctly

## 📋 Browser Support

### **Current Support**
- ✅ **Chrome**: Full support (v93+)
- ✅ **Edge**: Full support (v93+)
- ⚠️ **Firefox**: Limited support
- ⚠️ **Safari**: Limited support

### **Fallback Behavior**
- Browsers without support will ignore scope_extensions
- PWA will still work with primary scope
- No breaking changes for unsupported browsers

## 🔄 Dynamic Scope Extensions

### **Runtime Configuration**
You can also configure scope extensions dynamically:

```javascript
// Check if scope extensions are supported
if ('serviceWorker' in navigator && 'scope' in navigator.serviceWorker) {
  // Configure additional origins
  navigator.serviceWorker.register('/sw.js', {
    scope: '/',
    scopeExtensions: [
      { origin: 'https://api.example.com' },
      { origin: 'https://docs.example.com' }
    ]
  });
}
```

## 🎯 Best Practices

### **1. Minimal Scope**
- Only include necessary domains
- Avoid overly broad wildcards
- Regular audit of included origins

### **2. Consistent Experience**
- Ensure all domains have consistent UI
- Use same branding and styling
- Maintain navigation consistency

### **3. Performance Optimization**
- Optimize loading across domains
- Use appropriate caching strategies
- Minimize cross-domain requests

### **4. User Communication**
- Inform users about cross-domain navigation
- Provide clear navigation indicators
- Handle offline scenarios gracefully

## 🚀 Next Steps

### **1. Update Your Domains**
Replace the placeholder domains with your actual domains:

```json
"scope_extensions": [
  {
    "origin": "https://your-api-domain.com"
  },
  {
    "origin": "https://your-docs-domain.com"
  },
  {
    "origin": "https://your-support-domain.com"
  }
]
```

### **2. Configure CORS**
Ensure your target domains have proper CORS configuration:

```javascript
// Example CORS configuration
app.use(cors({
  origin: ['https://your-pwa-domain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### **3. Test Cross-Domain Navigation**
- Test navigation between domains
- Verify PWA context is maintained
- Check for any security issues

### **4. Update Service Worker**
Ensure your service worker handles cross-domain requests:

```javascript
// In your service worker
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle cross-domain requests
  if (url.origin !== location.origin) {
    // Handle external domain requests
    event.respondWith(handleCrossDomainRequest(event.request));
  }
});
```

## 📝 Notes

- **Current configuration uses placeholder domains** - replace with your actual domains
- **HTTPS required** - all origins must use secure connections
- **Browser support varies** - test across different browsers
- **Security important** - only include trusted domains
- **Performance consideration** - monitor cross-domain request performance

## 🔗 Resources

- [PWA Manifest Scope Extensions](https://developer.mozilla.org/en-US/docs/Web/Manifest/scope_extensions)
- [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Service Worker Cross-Origin Requests](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)

Remember to replace the placeholder domains with your actual domain names!
