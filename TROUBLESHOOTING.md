# 🛠️ Explanium Troubleshooting Guide

Complete troubleshooting guide for common issues and solutions.

## 🚨 Quick Fixes (Try These First)

### 1. Extension Not Working At All
1. **Go to `chrome://extensions/`**
2. **Find "Explanium"** in the list
3. **Make sure it's enabled** (toggle switch is ON)
4. **Try reloading the extension** (click refresh icon)
5. **Refresh your webpage** and try again

### 2. No Popup Appears
1. **Check if text is selectable** (try selecting with mouse first)
2. **Verify extension is enabled** in `chrome://extensions/`
3. **Click the extension icon** and check API key status
4. **Try different text** (avoid images, videos, or buttons)
5. **Refresh the webpage** and try again

### 3. API Key Issues
1. **Get a new API key** from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **Copy the full key** (starts with "AIza...")
3. **Paste in extension settings** and click "Save API Key"
4. **Look for green checkmark** showing "API key configured!"

## 📋 Detailed Troubleshooting

### 🔧 Installation Issues

#### Problem: Extension Won't Install
**Chrome Web Store Version:**
- **Check Chrome version**: Requires Chrome 88+ (check `chrome://version/`)
- **Clear browser cache**: Chrome → Settings → Privacy → Clear browsing data
- **Try incognito mode**: Sometimes extensions are disabled in incognito
- **Check permissions**: Ensure you have admin rights to install extensions

**Developer Installation:**
- **Enable Developer Mode**: Toggle in top-right of `chrome://extensions/`
- **Use "Load unpacked"**: Don't use "Pack extension" for development
- **Check folder structure**: Ensure `manifest.json` is in the root folder
- **File permissions**: Make sure Chrome can read all files

#### Problem: Extension Appears But Icon Missing
1. **Check extension list**: Go to `chrome://extensions/`
2. **Pin the extension**: Click puzzle piece icon → pin Explanium
3. **Refresh extension**: Click refresh icon in extension management
4. **Clear Chrome cache**: May help with icon loading

### 🔑 API Configuration Issues

