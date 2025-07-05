# 🔧 Explanium Troubleshooting Guide

## 🚨 Issue: Extension popup not showing when selecting text

Follow these steps in order to identify and fix the problem:

## Step 1: Basic Checks ✅

### 1.1 Extension Status
1. Go to `chrome://extensions/`
2. Find "Explanium - Instant Text Explainer"
3. Verify it shows **"ON"** toggle (blue/enabled)
4. Check if there are any error messages in red

### 1.2 API Key Configuration
1. **Click the Explanium extension icon** in toolbar
2. **Check connection status**:
   - ✅ **Green**: "API key configured! Gemma-3-1b-it model ready"
   - ❌ **Red**: "No API key configured" or "Invalid API key"
3. If red, enter your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 1.3 Page Refresh
1. **Refresh the webpage** where you're testing
2. Extensions only work on pages loaded AFTER they're installed/enabled
3. Test on a simple webpage first (like Wikipedia)

### 1.4 Extension Settings
1. **Click the Explanium extension icon** in toolbar
2. Verify settings:
   - ✅ **Enable Extension**: Should be ON
   - ✅ **Auto-explain**: Should be ON
   - ❌ **Show on Long Text**: Can be OFF for testing

## Step 2: Test Page 🧪

1. **Open the test page**: `debug-check.html` in the extension folder
2. Or go to any simple webpage (like Wikipedia)
3. Try selecting these simple terms:
   - `API`
   - `CEO`
   - `machine learning`
   - `25%`

## Step 3: Check Browser Console 🔍

1. **Open Developer Tools**: Press `F12`
2. Go to **Console** tab
3. **Refresh the page**
4. Look for these messages:

### ✅ Expected Messages (Good):
```
🌐 Explanium content script loaded and available globally
🚀 Explanium content script initializing...
📋 Loaded settings from storage: {enabled: true, autoExplain: true, longText: false}
✅ Explanium content script initialized successfully
[Background] Background script loaded and listener is active.
```

### ❌ Problem Messages (Bad):
```
Content script loading error
Extension context invalidated
Failed to load API key
Network error
```

### 🧪 When Selecting Text:
```
👆 Text selection event triggered
📝 Selected text: API
📏 Text length: 3
✅ Text valid, creating popup...
📊 Selection stored with timestamp: {text: "API...", rect: {...}}
🔄 Creating loading popup...
📍 Popup positioned at: {left: 100, top: 200, ...}
✅ Loading popup created and positioned
🤖 Requesting explanation for: API
[Background] Received message type: EXPLAIN_TEXT
[Background] Sending request to Gemma-3-1b-it API...
[Background] Received response from Gemma-3-1b-it API
[Background] Explanation result: Success
📡 Background response: {success: true, explanation: "..."}
✅ Showing explanation: Application Programming Interface...
💡 Showing explanation popup...
```

## Step 4: Common Issues & Fixes 🛠️

### Issue: "No API key configured" error
**Problem**: Missing or invalid API key
**Fix**: 
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key (should start with "AIza")
3. Copy and paste into extension settings
4. Click "Save API Key"

