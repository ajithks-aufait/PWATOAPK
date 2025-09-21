# 📁 File Handlers Guide

## ✅ **File Handlers Added to Manifest**

Your manifest now includes file handlers to allow users to open files directly with your PWA:

```json
{
  "file_handlers": [
    {
      "action": "/?action=open-file",
      "accept": {
        "text/csv": [".csv"],
        "application/vnd.ms-excel": [".xls"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
        "application/pdf": [".pdf"],
        "text/plain": [".txt"],
        "application/json": [".json"],
        "text/xml": [".xml"],
        "application/xml": [".xml"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/gif": [".gif"],
        "image/webp": [".webp"]
      }
    },
    {
      "action": "/?action=import-data",
      "accept": {
        "text/csv": [".csv"],
        "application/vnd.ms-excel": [".xls"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
        "application/json": [".json"]
      }
    },
    {
      "action": "/?action=view-document",
      "accept": {
        "application/pdf": [".pdf"],
        "text/plain": [".txt"],
        "text/xml": [".xml"],
        "application/xml": [".xml"]
      }
    },
    {
      "action": "/?action=view-image",
      "accept": {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/gif": [".gif"],
        "image/webp": [".webp"]
      }
    }
  ]
}
```

## 🎯 **What are File Handlers?**

File handlers allow your PWA to be **associated with specific file types** and opened when users double-click files or drag them onto your app.

### **Purpose:**
- ✅ **File association** - Your app becomes the default handler for specific file types
- ✅ **Drag & drop support** - Users can drag files onto your app icon
- ✅ **Double-click opening** - Files open directly in your PWA
- ✅ **System integration** - Your app feels like a native application

## 📁 **Your Plant Tour Management File Handlers:**

### **1. General File Handler**
- **Action**: `/?action=open-file`
- **File Types**: CSV, Excel, PDF, TXT, JSON, XML, Images
- **Use Case**: General file opening and processing

### **2. Data Import Handler**
- **Action**: `/?action=import-data`
- **File Types**: CSV, Excel, JSON
- **Use Case**: Importing plant tour data, quality records

### **3. Document Viewer Handler**
- **Action**: `/?action=view-document`
- **File Types**: PDF, TXT, XML
- **Use Case**: Viewing plant documentation, reports

### **4. Image Viewer Handler**
- **Action**: `/?action=view-image`
- **File Types**: JPG, PNG, GIF, WebP
- **Use Case**: Viewing plant photos, quality images

## 🔧 **File Handler Configuration:**

### **Required Fields:**
```json
{
  "action": "/path/to/handler",    // URL to handle the file
  "accept": {                      // MIME types and extensions
    "text/csv": [".csv"]
  }
}
```

### **Action URLs:**
- `/?action=open-file` - General file processing
- `/?action=import-data` - Data import workflow
- `/?action=view-document` - Document viewing
- `/?action=view-image` - Image viewing

## 📊 **Supported File Types:**

### **Data Files:**
- ✅ **CSV** (`.csv`) - Comma-separated values
- ✅ **Excel** (`.xls`, `.xlsx`) - Spreadsheet files
- ✅ **JSON** (`.json`) - JavaScript Object Notation

### **Documents:**
- ✅ **PDF** (`.pdf`) - Portable Document Format
- ✅ **Text** (`.txt`) - Plain text files
- ✅ **XML** (`.xml`) - Extensible Markup Language

### **Images:**
- ✅ **JPEG** (`.jpg`, `.jpeg`) - Joint Photographic Experts Group
- ✅ **PNG** (`.png`) - Portable Network Graphics
- ✅ **GIF** (`.gif`) - Graphics Interchange Format
- ✅ **WebP** (`.webp`) - Web Picture format

## 🚀 **How File Handlers Work:**

### **File Association:**
1. **User installs** your PWA
2. **System registers** your app as handler for specified file types
3. **Double-clicking** files opens your PWA
4. **File data** is passed to your app

### **Drag & Drop:**
1. **User drags** file onto your app icon
2. **System launches** your PWA
3. **File information** is available in your app
4. **App processes** the file according to action

### **File Opening:**
1. **User double-clicks** associated file
2. **System opens** your PWA
3. **File content** is accessible in your app
4. **App handles** the file appropriately

## 🔧 **Implementation in Your App:**

### **File Handler Detection:**
```javascript
// Check if app was opened with a file
const urlParams = new URLSearchParams(window.location.search);
const action = urlParams.get('action');

if (action) {
  // Handle file opening
  switch(action) {
    case 'open-file':
      handleGeneralFile();
      break;
    case 'import-data':
      handleDataImport();
      break;
    case 'view-document':
      handleDocumentView();
      break;
    case 'view-image':
      handleImageView();
      break;
  }
}
```

### **File Access API:**
```javascript
// Access file data using File System Access API
async function handleFileOpen() {
  try {
    // Check if File System Access API is supported
    if ('showOpenFilePicker' in window) {
      const [fileHandle] = await window.showOpenFilePicker();
      const file = await fileHandle.getFile();
      const content = await file.text();
      
      // Process file content
      processFileContent(content, file.type);
    } else {
      // Fallback for browsers without File System Access API
      console.log('File System Access API not supported');
    }
  } catch (error) {
    console.error('Error opening file:', error);
  }
}
```

