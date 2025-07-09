# 🚀 Explanium Usage Guide

Complete guide for using Explanium - AI-powered text explanations with advanced caching.

## 📦 Installation Options

### 🌐 Chrome Web Store (Recommended) 🌟
1. **[Visit Chrome Web Store](https://chromewebstore.google.com/detail/ocnbjjlimncdnppedfgemkhonfcjmdcc)**
2. **Click "Add to Chrome"**
3. **Confirm installation**
4. **Pin the extension** to your toolbar for easy access
5. **Setup API key** (see configuration below)

**Benefits:**
- ✅ One-click installation
- ✅ Automatic updates
- ✅ Enhanced security
- ✅ Verified by Google

### 💻 Developer Installation (For Development)
1. **Download/Clone** the Explanium repository
2. **Open Chrome** and go to `chrome://extensions/`
3. **Enable "Developer mode"** (toggle in top right)
4. **Click "Load unpacked"** and select the Explanium folder
5. **Pin the extension** to your toolbar for easy access

## 🔑 API Configuration

### Get Your Google Gemini API Key
1. **Visit [Google AI Studio](https://aistudio.google.com/app/apikey)**
2. **Sign in** with your Google account
3. **Create a new API key** (free tier available: 15 requests/minute, 1500/day)
4. **Copy the API key** for the next step

### Configure the Extension
1. **Click the Explanium icon** in your browser toolbar
2. **Paste your API key** in the "API Key" field
3. **Click "Save API Key"**
4. **Verify the green checkmark** shows "API key configured!"

## 💡 How to Get Explanations

### 🖱️ Method 1: Auto-Explain (Default & Fastest)
1. **Go to any webpage** (Wikipedia, news sites, documentation, etc.)
2. **Select/highlight any text** with your mouse (1-5000 characters)
3. **Popup appears instantly** below your selection
4. **⚡ Lightning bolt** indicates cached (instant) responses
5. **Click × or outside** to close, or **copy button** to copy explanation

### 🖱️ Method 2: Right-Click Menu
1. **Select text** you want explained
2. **Right-click** on the selected text
3. **Choose "Explain with Explanium"** from the context menu
4. **Popup appears** with explanation

## ⚡ Advanced Caching System

### How Caching Works
- **First Time**: Text sent to Google Gemini API (~2-3 seconds)
- **Repeat Selections**: ⚡ Instant response from local cache (<100ms)
- **Smart Matching**: Similar text variations use cached results
- **Large Capacity**: 5000+ explanations stored locally

### Cache Benefits
- **Instant Speed**: Repeated explanations appear immediately
- **Cost Savings**: Reduces API calls and quota usage
- **Offline Access**: Cached explanations work without internet
- **Performance**: Dramatically improves user experience

### Cache Indicators
- **⚡ Lightning Bolt**: Appears when explanation comes from cache
- **No Indicator**: Fresh explanation from API
- **Cache Stats**: View hit rate and savings in settings

## ⚙️ Extension Settings

### Access Settings
- **Click the Explanium extension icon** in toolbar
- **Or right-click extension icon** → "Options"

### Behavior Settings
- **✅ Enable Extension**: Turn the entire extension on/off
- **✅ Auto-explain**: Show explanations automatically when text is selected
- **✅ Show on Long Text**: Allow explanations for text longer than 200 characters

### API Configuration
- **Gemini API Key**: Your Google AI Studio API key
- **Connection Status**: Shows if your API key is working
- **Model Info**: Displays current AI model (Gemma-3-1b-it)

### Cache Management
- **Cache Size**: Shows current cache usage (X / 5000)
- **Hit Rate**: Percentage of requests served from cache
- **API Calls Saved**: Number of API requests avoided through caching
- **Refresh Stats**: Update cache statistics
- **Clear Cache**: Remove all cached explanations

## 🎯 Smart Popup Features

### Intelligent Positioning
The popup automatically positions itself for optimal viewing:

1. **Below Selection**: Appears directly under selected text
2. **Viewport Awareness**: Adjusts if near screen edges
3. **Scroll Adaptation**: Maintains position during scrolling
4. **Never Blocks**: Positioned to avoid covering important content

### Interactive Elements
- **Copy Button**: One-click copying of explanations
- **Close Button**: Manual popup dismissal
- **Click Outside**: Automatic closure when clicking elsewhere
- **ESC Key**: Keyboard shortcut to close popup

## 🌐 Website Compatibility

### ✅ Works Great On
- **Wikipedia**: Articles and reference content
- **News Sites**: Articles and breaking news
- **Documentation**: Technical guides and manuals
- **Educational Sites**: Academic content and courses
- **Social Media**: Posts and comments (where text is selectable)
- **Forums**: Discussion threads and Q&A
- **E-commerce**: Product descriptions and reviews
- **Blogs**: Articles and opinion pieces

### 📱 Responsive Design
- **Desktop**: Full-featured experience
- **Laptops**: Optimized for smaller screens
- **Large Displays**: Scales appropriately
- **High DPI**: Crisp display on retina screens

## 🚀 Performance Optimization

### For Best Performance
1. **Enable Caching**: Keep auto-explain enabled for best caching
2. **Reasonable Text**: Select 1-200 words for optimal response time
3. **Stable Connection**: Ensure good internet for initial API calls
4. **Updated Browser**: Use Chrome 88+ for best compatibility

### Performance Metrics
- **Initial Load**: Extension loads in <100ms
- **First Explanation**: 2-3 seconds (API dependent)
- **Cached Explanation**: <100ms (instant)
- **Memory Usage**: <5MB typical
- **Storage Usage**: <10MB for full cache

## 🛠️ Troubleshooting Quick Fixes

### Popup Not Showing
1. **Check extension is enabled** in chrome://extensions/
2. **Verify API key** is configured in settings
3. **Refresh the webpage** after installation
4. **Try selecting different text** (avoid images/videos)

### Slow Responses
1. **Check internet connection**
2. **Verify API key** is working in settings
3. **Try shorter text** selections
4. **Check Google API status**

### Cache Issues
1. **Refresh cache stats** in settings
2. **Clear cache** if it's full or corrupted
3. **Check available storage** in browser

## 🔒 Privacy & Data Handling

### What's Processed
- **Selected Text Only**: Only the text you highlight is sent to Google
- **Local Storage**: Settings and cache stored on your device
- **No Tracking**: No analytics or user behavior tracking

### Data Flow
1. **Text Selection** → Cache check locally
2. **Cache Miss** → Secure HTTPS request to Google Gemini API
3. **API Response** → Cached locally + displayed
4. **Cache Hit** → Instant display from local storage

### Your Control
- **API Key**: Stored securely on your device only
- **Cache Management**: Clear or view cache anytime
- **Extension Control**: Enable/disable all functionality
- **Data Portability**: Uninstall removes all data

## 💎 Pro Tips

### Maximize Cache Efficiency
- **Select consistent text**: Similar selections benefit from caching
- **Use frequently**: Regular use builds up useful cache
- **Check hit rate**: Monitor cache performance in settings

### Best Text Selection
- **Complete sentences**: Better context for AI
- **Avoid very long text**: Keep under 200 words for speed
- **Technical terms**: Great for acronyms and jargon
- **Foreign phrases**: Excellent for translations and meanings

### Keyboard Shortcuts
- **ESC**: Close popup quickly
- **Ctrl+C**: Copy explanation (after clicking copy button)
- **Right-click**: Access context menu option

## 📊 Understanding Cache Statistics

### Cache Metrics Explained
- **Cache Size**: Number of explanations stored (max 5000)
- **Hit Rate**: Percentage of instant responses vs API calls
- **API Calls Saved**: Money and quota saved through caching

### Optimal Performance
- **Good Hit Rate**: 30%+ indicates effective caching
- **Cache Usage**: Higher usage = more instant responses
- **Regular Cleanup**: Cache auto-cleans after 7 days

## 🎯 Advanced Usage Scenarios

### For Students
- **Research Papers**: Quick explanations of complex terms
- **Technical Reading**: Understand difficult concepts
- **Language Learning**: Explain phrases and idioms

### For Professionals
- **Documentation**: Quickly understand technical terms
- **Industry Jargon**: Decode specialized vocabulary
- **News Analysis**: Understand complex topics quickly

### For General Users
- **Web Browsing**: Understand unfamiliar terms
- **Social Media**: Decode trending topics and slang
- **Shopping**: Understand product specifications

---

## 🆘 Need Help?

- **[Troubleshooting Guide](TROUBLESHOOTING.md)**: Detailed problem-solving
- **[GitHub Issues](https://github.com/Navaneeth-Git/Explanium/issues)**: Report bugs
- **[Privacy Policy](https://navaneeth-git.github.io/Explanium/privacy-policy.html)**: Data practices

**Enjoy instant AI explanations!** ⚡ 