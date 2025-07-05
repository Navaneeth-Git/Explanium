# 🚀 Explanium Usage Guide

## Quick Start

### 1. Install the Extension
1. **Download/Clone** the Explanium repository
2. **Open Chrome** and go to `chrome://extensions/`
3. **Enable "Developer mode"** (toggle in top right)
4. **Click "Load unpacked"** and select the Explanium folder
5. **Pin the extension** to your toolbar for easy access

### 2. Get Your API Key
1. **Visit [Google AI Studio](https://aistudio.google.com/app/apikey)**
2. **Sign in** with your Google account
3. **Create a new API key** (free tier available)
4. **Copy the API key** for the next step

### 3. Configure the Extension
1. **Click the extension icon** in your browser toolbar
2. **Paste your API key** in the "Gemini API Key" field
3. **Click "Save API Key"**
4. **Verify the green checkmark** appears showing "API key configured!"

### 4. Start Explaining Text
1. **Go to any webpage** (Wikipedia, news sites, documentation, etc.)
2. **Select/highlight any text** with your mouse
3. **Popup appears instantly** below your selection with explanation
4. **Click × or outside** to close

## Two Ways to Get Explanations

### 🖱️ Method 1: Auto-Explain (Default)
- Simply **select any text** on any webpage
- Popup appears **automatically below** your selection
- Works on text from 1 character to 5000 characters

### 🖱️ Method 2: Right-Click Menu
- **Select text** you want explained
- **Right-click** on the selected text
- **Choose "Explain with Explanium"** from the context menu
- Popup appears with explanation

## Settings Options

### API Configuration
- **Gemini API Key**: Your Google AI Studio API key
- **Connection Status**: Shows if your API key is working
- **Privacy Notice**: Confirms your key stays on your device

### Behavior Settings
- **Enable Extension**: Turn the entire extension on/off
- **Auto-explain**: Show explanations automatically when text is selected
- **Show on Long Text**: Allow explanations for text longer than 200 characters

## Smart Popup Positioning

The popup intelligently positions itself:
- **Below selection**: Default position under your selected text
- **Above selection**: If no room below, appears above
- **Viewport aware**: Stays within screen bounds
- **Never blocks content**: Positioned to avoid covering important text

## Tips for Best Results

### ✅ Great Text to Explain
- **Single words**: "algorithm", "photosynthesis", "cryptocurrency"
- **Short phrases**: "machine learning", "climate change", "quantum computing"
- **Technical terms**: "API", "blockchain", "neural network"
- **Acronyms**: "CPU", "HTML", "GDP", "DNA"
- **Complex concepts**: "artificial intelligence", "supply chain management"

### ✅ Works Well With
- **Academic papers**: Scientific terms and concepts
- **News articles**: Current events and terminology
- **Technical documentation**: Programming and engineering terms
- **Legal documents**: Legal terminology and concepts
- **Medical content**: Health and medical terms

### ⚠️ Limitations
- **Very long text**: Over 5000 characters may be truncated
- **Code snippets**: Better to explain concepts than syntax
- **Non-English text**: Optimized for English explanations

## Troubleshooting

### No popup appears?
1. **Check extension status**: Ensure it's enabled in `chrome://extensions/`
2. **Verify API key**: Click extension icon and check connection status
3. **Refresh the webpage**: Sometimes needed after installation
4. **Try different text**: Some text might be too short/long
5. **Check settings**: Ensure "Auto-explain" is enabled

### API key issues?
1. **Verify key format**: Should be a long string starting with "AIza"
2. **Check quotas**: Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to check usage
3. **Test connection**: Extension will show connection status
4. **Regenerate key**: Create a new API key if needed

### Popup positioning issues?
1. **Try different text**: Position depends on text location
2. **Check zoom level**: Works best at 100% zoom
3. **Scroll position**: Popup adapts to current viewport
4. **Screen size**: Responsive design works on all screen sizes

### Slow responses?
1. **Network connection**: Requires internet for API calls
2. **API server status**: Google's servers might be busy
3. **Text length**: Longer text takes more time to process
4. **Rate limiting**: Too many requests might be throttled

## Browser Compatibility

### ✅ Fully Supported
- **Chrome** (v88+)
- **Microsoft Edge** (Chromium-based)
- **Brave Browser**
- **Opera**
- **Vivaldi**

### ❌ Not Supported
- **Firefox** (different extension system)
- **Safari** (different extension system)
- **Internet Explorer** (outdated)

## Privacy & Security

### 🔒 Your Data is Safe
- **API key stored locally**: Only on your device, never shared
- **No data collection**: Extension doesn't track or store your activity
- **Secure transmission**: All API calls use HTTPS encryption
- **No external servers**: Only communicates with Google's official API
- **Open source**: Full code transparency for security review

### 🛡️ What Gets Sent
- **Only selected text**: Sent to Google Gemini API for explanation
- **No personal data**: No browsing history, cookies, or personal info
- **No page content**: Only the specific text you select
- **Temporary processing**: Google processes and returns explanation

## Performance & Usage

### 💾 Storage Usage
- **Extension size**: ~500KB
- **Settings storage**: <1KB
- **No cached data**: Fresh explanations each time

### 🚀 Performance Impact
- **Memory usage**: <5MB typical
- **CPU impact**: Minimal (<1%)
- **Battery impact**: Negligible
- **Network usage**: ~1-2KB per explanation

### 📊 API Usage
- **Free tier**: 15 requests per minute, 1500 per day
- **Rate limiting**: Extension respects API limits
- **Cost**: Free tier covers typical usage
- **Monitoring**: Check usage at [Google AI Studio](https://aistudio.google.com/app/apikey)

## Advanced Features

### 🎨 UI Features
- **Dark theme**: Modern interface with Supabase green accents
- **Smooth animations**: Popup appears with bounce effect
- **Copy functionality**: Click copy button to save explanations
- **Responsive design**: Works on all screen sizes

### ⚙️ Technical Features
- **Smart positioning**: Calculates optimal popup placement
- **Error handling**: Graceful handling of API errors
- **Response cleaning**: Removes AI response prefixes automatically
- **Context menu**: Right-click integration for easy access

## Keyboard Shortcuts

- **Select text**: Mouse selection or Shift+Arrow keys
- **Escape key**: Close popup
- **Click outside**: Close popup
- **Copy explanation**: Ctrl+C when popup is focused

---

**Need more help?** 
- Check the main [README.md](README.md) for technical details
- Review [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for specific issues
- Create an issue on GitHub for support 