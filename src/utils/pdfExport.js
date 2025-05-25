import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { mmToPoints } from '../types/index.js';

/**
 * Export labels to PDF using jsPDF
 */
export const exportToPDF = async (labelPages, config, filename = 'employee-labels.pdf') => {
  try {
    const { pageWidth, pageHeight, orientation } = config;
    
    // Create PDF document
    const pdf = new jsPDF({
      orientation: orientation === 'landscape' ? 'l' : 'p',
      unit: 'mm',
      format: [pageWidth, pageHeight],
    });
    
    // Generate each page
    for (let pageIndex = 0; pageIndex < labelPages.length; pageIndex++) {
      if (pageIndex > 0) {
        pdf.addPage();
      }
      
      await addPageToPDF(pdf, labelPages[pageIndex], config);
    }
    
    // Save the PDF
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export PDF: ' + error.message);
  }
};

/**
 * Add a single page of labels to the PDF
 */
const addPageToPDF = async (pdf, page, config) => {
  const {
    fontSize,
    fontFamily,
    fontWeight,
    textAlign,
    textColor,
    backgroundColor,
    borderColor,
    borderWidth,
  } = config;
  
  // Set font
  const fontName = getFontName(fontFamily);
  const fontStyle = fontWeight === 'bold' ? 'bold' : 'normal';
  pdf.setFont(fontName, fontStyle);
  pdf.setFontSize(fontSize);
  
  // Set text color
  const textColorRGB = hexToRgb(textColor);
  pdf.setTextColor(textColorRGB.r, textColorRGB.g, textColorRGB.b);
  
  // Draw each label
  page.labels.forEach(label => {
    drawLabelToPDF(pdf, label, config);
  });
};

/**
 * Draw a single label to the PDF
 */
const drawLabelToPDF = (pdf, label, config) => {
  const { position, dimensions, text } = label;
  const {
    fontSize,
    textAlign,
    backgroundColor,
    borderColor,
    borderWidth,
  } = config;
  
  const x = position.x;
  const y = position.y;
  const width = dimensions.width;
  const height = dimensions.height;
  
  // Draw background if not white
  if (backgroundColor !== '#ffffff' && backgroundColor !== '#FFFFFF') {
    const bgColorRGB = hexToRgb(backgroundColor);
    pdf.setFillColor(bgColorRGB.r, bgColorRGB.g, bgColorRGB.b);
    pdf.rect(x, y, width, height, 'F');
  }
  
  // Draw border
  if (borderWidth > 0) {
    const borderColorRGB = hexToRgb(borderColor);
    pdf.setDrawColor(borderColorRGB.r, borderColorRGB.g, borderColorRGB.b);
    pdf.setLineWidth(borderWidth * 0.352778); // Convert px to mm
    pdf.rect(x, y, width, height, 'S');
  }
  
  // Calculate text position
  const textX = getTextX(x, width, textAlign);
  const textY = y + height / 2 + fontSize * 0.352778 / 3; // Approximate vertical center
  
  // Draw text
  pdf.text(text, textX, textY, {
    align: textAlign,
    maxWidth: width - 2, // Leave some padding
  });
};

/**
 * Get X position for text based on alignment
 */
const getTextX = (labelX, labelWidth, textAlign) => {
  switch (textAlign) {
    case 'left':
      return labelX + 1; // Small padding
    case 'right':
      return labelX + labelWidth - 1; // Small padding
    case 'center':
    default:
      return labelX + labelWidth / 2;
  }
};

/**
 * Convert hex color to RGB
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

/**
 * Map font family names to jsPDF font names
 */
const getFontName = (fontFamily) => {
  const fontMap = {
    'Arial': 'helvetica',
    'Helvetica': 'helvetica',
    'Times New Roman': 'times',
    'Times': 'times',
    'Courier New': 'courier',
    'Courier': 'courier',
  };
  
  return fontMap[fontFamily] || 'helvetica';
};

/**
 * Export labels using html2canvas (alternative method)
 */
export const exportToPDFFromHTML = async (elementId, config, filename = 'employee-labels.pdf') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }
    
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });
    
    const imgData = canvas.toDataURL('image/png');
    const { pageWidth, pageHeight, orientation } = config;
    
    const pdf = new jsPDF({
      orientation: orientation === 'landscape' ? 'l' : 'p',
      unit: 'mm',
      format: [pageWidth, pageHeight],
    });
    
    // Calculate image dimensions to fit page
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(filename);
    
    return true;
  } catch (error) {
    console.error('Error exporting HTML to PDF:', error);
    throw new Error('Failed to export PDF: ' + error.message);
  }
};

/**
 * Generate PDF with multiple pages from HTML elements
 */
export const exportMultiPagePDFFromHTML = async (pageElements, config, filename = 'employee-labels.pdf') => {
  try {
    const { pageWidth, pageHeight, orientation } = config;
    
    const pdf = new jsPDF({
      orientation: orientation === 'landscape' ? 'l' : 'p',
      unit: 'mm',
      format: [pageWidth, pageHeight],
    });
    
    for (let i = 0; i < pageElements.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      
      const canvas = await html2canvas(pageElements[i], {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    }
    
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error exporting multi-page PDF:', error);
    throw new Error('Failed to export PDF: ' + error.message);
  }
};
