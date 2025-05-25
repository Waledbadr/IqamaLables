import React, { useState, useCallback } from 'react';
import { Printer, Download, FileText, Settings } from 'lucide-react';
import { exportToPDF, exportMultiPagePDFFromHTML } from '../../utils/pdfExport.js';
import { generateLabelStyles } from '../../utils/labelGenerator.js';

const PrintControls = ({ labelPages, config, onLoadingChange, disabled }) => {
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [exportMethod, setExportMethod] = useState('direct'); // 'direct' or 'html'

  // Handle print
  const handlePrint = useCallback(() => {
    if (disabled || !labelPages.length) return;

    // Create a dedicated print window with optimized styles
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to use direct printing');
      return;
    }

    // Generate optimized print HTML
    const printHTML = generateOptimizedPrintHTML(labelPages, config);
    printWindow.document.write(printHTML);
    printWindow.document.close();

    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        // Close window after printing (optional)
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }, 500);
    };
  }, [disabled, labelPages, config]);

  // Handle PDF export
  const handleExportPDF = useCallback(async () => {
    if (disabled || !labelPages.length) return;

    try {
      onLoadingChange(true);

      if (exportMethod === 'html') {
        // Export using HTML to canvas method
        const pageElements = [];
        for (let i = 0; i < labelPages.length; i++) {
          const element = document.getElementById(`preview-page-${i}`);
          if (element) {
            pageElements.push(element);
          }
        }

        if (pageElements.length > 0) {
          await exportMultiPagePDFFromHTML(pageElements, config);
        } else {
          throw new Error('Preview elements not found');
        }
      } else {
        // Direct PDF generation
        await exportToPDF(labelPages, config);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export PDF: ' + error.message);
    } finally {
      onLoadingChange(false);
    }
  }, [disabled, labelPages, config, exportMethod, onLoadingChange]);

  // Handle print preview
  const handlePrintPreview = useCallback(() => {
    if (disabled || !labelPages.length) return;

    // Create a new window with print styles
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to use print preview');
      return;
    }

    // Generate print HTML
    const printHTML = generatePrintHTML(labelPages, config);
    printWindow.document.write(printHTML);
    printWindow.document.close();

    // Auto-focus and show print dialog
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }, [disabled, labelPages, config]);

  return (
    <div className="flex items-center space-x-2">
      {/* Print Button */}
      <button
        onClick={handlePrint}
        disabled={disabled}
        className="btn-primary flex items-center"
        title="Print labels"
      >
        <Printer className="w-4 h-4 mr-2" />
        Print
      </button>

      {/* Export PDF Button */}
      <button
        onClick={handleExportPDF}
        disabled={disabled}
        className="btn-secondary flex items-center"
        title="Export as PDF"
      >
        <Download className="w-4 h-4 mr-2" />
        Export PDF
      </button>

      {/* Print Settings */}
      <button
        onClick={() => setShowPrintDialog(!showPrintDialog)}
        disabled={disabled}
        className="btn-secondary p-2"
        title="Print settings"
      >
        <Settings className="w-4 h-4" />
      </button>

      {/* Print Settings Dialog */}
      {showPrintDialog && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">Print Settings</h3>

            <div className="space-y-3">
              {/* Export Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PDF Export Method
                </label>
                <select
                  value={exportMethod}
                  onChange={(e) => setExportMethod(e.target.value)}
                  className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="direct">Direct Generation</option>
                  <option value="html">HTML to PDF</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {exportMethod === 'direct'
                    ? 'Faster, better for simple layouts'
                    : 'More accurate, slower generation'
                  }
                </p>
              </div>

              {/* Print Preview */}
              <button
                onClick={handlePrintPreview}
                className="w-full btn-secondary text-sm flex items-center justify-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                Print Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Generate optimized HTML for direct printing
const generateOptimizedPrintHTML = (labelPages, config) => {
  const { pageWidth, pageHeight } = config;

  const pagesHTML = labelPages.map((page, pageIndex) => {
    const labelsHTML = page.labels.map((label) => {
      const styles = generateLabelStyles(label, config, 96);
      const styleString = Object.entries(styles)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
        .join('; ');

      return `<div style="${styleString}">${label.text}</div>`;
    }).join('');

    // Add row and column numbers for print
    const rowNumbers = Array.from({ length: config.labelsPerColumn }, (_, i) => {
      const y = config.marginTop + i * (config.labelHeight + config.verticalSpacing);
      return `
        <div style="
          position: absolute;
          left: ${config.marginLeft - 5}mm;
          top: ${y + config.labelHeight / 2}mm;
          font-size: 8pt;
          color: #666;
          transform: translateY(-50%);
          font-family: monospace;
        ">${i + 1}</div>
      `;
    }).join('');

    const colNumbers = Array.from({ length: config.labelsPerRow }, (_, i) => {
      const x = config.marginLeft + i * (config.labelWidth + config.horizontalSpacing);
      return `
        <div style="
          position: absolute;
          left: ${x + config.labelWidth / 2}mm;
          top: ${config.marginTop - 3}mm;
          font-size: 8pt;
          color: #666;
          transform: translateX(-50%);
          font-family: monospace;
        ">${i + 1}</div>
      `;
    }).join('');

    return `
      <div class="print-page" style="
        width: ${pageWidth}mm;
        height: ${pageHeight}mm;
        position: relative;
        background: white;
        page-break-after: ${pageIndex < labelPages.length - 1 ? 'always' : 'auto'};
      ">
        ${rowNumbers}
        ${colNumbers}
        ${labelsHTML}
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Employee Labels</title>
      <meta charset="UTF-8">
      <style>
        @page {
          size: ${pageWidth}mm ${pageHeight}mm;
          margin: 0;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          font-family: ${config.fontFamily}, sans-serif;
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }

        .print-page {
          page-break-after: always;
          page-break-inside: avoid;
        }

        .print-page:last-child {
          page-break-after: auto;
        }

        @media print {
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }

          .print-page {
            page-break-after: always;
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      ${pagesHTML}
    </body>
    </html>
  `;
};

export default PrintControls;
