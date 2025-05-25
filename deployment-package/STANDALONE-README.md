# Employee Label Printer - Standalone Version

## 🎯 Overview

This is a **standalone HTML version** of the Employee Label Printer that runs directly in your browser **without requiring Node.js, Python, or any server installation**. Simply open the HTML file and start printing labels!

## ✨ Features

### Core Functionality
- **No Installation Required**: Runs directly from a single HTML file
- **Employee ID Input**: Enter IDs manually or import from CSV files
- **Live Preview**: Real-time preview with zoom controls
- **Flexible Layout**: Customizable page margins, label dimensions, and spacing
- **Direct Printing**: Print directly from the browser
- **Bilingual Interface**: Arabic and English labels support

### Advanced Features
- **0.1mm Precision**: Exact measurements for professional label alignment
- **Multiple Paper Sizes**: A4, Letter, Legal, and custom sizes
- **Label Presets**: Quick setup for common label sheets
- **Position Control**: Skip used positions, set starting positions
- **Style Customization**: Fonts, colors, alignment, borders
- **CSV Import**: Drag-and-drop CSV file support
- **Keyboard Shortcuts**: Quick navigation and actions

## 🚀 How to Use

### Method 1: Direct File Opening
1. Download the `standalone-app.html` file
2. Double-click the file to open it in your default browser
3. Start entering employee IDs or upload a CSV file
4. Configure your label settings
5. Preview and print!

### Method 2: From Deployment Package
1. Open `DIRECT-ACCESS.html` in your browser
2. Click "🚀 Open Standalone Version (Recommended)"
3. The application will open in a new tab

## 📋 Quick Start Guide

### 1. Adding Employee IDs
- **Manual Entry**: Type employee IDs in the text area (one per line or comma-separated)
- **CSV Upload**: Drag and drop a CSV file or click to select
- **Sample Data**: Click "📝 Load Sample" to test with sample employee IDs

### 2. Configuring Labels
Use the three configuration tabs:

#### 📐 Layout Tab
- **Paper Size**: Choose from A4, Letter, Legal, or Custom
- **Label Dimensions**: Set width and height in millimeters
- **Spacing**: Configure horizontal and vertical spacing
- **Margins**: Set page margins (top, bottom, left, right)

#### 🎨 Style Tab
- **Font Settings**: Size, family, weight, alignment
- **Colors**: Text and background colors
- **Text Formatting**: Add prefix/suffix to employee IDs

#### 📍 Position Tab
- **Starting Position**: Skip rows/columns from the top-left
- **Used Positions**: Mark positions to skip (format: row,col)
- **Calculated Info**: View labels per row/column and total per page

### 3. Preview and Print
- **Navigation**: Use Previous/Next buttons or arrow keys
- **Zoom**: Use zoom controls or +/- keys
- **Print**: Click the print button or press Ctrl+P

## 🎯 CSV File Format

Your CSV file should have employee IDs in one of these column headers:
- `employee_id`
- `emp_id` 
- `id`
- `employee`
- `empid`

Example CSV:
```csv
employee_id,name,department
EMP001,John Doe,IT
EMP002,Jane Smith,HR
EMP003,Bob Johnson,Finance
```

## ⌨️ Keyboard Shortcuts

- **Ctrl+P**: Print labels
- **Ctrl+R**: Reset to defaults
- **Arrow Left/Right**: Navigate between pages
- **+/-**: Zoom in/out
- **Tab**: Navigate between form fields

## 🔧 Configuration Tips

### Common Label Sizes
- **Avery 5160**: 66.7 × 25.4 mm (3×10 per page)
- **Avery 5161**: 101.6 × 25.4 mm (2×10 per page)
- **Avery 5162**: 101.6 × 33.9 mm (2×7 per page)

### Best Practices
1. **Test First**: Always print a test page on plain paper
2. **Measure Twice**: Verify label dimensions with a ruler
3. **Check Alignment**: Use the grid preview to ensure proper positioning
4. **Save Settings**: Note down your working configuration for future use

## 🌍 Browser Compatibility

This standalone version works in all modern browsers:
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 🔒 Privacy & Security

- **No Data Collection**: All processing happens locally in your browser
- **No Internet Required**: Works completely offline
- **No Server Communication**: Your data never leaves your computer
- **File Access**: Only accesses files you explicitly select

## 🆘 Troubleshooting

### Common Issues

**Labels not aligning properly:**
- Check your printer settings (no scaling, actual size)
- Verify label dimensions match your physical labels
- Adjust margins if needed

**CSV import not working:**
- Ensure your CSV has proper headers
- Check that employee IDs are in the first few columns
- Verify the file is saved as CSV format

**Printing issues:**
- Use Chrome or Firefox for best printing results
- Set printer to "Actual Size" or "100%" scale
- Check page orientation matches your settings

**Performance with large datasets:**
- The app can handle thousands of employee IDs
- For very large datasets (10,000+), consider splitting into smaller batches

### Browser-Specific Notes

**Chrome**: Best overall compatibility and printing quality
**Firefox**: Good compatibility, may need print scaling adjustment
**Safari**: Works well on macOS, some CSS differences
**Edge**: Full compatibility with Windows printing

## 📞 Support

If you encounter any issues:
1. Try refreshing the page
2. Check browser console for error messages
3. Test with a smaller dataset
4. Try a different browser

## 🔄 Updates

This standalone version includes all the core functionality of the full application. For the latest features and updates, check the main project repository.

---

**Version**: Standalone 1.0  
**Last Updated**: 2024  
**Compatibility**: All modern browsers  
**Requirements**: None (runs directly in browser)
