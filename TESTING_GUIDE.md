# Testing Guide for Enhanced Features

## Latest Update - Four Major Enhancements

### 1. Row and Column Numbering Display (1-based indexing)
### 2. Direct Label Printing with Optimized Styles
### 3. Consolidated Configuration Interface
### 4. Removed Visual Margin Diagram

## Previous Updates
### 5. Save and Load Configuration Presets
### 6. Improved Margin Labels with Visual Indicators
### 7. Fine-tuned Number Input Step Values (0.1mm precision)

---

## New Features Testing (Latest Update)

### 1. Row and Column Numbering Display

**Test Steps:**
1. Open the application (http://localhost:5173)
2. Load sample employee data
3. Observe the preview area - you should see:
   - Column numbers (1, 2, 3, etc.) at the top of the preview
   - Row numbers (1, 2, 3, etc.) on the left side of the preview
4. Change the label layout (rows/columns) and verify numbers update
5. Test with different zoom levels - numbers should scale appropriately

**Expected Results:**
- Numbers use 1-based indexing (start from 1, not 0)
- Column numbers align with label columns
- Row numbers align with label rows
- Numbers are visible on screen but hidden in print (screen-only class)
- Numbers use monospace font for consistent alignment

### 2. Direct Label Printing

**Test Steps:**
1. Configure some labels with employee data
2. Click the "Print" button
3. A new window should open with optimized print layout
4. The print window should include:
   - Row and column numbers for reference
   - Exact label positioning
   - Optimized print styles
5. Use browser's print function to print or save as PDF
6. Compare with the screen preview for accuracy

**Expected Results:**
- Print window opens automatically
- Print layout matches screen preview exactly
- Row/column numbers included in print for reference
- High-quality output with proper font rendering
- Page breaks work correctly for multi-page layouts

### 3. Consolidated Configuration Interface

**Test Steps:**
1. Look for the single "Configuration" panel (no separate preset manager)
2. At the top, find the "Configuration Preset" dropdown
3. Test preset management:
   - Click the save icon (💾) to save current settings
   - Use the dropdown to switch between presets
   - Click export button (⬇️) to download presets
   - Click import button (⬆️) to upload preset files
4. Verify all tabs (Layout, Position, Style) work within the unified interface

**Expected Results:**
- Single, clean configuration interface
- All preset functionality accessible from the main config panel
- Save/load/export/import all work seamlessly
- No duplicate or separate preset manager section

### 4. Visual Margin Diagram Removal

**Test Steps:**
1. Go to Layout tab → Margins section
2. Verify the visual diagram with page representation is removed
3. Confirm the cross-pattern input layout remains:
   - Top margin input at the top
   - Left and Right inputs on the sides
   - Bottom margin input at the bottom
4. Check that Arabic/English labels are still present

**Expected Results:**
- No visual diagram with page representation
- Cross-pattern layout preserved and functional
- Bilingual labels (Arabic/English) still displayed
- Clean, simplified interface without visual clutter

---

## 1. Configuration Presets Testing

### Test Steps:
1. Open the application (http://localhost:5173)
2. Look for the new "Configuration Presets" panel above the main configuration
3. Configure some custom settings (margins, label size, etc.)
4. Click "Save Current" to save as a new preset
5. Enter a name like "My Custom Layout" and save
6. Change some settings, then select your saved preset from the dropdown
7. Test export/import functionality:
   - Click "Export All" to download presets as JSON
   - Modify some settings and save another preset
   - Click "Import" and select the exported JSON file

### Expected Results:
- Presets save and load correctly
- Settings are restored exactly as saved
- Export/import works without data loss
- Built-in presets cannot be deleted
- Custom presets can be deleted with confirmation

---

## 2. Enhanced Margin Interface Testing

### Test Steps:
1. Go to the "Layout" tab in configuration
2. Look for the new "Margins (mm) - الهوامش" section
3. Observe the visual diagram showing page layout with margin indicators
4. Test the cross-pattern input layout:
   - Top margin input at the top
   - Left and Right margin inputs on the sides
   - Bottom margin input at the bottom
   - Visual "Page" representation in the center
5. Try changing margin values and observe the preview updates

### Expected Results:
- Visual diagram clearly shows which margin is which
- Arabic labels are displayed alongside English
- Cross-pattern layout is intuitive and matches physical page layout
- All margin inputs work with 0.1mm precision
- Preview updates immediately when margins change

---

## 3. Precision Input Testing (0.1mm Steps)

### Test Steps:
1. Test all measurement inputs for 0.1mm precision:
   - Page dimensions (when Custom is selected)
   - All margin inputs (Top, Bottom, Left, Right)
   - Label width and height
   - Horizontal and vertical spacing
2. Use keyboard arrow keys to increment/decrement values
3. Use mouse to click the up/down arrows on number inputs
4. Manually type decimal values like "10.5" or "25.3"

### Expected Results:
- All measurement inputs accept decimal values
- Arrow keys change values by 0.1mm increments
- Mouse clicks on input arrows change by 0.1mm
- Values display with appropriate decimal precision
- Preview updates smoothly with fine adjustments

---

## Previous Features (Still Working)

## 4. Font Size Bug Fix

### Test Steps:
1. Open the application in your browser (http://localhost:5173)
2. Click "Load Sample Data" to add some employee IDs
3. Go to the "Style" tab in the configuration panel
4. Change the "Font Size (pt)" value from 12 to 18
5. Observe the preview - the text should become larger
6. Change it to 8 - the text should become smaller
7. Try printing or exporting to PDF to verify the font size is applied

### Expected Result:
- Font size changes should be immediately visible in the preview
- The actual printed/exported labels should reflect the font size changes

## 2. Starting Position Feature

### Test Steps:
1. Go to the new "Position" tab in the configuration panel
2. Set "Start Row" to 2 and "Start Column" to 1
3. Observe the preview - labels should start from the 3rd row, 2nd column (0-based indexing)
4. Check the "Position Grid Preview" - it should show the starting position marked with "S"
5. The "Available positions" count should be reduced accordingly

### Expected Result:
- Labels should skip the specified rows and columns from the top-left
- The grid preview should visually show which positions are skipped (gray)
- Available position count should be accurate

## 3. Resume Printing on Partially Used Sheets

### Test Steps:
1. In the "Position" tab, enter used positions in the "Used Positions" field
2. Try these formats:
   - `0,0; 0,1; 1,0` (semicolon separated)
   - `0-0, 0-1, 1-0` (comma separated with dashes)
3. Observe the position grid preview - used positions should appear in red
4. Check that labels avoid these positions in the preview
5. Combine with starting position (e.g., Start Row: 1, Start Column: 0, Used: "1,1; 1,2")

### Expected Result:
- Used positions should be marked in red in the grid preview
- Labels should not be placed on used positions
- The combination of starting position and used positions should work correctly

## 4. Visual Preview Enhancements

### Test Steps:
1. With starting position and/or used positions configured
2. Look at the main preview area
3. You should see:
   - Dashed gray outlines for skipped positions (labeled "Skip")
   - Dashed red outlines for used positions (labeled "Used")
   - Actual labels only in available positions

### Expected Result:
- Clear visual distinction between available, skipped, and used positions
- Labels only appear in available positions
- Grid overlay helps understand the layout

## 5. Integration Test

### Complete Workflow Test:
1. Load sample employee data
2. Configure a custom layout (e.g., 4x6 labels)
3. Set starting position to row 2, column 1
4. Mark positions "2,2; 3,1; 3,3" as used
5. Adjust font size to 14pt
6. Preview the result
7. Export to PDF
8. Print the labels

### Expected Result:
- All features should work together seamlessly
- PDF export should respect all settings
- Print output should match the preview

## Troubleshooting

### If font size doesn't work:
- Check browser developer tools for CSS conflicts
- Ensure the span element inherits font size correctly

### If starting position doesn't work:
- Verify the position calculation logic
- Check that the grid generation is correct

### If used positions aren't recognized:
- Try different input formats
- Check the parsing function for edge cases

### If preview doesn't match print:
- Ensure print styles are correctly applied
- Check that screen-only elements are hidden in print mode
