# 🚀 Explanium - AI-Powered Text Explainer

A powerful Chrome extension that provides instant explanations for any selected text using Google's Gemini AI. Get fast, accurate explanations with a beautiful dark interface, advanced caching system, and privacy-first design.

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Coming%20Soon-4285f4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chrome.google.com/webstore)
[![GitHub](https://img.shields.io/badge/GitHub-Open%20Source-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Navaneeth-Git/Explanium)
[![Privacy Policy](https://img.shields.io/badge/Privacy-Protected-green?style=for-the-badge&logo=shield&logoColor=white)](https://navaneeth-git.github.io/Explanium/privacy-policy.html)

## ScreenShots

https://github.com/user-attachments/assets/dcb66876-411f-434b-a77f-d52961bc1d6e

![1](https://github.com/user-attachments/assets/53d2295b-1442-4021-844c-0b07ec1fa88a)
![2](https://github.com/user-attachments/assets/dcbe6729-d4bc-4f3b-b6bb-dace9c60f3b2)
![3](https://github.com/user-attachments/assets/7f9f36a1-6068-49b6-9b86-8973e7cf6cb9)
![4](https://github.com/user-attachments/assets/5917699f-a2c5-4bd2-b93b-eb6894efc94b)

## ✨ Key Features

- 🤖 **Google Gemini AI**: Powered by Google's Gemma-3-1b-it model for fast, accurate explanations
- ⚡ **Advanced Caching**: Smart caching system for instant repeat explanations (5000+ entries)
- 🚀 **Lightning Fast**: Initial explanations in 2-3 seconds, cached responses are instant
- 🎯 **Smart Positioning**: Popup appears directly below selected text, never blocks content
- 🖱️ **Right-Click Support**: Context menu option "Explain with Explanium" for selected text
- 🎨 **Beautiful Dark UI**: Modern interface with smooth animations and professional design
- 🔒 **Privacy First**: Your API key stays on your device, only sent to Google's official API
- 📱 **Responsive Design**: Works perfectly on all screen sizes and websites
- 🌐 **Universal Compatibility**: Works on any website with selected text
- 📊 **Cache Analytics**: View hit rates, API calls saved, and cache management

## 🎯 Why Choose Explanium?

### **Instant Performance**
- **First time**: Fast AI explanation from Google Gemini
- **Repeat selections**: ⚡ Instant responses from smart cache
- **Smart matching**: Cached explanations work for similar text

### **Cost Effective**
- **Reduce API costs**: Cached responses save API calls
- **Track savings**: See exactly how many API calls you've saved
- **Efficient usage**: 5000+ explanation cache capacity

### **Professional Quality**
- **Clean explanations**: AI response cleaning removes unnecessary prefixes
- **Consistent formatting**: Markdown support for rich text display
- **Copy functionality**: One-click copy of explanations
- **Error handling**: Graceful handling of all edge cases

## 🚀 Quick Start

### Installation (Development)

1. **Download** the extension files from this repository
2. **Open Chrome** and go to `chrome://extensions/`
3. **Enable Developer Mode** (toggle in top right)
4. **Click "Load unpacked"** and select the Explanium folder
5. **Get your API key** from [Google AI Studio](https://aistudio.google.com/app/apikey)
6. **Configure the extension** by clicking the extension icon and entering your API key

### Chrome Web Store Installation (Coming Soon)

The extension will be available on the Chrome Web Store soon! Features:
- One-click installation
- Automatic updates
- Enhanced security
- Verified distribution

## 🔧 Configuration

### API Setup
1. **Visit [Google AI Studio](https://aistudio.google.com/app/apikey)**
2. **Sign in** with your Google account
3. **Create a new API key** (free tier available)
4. **Copy the API key**
5. **Open extension settings** and paste your API key
6. **Verify connection** shows green checkmark

### Extension Settings
- **Extension Enabled**: Turn the entire extension on/off
- **Auto-explain**: Show explanations automatically when text is selected
- **Show on Long Text**: Allow explanations for text longer than 200 characters

### Cache Management
- **View Statistics**: Cache size, hit rate, API calls saved
- **Refresh Stats**: Update cache statistics
- **Clear Cache**: Remove all cached explanations

## 💡 How to Use

### **Method 1: Auto-Explain (Default)**
1. **Select any text** on any webpage
2. **Popup appears automatically** below your selection
3. **⚡ Lightning bolt** indicates cached (instant) responses
4. **Click copy button** to copy explanation

### **Method 2: Right-Click Menu**
1. **Select text** you want explained
2. **Right-click** on the selected text
3. **Choose "Explain with Explanium"** from context menu
4. **Popup appears** with explanation

## 🎨 UI Features

### Smart Popup Design
- **Intelligent positioning**: Never blocks your content
- **Responsive layout**: Adapts to screen size and scroll position
- **Cache indicators**: ⚡ shows when response is instant from cache
- **Copy functionality**: One-click explanation copying
- **Keyboard shortcuts**: ESC to close popup

### Settings Interface
- **Dark theme**: Professional design with green accents
- **Real-time feedback**: Immediate confirmation of setting changes
- **API status**: Clear indication of configuration status
- **Cache statistics**: Detailed performance metrics
- **Support links**: Easy access to help and development support

## 🔒 Privacy & Security

### **What We DON'T Collect**
- Personal information (name, email, etc.)
- Browsing history or website data
- Location or device information
- Usage analytics or tracking data

### **What We DO Process**
- **Selected text only**: Sent to Google Gemini API for explanations
- **Local storage**: Settings and cache stored on your device
- **API key**: Stored securely using Chrome's storage API

### **Security Features**
- **HTTPS only**: All API communications encrypted
- **Local storage**: No central database with user data
- **Minimal permissions**: Only requests necessary permissions
- **Open source**: Full code transparency

[📄 **View Full Privacy Policy**](https://navaneeth-git.github.io/Explanium/privacy-policy.html)

## 🛠️ Technical Details

### **Architecture**
- **Manifest V3**: Latest Chrome extension standard
- **Content Scripts**: Text selection and popup management
- **Background Service**: API calls and cache management
- **Local Storage**: Settings and explanation caching

### **Performance**
- **Cache System**: 5000+ explanations stored locally
- **Smart Cleanup**: Automatic expiration and size management
- **Optimized API**: Minimal requests with intelligent caching
- **Memory Efficient**: <5MB typical memory usage

### **Compatibility**
- **Chrome**: Version 88+ (Manifest V3 support)
- **Chromium Browsers**: Edge, Brave, Opera, Vivaldi
- **Text Sources**: Works on any selectable text
- **Websites**: Universal compatibility

## 📊 Cache System

### **Advanced Caching Features**
- **Large Capacity**: 5000+ cached explanations
- **Smart Matching**: Normalized text keys for better hit rates
- **Automatic Cleanup**: 7-day expiration with LRU eviction
- **Performance Tracking**: Hit rate and API savings metrics

### **Cache Benefits**
- **Instant Responses**: Repeat explanations appear immediately
- **Cost Savings**: Reduced API calls for repeated content
- **Offline Capability**: Cached explanations work without internet
- **User Control**: View stats and clear cache as needed

## 🎯 Browser Compatibility

### ✅ **Fully Supported**
- **Chrome** (v88+)
- **Microsoft Edge** (Chromium-based)
- **Brave Browser**
- **Opera**
- **Vivaldi**

### ❌ **Not Supported**
- **Firefox** (different extension system)
- **Safari** (different extension system)
- **Internet Explorer** (outdated)

## 📈 Performance Metrics

### **Typical Performance**
- **First explanation**: 2-3 seconds
- **Cached explanations**: <100ms (instant)
- **Memory usage**: <5MB
- **Storage usage**: <10MB for full cache

### **API Efficiency**
- **Response cleaning**: Removes AI prefixes automatically
- **Smart caching**: Reduces redundant API calls
- **Error handling**: Graceful degradation on failures
- **Rate limiting**: Respects API quotas

## 🛡️ Chrome Web Store Ready

### **Compliance Features**
- **Minimal Permissions**: Only requests necessary access
- **Privacy Policy**: Comprehensive privacy documentation
- **Content Security**: No inline scripts or unsafe practices
- **User Controls**: Clear settings and data management

### **Quality Assurance**
- **Extensive Testing**: Tested on major websites and edge cases
- **Error Handling**: Comprehensive error recovery
- **Performance**: Optimized for speed and efficiency
- **Documentation**: Complete user guides and troubleshooting

## 💖 Support the Project

Explanium is an open source project developed by **Navaneeth**. If you find it helpful:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/quackityduck)
[![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/navaneethnandakumar)

## 📞 Support & Feedback

- **GitHub Issues**: [Report bugs or request features](https://github.com/Navaneeth-Git/Explanium/issues)
- **Privacy Policy**: [View our privacy policy](https://navaneeth-git.github.io/Explanium/privacy-policy.html)
- **Email Support**: Available for critical issues

## 📄 Documentation

- **[Usage Guide](USAGE.md)**: Detailed usage instructions
- **[Troubleshooting](TROUBLESHOOTING.md)**: Common issues and solutions
- **[Test Results](TEST_RESULTS.md)**: Quality assurance testing
- **[Privacy Policy](https://navaneeth-git.github.io/Explanium/privacy-policy.html)**: Data handling practices

---

**Ready for Chrome Web Store submission** 🚀 | **Privacy-first design** 🔒 | **Open source** 💻

Made with ❤️ by [Navaneeth](https://github.com/Navaneeth-Git)