### **File Processing:**
```javascript
function processFileContent(content, mimeType) {
  switch(mimeType) {
    case 'text/csv':
      processCSV(content);
      break;
    case 'application/json':
      processJSON(content);
      break;
    case 'application/pdf':
      displayPDF(content);
      break;
    case 'image/jpeg':
    case 'image/png':
      displayImage(content);
      break;
    default:
      console.log('Unsupported file type:', mimeType);
  }
}
```

## 📱 **Platform Support:**

### **Full Support:**
- ✅ **Chrome 86+** - Full file handler support
- ✅ **Edge 86+** - Full file handler support
- ✅ **Chrome OS** - Full integration
- ✅ **Windows 10/11** - File association

### **Limited Support:**
- ⚠️ **Firefox** - Limited file handler support
- ⚠️ **Safari** - No file handler support
- ⚠️ **iOS** - No file handler support

### **Mobile Support:**
- ⚠️ **Android** - Limited support
- ❌ **iOS** - No support

## 🎯 **Use Cases for Plant Tour Management:**

### **Data Import:**
- ✅ **Import CSV files** with plant tour data
- ✅ **Import Excel files** with quality records
- ✅ **Import JSON files** with configuration data
- ✅ **Bulk data processing** for efficiency

### **Document Viewing:**
- ✅ **View PDF reports** from plant tours
- ✅ **View XML configuration** files
- ✅ **View text documentation** for procedures
- ✅ **Reference materials** for operators

### **Image Processing:**
- ✅ **View plant photos** for quality checks
- ✅ **View equipment images** for maintenance
- ✅ **View product images** for verification
- ✅ **Visual documentation** for tours

### **File Management:**
- ✅ **Open any supported file** directly
- ✅ **Process files** without manual upload
- ✅ **Integrate with** existing workflows
- ✅ **Seamless file handling** experience

## 🚀 **Testing File Handlers:**

### **Method 1: Install and Test**
1. **Install your PWA** on supported platform
2. **Create test files** with supported extensions
3. **Double-click files** to test association
4. **Drag files** onto app icon
5. **Verify** files open in your app

### **Method 2: Browser DevTools**
1. Open DevTools → **Application** → **Manifest**
2. Check if `file_handlers` field appears
3. Verify all file handler configurations

### **Method 3: Direct Manifest Check**
Visit: `your-domain.com/manifest.json?v=20241217210000`

You should see the `file_handlers` array with all configurations.

## 🔧 **Advanced Configuration:**

### **Multiple File Types:**
```json
{
  "file_handlers": [
    {
      "action": "/?action=open-file",
      "accept": {
        "text/csv": [".csv"],
        "application/vnd.ms-excel": [".xls", ".xlsx"],
        "application/pdf": [".pdf"]
      }
    }
  ]
}
```

### **Specific File Extensions:**
```json
{
  "accept": {
    "text/csv": [".csv"],
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"]
  }
}
```

### **Custom Actions:**
```json
{
  "action": "/?action=custom-handler&type=plant-data",
  "accept": {
    "text/csv": [".csv"]
  }
}
```

## 🎨 **User Experience:**

### **File Association:**
```
┌─────────────────┐
│   data.csv      │
│   (Double-click)│
└─────────────────┘
         ↓
┌─────────────────┐
│   PTMS App      │
│   Opens with    │
│   File Data     │
└─────────────────┘
```

### **Drag & Drop:**
```
┌─────────────────┐
│   report.pdf    │
│   (Drag to)     │
└─────────────────┘
         ↓
┌─────────────────┐
│   PTMS App      │
│   Icon          │
└─────────────────┘
         ↓
┌─────────────────┐
│   PTMS App      │
│   Opens with    │
│   PDF Content   │
└─────────────────┘
```

## ✅ **Benefits for Your Plant Tour App:**

### **User Productivity:**
- ✅ **Direct file access** - No need to upload files
- ✅ **Faster workflows** - Instant file processing
- ✅ **Better integration** - Feels like native app
- ✅ **Reduced steps** - Streamlined file handling

### **Business Value:**
- ✅ **Easier data import** - Direct CSV/Excel processing
- ✅ **Document access** - Quick PDF viewing
- ✅ **Image management** - Direct photo viewing
- ✅ **Workflow efficiency** - Reduced manual steps

### **Technical Benefits:**
- ✅ **File System Access** - Modern web APIs
- ✅ **Better UX** - Native app-like behavior
- ✅ **Integration** - OS-level file association
- ✅ **Performance** - Direct file access

## 🔄 **Future Enhancements:**

### **Advanced File Processing:**
- **File validation** before processing
- **Batch file processing** for multiple files
- **File format conversion** between types
- **Automated data extraction** from files

### **Enhanced Integration:**
- **File watching** for automatic updates
- **File synchronization** across devices
- **Cloud file integration** with Google Drive/Dropbox
- **File versioning** and history

## ✅ **Expected Results:**

With this configuration:
- ✅ **File association** with your PWA
- ✅ **Drag & drop support** for files
- ✅ **Double-click opening** of files
- ✅ **Better user experience** with file handling
- ✅ **Native app-like behavior** for file operations

Your Plant Tour Management System now supports file handlers, making it more integrated with the operating system and providing a better file handling experience!