#### Problem: API Key Not Working
**Common Causes:**
- **Wrong API key**: Should start with "AIza" and be about 39 characters
- **API key restrictions**: Check if key has IP/domain restrictions
- **Quota exceeded**: Check usage at [Google AI Studio](https://aistudio.google.com/app/apikey)
- **API not enabled**: Ensure Gemini API is enabled in Google Cloud Console

**Solutions:**
1. **Get fresh API key**: Delete old key, create new one
2. **Check API quotas**: Free tier = 15 requests/minute, 1500/day
3. **Verify permissions**: API key should have Gemini API access
4. **Test with curl**: Verify API key works outside the extension

#### Problem: "API Key Not Configured" Error
1. **Open extension settings**: Click extension icon
2. **Paste API key**: Should be long string starting with "AIza"
3. **Click "Save API Key"**: Don't press Enter, use the button
4. **Wait for confirmation**: Green checkmark should appear
5. **Refresh settings page**: Sometimes needed to see status

### 🖱️ Popup and Selection Issues

#### Problem: Popup Doesn't Appear
**Text Selection Issues:**
- **Try different text**: Some text may not be selectable
- **Avoid multimedia**: Don't select images, videos, or buttons
- **Select with mouse**: Keyboard selection may not trigger popup
- **Check text length**: Very short text (<3 chars) may not work

**Extension Configuration:**
- **Enable auto-explain**: Check settings for "Auto-explain" option
- **API key required**: Popup won't show without configured API key
- **Extension enabled**: Ensure main extension toggle is ON
- **Refresh webpage**: Sometimes needed after changing settings

#### Problem: Popup Appears in Wrong Position
1. **Check zoom level**: Works best at 100% browser zoom
2. **Scroll to see popup**: May appear outside current viewport
3. **Try different text**: Position depends on text location
4. **Check browser size**: Very small windows may cause positioning issues

#### Problem: Popup Disappears Too Quickly
1. **Don't move mouse**: Keep cursor still while popup loads
2. **Click inside popup**: Clicking outside will close it
3. **Use ESC key**: Intentional way to close popup
4. **Check for page updates**: Some sites refresh content automatically

### ⚡ Cache System Issues

#### Problem: Cache Not Working
**Check Cache Status:**
1. **Open extension settings**: Click extension icon
2. **View cache statistics**: Should show size and hit rate
3. **Try "Refresh Stats"**: Update cache information
4. **Clear cache**: Reset if corrupted

**Cache Performance:**
- **Cache size**: 0/5000 indicates empty cache
- **Hit rate**: 0% means cache not being used
- **API calls saved**: Should increase with repeated text
- **⚡ Lightning bolt**: Should appear for cached responses

#### Problem: Cache Taking Too Much Space
1. **Check cache size**: Max 5000 entries, ~10MB storage
2. **Clear cache**: Use "Clear Cache" button in settings
3. **Automatic cleanup**: Cache expires after 7 days
4. **Browser storage**: Check `chrome://settings/content/all` for storage

#### Problem: Cache Hit Rate Low
**Optimization Tips:**
- **Select similar text**: Slight variations use cache
- **Use consistent selections**: Exact matches work best
- **Regular usage**: Cache builds up over time
- **Check text normalization**: Punctuation/spacing doesn't affect cache

### 🌐 Website Compatibility Issues

#### Problem: Doesn't Work on Specific Sites
**Common Problematic Sites:**
- **Gmail/Google Docs**: May have selection restrictions
- **Banking sites**: Often block extension access
- **PDF viewers**: May not support text selection
- **Video sites**: Text in videos not selectable

**Solutions:**
1. **Check site permissions**: Some sites block extensions
2. **Try different text**: Select plain text content
3. **Refresh page**: Sometimes needed for script injection
4. **Check browser console**: Look for JavaScript errors

#### Problem: Slow Performance on Large Pages
1. **Scroll to text**: Large pages may have performance issues
2. **Select smaller text**: Shorter selections process faster
3. **Check cache**: Cached responses are always instant
4. **Close other tabs**: Reduce browser memory usage

### 🔒 Privacy and Security Issues

#### Problem: Concerned About Data Privacy
**What's Sent to Google:**
- **Only selected text**: Nothing else from the page
- **No personal data**: No browsing history or cookies
- **No page content**: Only the specific text you select
- **Encrypted transmission**: All API calls use HTTPS

**What Stays Local:**
- **API key**: Stored only on your device
- **Cache data**: Explanations cached locally
- **Settings**: All preferences stored locally
- **No tracking**: No analytics or user behavior data

#### Problem: Want to Use Without Internet
1. **Cache explanations**: Once cached, work offline
2. **Build cache**: Use online first to cache common text
3. **Check cache size**: Monitor how much is cached
4. **Clear cache**: Reset if taking too much space

### 🚀 Performance Issues

#### Problem: Extension Slowing Down Browser
**Memory Usage:**
- **Typical usage**: <5MB memory
- **Large cache**: Up to 10MB with full cache
- **Background script**: Minimal CPU usage
- **No continuous processing**: Only active during explanations

**Performance Optimization:**
1. **Clear cache**: If using too much memory
2. **Disable auto-explain**: Reduce automatic processing
3. **Close unused tabs**: Free up browser memory
4. **Restart browser**: Clear memory leaks

#### Problem: Very Slow API Responses
**Check These:**
1. **Internet connection**: Slow network affects response time
2. **Google API status**: Check if Google's servers are busy
3. **API quotas**: Rate limiting may slow responses
4. **Text length**: Longer text takes more time
5. **Cache first**: Cached responses are always instant

### 📱 Browser Compatibility

#### Problem: Doesn't Work in My Browser
**✅ Supported Browsers:**
- **Chrome** (v88+) - Full support
- **Microsoft Edge** (Chromium-based) - Full support
- **Brave** - Full support
- **Opera** - Full support
- **Vivaldi** - Full support

**❌ Unsupported Browsers:**
- **Firefox** - Different extension system
- **Safari** - Different extension system
- **Internet Explorer** - Outdated technology

#### Problem: Features Missing in My Browser
1. **Update browser**: Ensure you have latest version
2. **Check compatibility**: Verify Chromium-based browser
3. **Enable extensions**: Some browsers disable extensions by default
4. **Check permissions**: Ensure extension has necessary permissions

### 🛠️ Advanced Troubleshooting

#### Problem: Extension Conflicts
**Check for Conflicts:**
1. **Disable other extensions**: Test with minimal extensions
2. **Check similar extensions**: Other AI or text tools may conflict
3. **Incognito mode**: Test without other extensions
4. **Fresh profile**: Create new Chrome profile for testing

#### Problem: Console Errors
**Check Browser Console:**
1. **Press F12**: Open developer tools
2. **Check Console tab**: Look for red error messages
3. **Reload page**: Fresh load may clear errors
4. **Report errors**: Include console errors in bug reports

#### Problem: Persistent Issues
**Advanced Solutions:**
1. **Reinstall extension**: Remove and reinstall completely
2. **Clear browser data**: Reset all extension data
3. **Check Chrome flags**: Disable experimental features
4. **Update Chrome**: Ensure latest browser version

## 🚨 Error Messages Explained

### "API Key Not Configured"
- **Cause**: No API key entered in settings
- **Solution**: Get API key from Google AI Studio and enter in settings

### "Failed to get explanation"
- **Cause**: API request failed (network, quota, or server error)
- **Solution**: Check internet connection, API key, and quotas

### "Text too long"
- **Cause**: Selected text exceeds 5000 character limit
- **Solution**: Select shorter text (1-200 words recommended)

### "Extension disabled"
- **Cause**: Extension turned off in settings
- **Solution**: Enable extension in chrome://extensions/

### "Cache full"
- **Cause**: Cache reached 5000 entry limit
- **Solution**: Clear cache or wait for automatic cleanup

## 📞 Getting Help

### Before Reporting Issues
1. **Try all quick fixes**: Check the solutions above
2. **Check browser console**: Look for error messages
3. **Test in incognito**: Rule out other extensions
4. **Document the issue**: Note exact steps to reproduce

### Report Issues
- **GitHub Issues**: [Create detailed bug report](https://github.com/Navaneeth-Git/Explanium/issues)
- **Include information**: Browser version, error messages, steps to reproduce
- **Privacy Policy**: [Review data practices](https://navaneeth-git.github.io/Explanium/privacy-policy.html)

### Self-Help Resources
- **[Usage Guide](USAGE.md)**: Comprehensive usage instructions
- **[README](README.md)**: Technical overview and features
- **[Test Results](TEST_RESULTS.md)**: Known working configurations

---

**Most issues can be resolved with these troubleshooting steps!** 🛠️

If you're still having problems, please [create a GitHub issue](https://github.com/Navaneeth-Git/Explanium/issues) with:
- Your browser version
- Exact error messages
- Steps to reproduce the issue
- Screenshots if helpful

**We're here to help!** 🚀 