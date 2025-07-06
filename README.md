# 🚀 Explanium - AI-Powered Text Explainer

A powerful Chromium extension that provides instant explanations for any selected text using Google's Gemini AI. Get fast, accurate explanations with a beautiful dark interface and privacy-first design.

## ✨ Key Features

- 🤖 **Google Gemini AI**: Powered by Google's Gemma-3-1b-it model for fast, accurate explanations
- ⚡ **Instant Explanations**: Select any text and get explanations in 2-3 sentences
- 🎯 **Smart Positioning**: Popup appears directly below selected text, never blocks content
- 🖱️ **Right-Click Support**: Context menu option "Explain with Explanium" for selected text
- 🎨 **Beautiful Dark UI**: Modern interface with Supabase green accents and smooth animations
- 🔒 **Privacy First**: Your API key stays on your device, only sent to Google's official API
- 📱 **Responsive Design**: Works perfectly on all screen sizes and websites
- 🌐 **Universal Compatibility**: Works on any website with selected text


## ScreenShots

![Screenshot 2025-07-05 235010](https://github.com/user-attachments/assets/76687efb-94a2-4b11-8ab7-2afc77184225)
![Screenshot 2025-07-05 235037](https://github.com/user-attachments/assets/b484e23e-5b48-4c6c-a527-eedebf50b4ee)
![Screenshot 2025-07-05 235137](https://github.com/user-attachments/assets/6a568394-db81-4fbd-818d-a87e43fc8fd9)
![Screenshot 2025-07-05 235212](https://github.com/user-attachments/assets/a396ac95-2563-40b5-a724-3b9c22d8b62d)


## 🚀 Quick Start

### Installation

1. **Clone or Download** this repository
2. **Open Chrome** and go to `chrome://extensions/`
3. **Enable Developer Mode** (toggle in top right)
4. **Click "Load unpacked"** and select the extension folder
5. **Get your API key** from [Google AI Studio](https://aistudio.google.com/app/apikey)
6. **Configure the extension** by clicking the extension icon and entering your API key

### Usage

**Two ways to get explanations:**

1. **Auto-explain**: Simply select any text on any webpage → popup appears automatically
2. **Right-click menu**: Select text → right-click → "Explain with Explanium"

The popup will appear directly below your selected text with a clean, fast explanation.

## 🔧 Configuration

Click the extension icon to access settings:

### API Setup
- **Gemini API Key**: Enter your Google AI Studio API key
- **Connection Status**: See if your API key is working
- **Privacy Notice**: Your key is stored locally and never shared

### Behavior Settings
- **Enable Extension**: Turn the extension on/off
- **Auto-explain**: Show explanations automatically on text selection
- **Show on Long Text**: Explain selections longer than 200 characters (supports up to 5000 chars)

## 🤖 AI Technology

### Google Gemma-3-1b-it Model
- **Fast & Efficient**: Optimized for quick responses with low latency
- **High Quality**: Advanced language understanding for accurate explanations
- **Context Aware**: Understands complex text and provides relevant explanations
- **Token Efficient**: Configured for concise 2-3 sentence explanations

### Smart Features
- **Response Cleaning**: Automatically removes AI response prefixes for clean explanations
- **Error Handling**: Graceful handling of API errors with user-friendly messages
- **Rate Limiting**: Respects API limits with proper error messages
- **Conversation Context**: Uses conversation history for better understanding

## 📋 Requirements

- **Chrome Browser**: Version 88+ (Manifest V3 support)
- **Google AI Studio API Key**: Free tier available at [aistudio.google.com](https://aistudio.google.com/app/apikey)
- **Internet Connection**: Required for API calls to Google's servers

## 🛠️ Development

### Project Structure
```
Explanium/
├── manifest.json          # Extension configuration
├── content.js            # Text selection and popup handling
├── content.css           # Popup styling (dark theme)
├── background.js         # Google Gemini API integration
├── options.html          # Settings page
├── options.js            # Settings logic
├── icons/                # Extension icons
│   ├── icon.svg         # SVG lightbulb icon
│   ├── icon16.png       # 16x16 icon
│   ├── icon48.png       # 48x48 icon
│   └── icon128.png      # 128x128 icon
└── README.md            # This file
```

### Key Components

1. **Content Script** (`content.js`): Handles text selection, popup positioning, and UI
2. **Background Service** (`background.js`): Manages Google Gemini API calls and responses
3. **Popup Interface** (`content.css`): Beautiful dark theme with Supabase green accents
4. **Options Page** (`options.html/js`): API key management and extension settings

### Security Features

- **No Hardcoded Keys**: All API keys stored securely in Chrome sync storage
- **XSS Protection**: All user content properly escaped before display
- **HTTPS Only**: All API calls use secure HTTPS endpoints
- **Input Validation**: Proper validation of all user inputs
- **Error Handling**: Comprehensive error handling without exposing sensitive data

## 🔍 How It Works

1. **Text Selection**: Content script detects text selection via mouseup/keyup events
2. **Smart Positioning**: Calculates optimal popup position below selected text
3. **API Request**: Background script sends request to Google Gemini API
4. **Response Processing**: Cleans and formats AI response for display
5. **Popup Display**: Shows explanation in positioned popup with copy functionality

## 🎨 Design Philosophy

- **User-Centric**: Popup appears where users expect it, never blocking content
- **Privacy-First**: No data collection, API keys stored locally
- **Performance-Focused**: Fast responses with minimal resource usage
- **Accessibility**: Keyboard navigation and proper ARIA labels
- **Modern UI**: Clean dark theme with smooth animations

## 🔒 Privacy & Security

- **Local Storage**: API keys stored only on your device using Chrome sync
- **No Tracking**: No analytics, telemetry, or user data collection
- **Secure Communication**: All API calls use HTTPS with proper authentication
- **Minimal Permissions**: Only requests necessary permissions for functionality
- **Open Source**: Full transparency with public code review

## 📝 License

MIT License - feel free to modify and distribute!

## 🤝 Contributing

Contributions welcome! Areas for improvement:

- Additional AI model support
- Enhanced UI animations
- Better error handling
- Performance optimizations
- Internationalization support

## 🐛 Troubleshooting

### Extension not working?
- Check if it's enabled in `chrome://extensions/`
- Refresh the webpage after installing
- Verify your API key is entered correctly

### No explanations appearing?
- Check extension settings (click extension icon)
- Verify text selection (try different text)
- Check browser console for errors (F12 → Console)

### API errors?
- Verify your API key at [Google AI Studio](https://aistudio.google.com/app/apikey)
- Check your API quota and usage limits
- Ensure stable internet connection

## 🧪 Testing

The extension includes test files for development:

- `debug-check.html`: Basic functionality testing
- `advanced-test.html`: Advanced feature testing

Open these files in your browser to test various text selection scenarios.

## 📊 Performance

- **Memory Usage**: < 5MB typical usage
- **CPU Impact**: Minimal (< 1% on modern devices)
- **Network Usage**: ~1-2KB per explanation request
- **Response Time**: Typically 1-3 seconds depending on network 

  ## Like this Project?
  [![BuyMeACoffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/quackityduck) [![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/navaneethnandakumar) 
