# 🔧 Explanium Troubleshooting Guide

## 🚨 Issue: Extension popup not showing when selecting text

Follow these steps in order to identify and fix the problem:

## Step 1: Basic Checks ✅

### 1.1 Extension Status
1. Go to `chrome://extensions/`
2. Find "Explanium - Instant Text Explainer"
3. Verify it shows **"ON"** toggle (blue/enabled)
4. Check if there are any error messages in red

### 1.2 Page Refresh
1. **Refresh the webpage** where you're testing
2. Extensions only work on pages loaded AFTER they're installed/enabled
3. Test on a simple webpage first (like Wikipedia)

### 1.3 Extension Settings
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
⚙️ Settings loaded: {enabled: true, autoExplain: true, longText: false}
✅ Explanium content script initialized successfully
```

### ❌ Problem Messages (Bad):
```
Content script loading error
Extension context invalidated
```

### 🧪 When Selecting Text:
```
👆 Text selection event triggered
📝 Selected text: API
📏 Text length: 3
✅ Text valid, creating popup...
🔄 Creating loading popup...
✅ Loading popup created and positioned
🤖 Requesting explanation for: API
📨 Background received message: {action: "explainText", text: "API"}
🤖 Processing text explanation request for: API
✅ Sending explanation response: {success: true, explanation: "...", source: "enhanced-model"}
📡 Background response: {success: true, explanation: "...", source: "enhanced-model"}
✅ Showing explanation: Application Programming Interface...
💡 Showing explanation popup...
✅ Explanation popup updated with content
```

## Step 4: Common Issues & Fixes 🛠️

### Issue: No console messages at all
**Problem**: Content script not loading
**Fix**: 
1. Disable and re-enable the extension
2. Reload the extension in `chrome://extensions/`
3. Refresh the webpage

### Issue: "Extension disabled" in console
**Problem**: Settings are turned off
**Fix**:
1. Click extension icon
2. Turn ON "Enable Extension" and "Auto-explain"
3. Refresh webpage

### Issue: "Text too long" message
**Problem**: Selected text over 50 characters with longText disabled
**Fix**:
1. Try shorter text (like "API")
2. Or enable "Show on Long Text" in settings

### Issue: Content script loads but no popup appears
**Problem**: CSS or positioning issue
**Fix**: Check if popup exists but hidden:
1. In console, type: `document.querySelector('.explanium-popup')`
2. If it returns an element, there's a CSS issue
3. Try: `document.querySelector('.explanium-popup').style.zIndex = '99999'`

### Issue: Background script errors
**Problem**: Communication failure
**Fix**:
1. Check service worker in `chrome://extensions/`
2. Click "service worker" link to see errors
3. Reload extension if needed

## Step 5: Manual Testing 🧪

Try this in the browser console to manually test:

```javascript
// Check if content script is loaded
console.log('Explanium loaded:', !!window.explanium);

// Check settings
window.explanium?.settings

// Manually trigger explanation
window.explanium?.requestExplanation('API');

// Check if popup exists
document.querySelector('.explanium-popup');
```

## Step 6: Reset Extension 🔄

If nothing works:

1. **Disable extension** in `chrome://extensions/`
2. **Clear extension data**:
   - Right-click extension → "Remove"
   - Or clear in `chrome://settings/content/all` → find extension storage
3. **Reload extension** (Load unpacked again)
4. **Test on a fresh webpage**

## Step 7: Browser-Specific Issues 🌐

### Chrome/Chromium:
- Should work out of the box
- Check for strict security settings

### Microsoft Edge:
- Enable "Allow extensions from other stores"
- May need to reload extension after first install

### Brave Browser:
- Disable "Shields" on test pages
- Check privacy settings

### Opera:
- Enable "Install Chrome extensions"
- May need developer mode

## Expected Results ✅

When working correctly:
1. Select text → Console shows selection events
2. Popup appears within 1 second
3. Explanation loads with "[Enhanced AI Model]" tag
4. Popup has close button and proper styling

## Get Help 💬

If still not working, please share:
1. **Browser type and version**
2. **Console error messages** (copy/paste)
3. **Extension settings screenshot**
4. **Which text you're trying to select**

The debugging logs will help identify exactly where the issue is occurring! 