### Issue: "Invalid API key" error
**Problem**: API key format is wrong or expired
**Fix**:
1. Verify API key format (starts with "AIza" and is ~40 characters)
2. Check API key status at [Google AI Studio](https://aistudio.google.com/app/apikey)
3. Generate a new API key if needed
4. Ensure no extra spaces when copying

### Issue: "API rate limit exceeded" error
**Problem**: Too many requests in short time
**Fix**:
1. Wait 1-2 minutes before trying again
2. Check your API usage at [Google AI Studio](https://aistudio.google.com/app/apikey)
3. Free tier limits: 15 requests/minute, 1500 requests/day

### Issue: Popup appears in wrong position
**Problem**: Positioning calculation error
**Fix**:
1. Try different text on the page
2. Check browser zoom level (works best at 100%)
3. Scroll to different positions and test
4. Refresh page and try again

### Issue: "Extension context invalidated" error
**Problem**: Extension was reloaded while page was open
**Fix**:
1. Refresh the webpage
2. Extension needs page reload after updates

### Issue: No console messages at all
**Problem**: Content script not loading
**Fix**: 
1. Disable and re-enable the extension
2. Reload the extension in `chrome://extensions/`
3. Refresh the webpage

### Issue: Network error
**Problem**: Internet connection or API server issues
**Fix**:
1. Check internet connection
2. Try again in a few minutes
3. Check Google's API status page
4. Verify firewall/proxy settings

## Step 5: Manual Testing 🧪

Try this in the browser console to manually test:

```javascript
// Check if content script is loaded
console.log('Explanium loaded:', !!window.explanium);

// Check settings
console.log('Settings:', window.explanium?.settings);

// Check current selection
console.log('Current selection:', window.explanium?.currentSelection);

// Manually trigger explanation
window.explanium?.requestExplanation('API');

// Check if popup exists
console.log('Popup exists:', !!document.querySelector('.explanium-popup'));

// Test API key status
chrome.runtime.sendMessage({type: 'GET_STATUS'}, (response) => {
  console.log('API Status:', response);
});
```

## Step 6: Context Menu Testing 🖱️

If auto-explain isn't working, try the context menu:

1. **Select any text** on a webpage
2. **Right-click** on the selected text
3. **Choose "Explain with Explanium"** from the menu
4. Popup should appear with explanation

If context menu doesn't appear:
1. Check if text is actually selected
2. Try different text
3. Refresh page and try again

## Step 7: Reset Extension 🔄

If nothing works:

1. **Export your API key** (copy it somewhere safe)
2. **Disable extension** in `chrome://extensions/`
3. **Clear extension data**:
   - Right-click extension → "Remove"
   - Or clear in `chrome://settings/content/all` → find extension storage
4. **Reload extension** (Load unpacked again)
5. **Re-enter API key** and test

## Step 8: Browser-Specific Issues 🌐

### Chrome/Chromium (Recommended):
- Should work out of the box
- Ensure version 88+ for Manifest V3 support

### Microsoft Edge:
- Enable "Allow extensions from other stores"
- May need to reload extension after first install

### Brave Browser:
- Disable "Shields" on test pages
- Check privacy settings that might block API calls

### Opera:
- Enable "Install Chrome extensions"
- May need developer mode

### Firefox/Safari:
- **Not supported** - Extension uses Chrome-specific APIs

## API-Specific Troubleshooting 🔑

### Free Tier Limits:
- **15 requests per minute**
- **1500 requests per day**
- **Rate limiting**: Wait if you hit limits

### API Key Issues:
- **Format**: Should start with "AIza" and be ~40 characters
- **Permissions**: Ensure API key has Gemini API access
- **Quotas**: Check usage at [Google AI Studio](https://aistudio.google.com/app/apikey)

### Common API Errors:
- **401 Unauthorized**: Invalid API key
- **429 Too Many Requests**: Rate limit exceeded
- **400 Bad Request**: Invalid request format
- **500 Server Error**: Google's server issues

## Expected Results ✅

When working correctly:
1. **Select text** → Console shows selection events
2. **Popup appears** within 1-3 seconds below selected text
3. **Explanation loads** with clean, formatted text
4. **Copy button works** to copy explanation
5. **Close button** or clicking outside closes popup

## Performance Optimization 🚀

If extension feels slow:
1. **Shorter text**: Try explaining shorter phrases
2. **Network speed**: Check internet connection
3. **API server load**: Google's servers might be busy
4. **Browser performance**: Close unnecessary tabs

## Get Help 💬

If still not working, please share:
1. **Browser type and version** (Chrome 88+ required)
2. **Console error messages** (copy/paste from F12 console)
3. **Extension settings screenshot**
4. **API key status** (configured/not configured, don't share actual key)
5. **Which text you're trying to select**
6. **Steps you've already tried**

### Common Error Messages:

**"Extension context invalidated"**
→ Refresh the webpage

**"No API key configured"**
→ Add API key in extension settings

**"API rate limit exceeded"**
→ Wait 1-2 minutes, check usage limits

**"Network error"**
→ Check internet connection

**"Invalid API key"**
→ Verify API key format and permissions

The debugging logs will help identify exactly where the issue is occurring! 