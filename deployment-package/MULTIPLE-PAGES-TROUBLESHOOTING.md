# 🔍 Multiple Pages Troubleshooting Guide

## ❓ Why Am I Getting Multiple Pages?

If your employee data doesn't fill one page but the application is creating multiple pages, here are the most common reasons and solutions:

---

## 🎯 Common Causes

### 1. **Starting Position Settings**
**Problem**: You've set a starting row/column that reduces available space on the first page.

**Example**: 
- Total positions per page: 30 (3×10)
- Starting position: Row 5, Column 1
- Available on first page: Only 18 positions
- If you have 25 employees → Creates 2 pages

**Solution**: 
- Go to **Position Tab**
- Set **Start Row** to `0`
- Set **Start Column** to `0`

### 2. **Used Positions**
**Problem**: You've marked positions as "used" which reduces available space.

**Example**:
- Total positions: 30
- Used positions: `0,0 0,1 1,0` (3 positions)
- Available: 27 positions
- If you have 28 employees → Creates 2 pages

**Solution**:
- Go to **Position Tab**
- Clear the **Used Positions** field
- Or remove unnecessary used positions

### 3. **Incorrect Label Dimensions**
**Problem**: Label dimensions are too large for the page, reducing labels per page.

**Example**:
- Page: A4 (210×297mm)
- Label size: 100×50mm (too large)
- Result: Only 4 labels per page instead of expected 30

**Solution**:
- Go to **Layout Tab**
- Check **Label Width** and **Label Height**
- Use standard sizes like 50×25mm for Avery labels

### 4. **Large Margins**
**Problem**: Page margins are too large, reducing available space.

**Example**:
- Large margins (50mm each side)
- Reduces effective page area
- Fewer labels fit per page

**Solution**:
- Go to **Layout Tab**
- Reduce margins to 10-15mm
- Standard margins: Top/Bottom: 10mm, Left/Right: 10mm

---

## 🔧 Quick Fixes

### **Reset to Defaults**
1. Click **🔄 Reset to Defaults** button
2. This will restore optimal settings
3. Re-enter your employee IDs

### **Check Distribution Info**
1. Look for the **Label Distribution** section
2. It shows exactly why multiple pages were created
3. Follow the specific guidance provided

### **Optimize Settings**
1. **Layout Tab**:
   - Paper Size: A4 (210×297mm)
   - Label Size: 50×25mm (standard)
   - Spacing: 5mm horizontal, 3mm vertical
   - Margins: 10mm all around

2. **Position Tab**:
   - Start Row: 0
   - Start Column: 0
   - Used Positions: (leave empty)

---

## 📊 Expected Results

### **Standard A4 with 50×25mm Labels**
- **Labels per row**: 3
- **Labels per column**: 10
- **Total per page**: 30 labels
- **For 30 employees**: 1 page
- **For 60 employees**: 2 pages

### **If You're Getting Unexpected Results**
Check these calculations:
1. Available width = Page width - Left margin - Right margin
2. Available height = Page height - Top margin - Bottom margin
3. Labels per row = Available width ÷ (Label width + Horizontal spacing)
4. Labels per column = Available height ÷ (Label height + Vertical spacing)

---

## 🎯 Step-by-Step Diagnosis

### **Step 1: Check Basic Settings**
1. Go to **Layout Tab**
2. Verify:
   - Paper Size: A4
   - Label Width: 50mm
   - Label Height: 25mm
   - All margins: 10mm

### **Step 2: Check Position Settings**
1. Go to **Position Tab**
2. Verify:
   - Start Row: 0
   - Start Column: 0
   - Used Positions: (empty)

### **Step 3: Check Calculated Info**
1. Look at the status bar showing:
   - Labels per row
   - Labels per column
   - Total per page
2. This should match your expectations

### **Step 4: Check Distribution Info**
1. If multiple pages appear, check the **Label Distribution** section
2. It will explain exactly why multiple pages were created

---

## 💡 Pro Tips

### **For Maximum Labels Per Page**
- Use smallest possible margins (5-10mm)
- Use optimal label spacing (3-5mm)
- Start from position 0,0
- Don't mark positions as used unless necessary

### **For Specific Label Sheets**
- Measure your actual label sheets
- Input exact dimensions
- Test print on plain paper first
- Adjust margins for perfect alignment

### **For Partial Sheets**
- If you want to use only part of a sheet
- Set appropriate starting position
- Mark used positions if some labels are already used

---

## 🆘 Still Having Issues?

### **Debug Information**
The application now shows detailed information about:
- Why multiple pages were created
- Available positions per page
- Starting position effects
- Used position impacts

### **Common Solutions**
1. **Too many pages**: Reduce margins, increase page size, or decrease label size
2. **Labels don't fit**: Check if label dimensions match your actual labels
3. **Unexpected layout**: Reset to defaults and start over

### **Contact Information**
If you're still having issues:
1. Note the settings you're using
2. Count your employee IDs
3. Check the Distribution Info details
4. Try the Reset to Defaults option

---

**Remember**: The most common cause is having a starting position other than 0,0 or having used positions marked when they're not actually needed.
