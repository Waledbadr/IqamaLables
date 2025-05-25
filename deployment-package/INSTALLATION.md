# Employee Label Printer - Installation Guide

## 📦 **Complete Deployment Package**

This package contains everything needed to run the Employee Label Printer application on any computer.

## 🎯 **What You Get**

✅ **Production-ready application** - Optimized for performance  
✅ **Multiple server options** - Node.js and Python servers included  
✅ **Cross-platform support** - Windows, macOS, and Linux  
✅ **Automatic browser opening** - Launches your default browser  
✅ **Network sharing** - Access from multiple computers  
✅ **Offline operation** - No internet required after setup  

## 🚀 **Quick Installation**

### Option 1: Node.js Server (Recommended)

**Requirements**: Node.js 14.0.0 or higher

**Windows:**
1. Download and install Node.js from https://nodejs.org/
2. Extract this package to any folder
3. Double-click `start-app.bat`
4. Application opens at http://localhost:3000

**Linux/macOS:**
1. Install Node.js: `sudo apt install nodejs npm` (Ubuntu) or `brew install node` (macOS)
2. Extract this package to any folder
3. Run: `chmod +x start-app.sh && ./start-app.sh`
4. Application opens at http://localhost:3000

### Option 2: Python Server (Alternative)

**Requirements**: Python 3.6 or higher

**Windows:**
1. Download and install Python from https://www.python.org/downloads/
2. ✅ **Important**: Check "Add Python to PATH" during installation
3. Extract this package to any folder
4. Double-click `start-app-python.bat`
5. Application opens at http://localhost:3000

**Linux/macOS:**
1. Python is usually pre-installed. Check with: `python3 --version`
2. Extract this package to any folder
3. Run: `cd deployment-package/server && python3 python-server.py`
4. Application opens at http://localhost:3000

## 📁 **Package Contents**

```
deployment-package/
├── app/                    # Production application files
│   ├── index.html         # Main application
│   ├── assets/            # CSS, JavaScript, and other assets
│   └── vite.svg          # Application icon
├── server/                # Server files
│   ├── server.js          # Node.js server
│   ├── python-server.py   # Python server
│   └── package.json       # Node.js configuration
├── start-app.bat          # Windows launcher (Node.js)
├── start-app.sh           # Linux/Mac launcher (Node.js)
├── start-app-python.bat   # Windows launcher (Python)
├── README.md              # User guide
└── INSTALLATION.md        # This file
```

## 🔧 **Detailed Installation Steps**

### Step 1: Choose Your Runtime

**Node.js (Recommended)**
- ✅ Better performance
- ✅ More features
- ✅ Automatic browser opening
- ❌ Requires Node.js installation

**Python**
- ✅ Usually pre-installed on Linux/Mac
- ✅ Simple setup
- ✅ Good compatibility
- ❌ Slightly slower than Node.js

### Step 2: Install Runtime (if needed)

**Installing Node.js:**

*Windows:*
1. Go to https://nodejs.org/
2. Download the LTS version
3. Run the installer
4. Accept all defaults
5. Restart your computer

*Ubuntu/Debian:*
```bash
sudo apt update
sudo apt install nodejs npm
```

*CentOS/RHEL:*
```bash
sudo yum install nodejs npm
```

*macOS:*
```bash
# Using Homebrew
brew install node

# Or download from https://nodejs.org/
```

**Installing Python:**

*Windows:*
1. Go to https://www.python.org/downloads/
2. Download Python 3.8 or higher
3. ✅ **IMPORTANT**: Check "Add Python to PATH"
4. Run the installer
5. Restart your computer

*Linux:* Usually pre-installed, check with `python3 --version`

*macOS:* Usually pre-installed, or install with `brew install python3`

### Step 3: Extract and Run

1. **Extract** the deployment package to your desired location
   - Example: `C:\LabelPrinter\` (Windows)
   - Example: `/home/user/LabelPrinter/` (Linux)
   - Example: `/Users/username/LabelPrinter/` (macOS)

2. **Run** the appropriate launcher:
   - Windows + Node.js: Double-click `start-app.bat`
   - Windows + Python: Double-click `start-app-python.bat`
   - Linux/Mac + Node.js: Run `./start-app.sh`
   - Linux/Mac + Python: Run `python3 server/python-server.py`

3. **Access** the application:
   - Browser should open automatically
   - If not, go to http://localhost:3000

## 🌐 **Network Access**

To share the application with other computers on your network:

1. **Start the application** using any method above
2. **Find your IP address**:
   - Windows: Run `ipconfig` in Command Prompt
   - Linux/Mac: Run `ip addr show` or `ifconfig`
3. **Share the URL**: `http://YOUR_IP_ADDRESS:3000`
   - Example: `http://192.168.1.100:3000`

## 🛠 **Troubleshooting**

### "Node.js is not installed"
- Download from https://nodejs.org/
- Restart your computer after installation
- Try the Python server as an alternative

### "Python is not installed"
- Download from https://www.python.org/downloads/
- Make sure to check "Add Python to PATH"
- Restart your computer after installation

### "Port 3000 is already in use"
- Close other applications using port 3000
- Or use a different port:
  - Node.js: `PORT=3001 node server/server.js`
  - Python: `PORT=3001 python3 server/python-server.py`

### Application won't load
- Check your firewall settings
- Try a different browser (Chrome, Firefox, Edge)
- Clear your browser cache (Ctrl+F5)

### Printing issues
- Ensure your printer is connected and working
- Update your printer drivers
- Try printing from a different browser
- Check your browser's print settings

## 🔒 **Security Notes**

- ✅ **Local operation**: All data stays on your computer
- ✅ **No internet required**: Works completely offline
- ✅ **No data collection**: No information is sent anywhere
- ✅ **Safe to use**: Standard web technologies only

## 📱 **Browser Compatibility**

**Fully Supported:**
- Google Chrome 90+
- Mozilla Firefox 88+
- Microsoft Edge 90+
- Safari 14+ (macOS)

**Limited Support:**
- Internet Explorer (not recommended)
- Older browser versions

## 📞 **Getting Help**

1. **Check this guide** for common solutions
2. **Try both server options** (Node.js and Python)
3. **Test with different browsers**
4. **Check system requirements**
5. **Contact your IT support** if issues persist

## 🎉 **You're Ready!**

Once installed, you can:
- ✅ Create custom label layouts
- ✅ Import employee data from CSV files
- ✅ Print labels directly or export to PDF
- ✅ Save and share configuration presets
- ✅ Use the application offline
- ✅ Share with other computers on your network

**Happy label printing!** 🏷️
