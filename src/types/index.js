// Type definitions and constants for the label printing application

// Default configuration for label layout
export const DEFAULT_CONFIG = {
  // Page settings
  pageSize: 'A4', // A4, Letter, Custom
  pageWidth: 210, // mm
  pageHeight: 297, // mm
  orientation: 'portrait', // portrait, landscape

  // Margins
  marginTop: 10, // mm
  marginBottom: 10, // mm
  marginLeft: 10, // mm
  marginRight: 10, // mm

  // Label dimensions
  labelWidth: 50, // mm
  labelHeight: 25, // mm

  // Layout
  labelsPerRow: 3,
  labelsPerColumn: 10,

  // Spacing
  horizontalSpacing: 5, // mm
  verticalSpacing: 3, // mm

  // Starting position (for partial sheet printing)
  startRow: 0, // Skip this many rows from the top
  startColumn: 0, // Skip this many columns from the left

  // Used positions (for resume printing)
  usedPositions: [], // Array of {row, col} objects representing used label positions

  // Text settings
  fontSize: 12, // pt
  fontFamily: 'Arial',
  fontWeight: 'normal', // normal, bold
  textAlign: 'center', // left, center, right

  // Content settings
  prefix: '',
  suffix: '',

  // Colors
  textColor: '#000000',
  backgroundColor: '#ffffff',
  borderColor: '#cccccc',
  borderWidth: 1, // px
};

// Common paper sizes in mm
export const PAPER_SIZES = {
  A4: { width: 210, height: 297, name: 'A4' },
  Letter: { width: 215.9, height: 279.4, name: 'Letter' },
  Legal: { width: 215.9, height: 355.6, name: 'Legal' },
  A3: { width: 297, height: 420, name: 'A3' },
  A5: { width: 148, height: 210, name: 'A5' },
  Custom: { width: 210, height: 297, name: 'Custom' },
};

// Common label presets for popular sticker sheets
export const LABEL_PRESETS = {
  avery_5160: {
    name: 'Avery 5160 (Address Labels)',
    pageSize: 'Letter',
    labelWidth: 66.7,
    labelHeight: 25.4,
    labelsPerRow: 3,
    labelsPerColumn: 10,
    marginTop: 12.7,
    marginLeft: 4.7,
    horizontalSpacing: 3.2,
    verticalSpacing: 0,
  },
  avery_5161: {
    name: 'Avery 5161 (Address Labels)',
    pageSize: 'Letter',
    labelWidth: 101.6,
    labelHeight: 25.4,
    labelsPerRow: 2,
    labelsPerColumn: 10,
    marginTop: 12.7,
    marginLeft: 4.7,
    horizontalSpacing: 3.2,
    verticalSpacing: 0,
  },
  avery_5162: {
    name: 'Avery 5162 (Address Labels)',
    pageSize: 'Letter',
    labelWidth: 101.6,
    labelHeight: 33.9,
    labelsPerRow: 2,
    labelsPerColumn: 7,
    marginTop: 21.2,
    marginLeft: 4.7,
    horizontalSpacing: 3.2,
    verticalSpacing: 0,
  },
  custom_small: {
    name: 'Small ID Labels',
    pageSize: 'A4',
    labelWidth: 40,
    labelHeight: 20,
    labelsPerRow: 4,
    labelsPerColumn: 12,
    marginTop: 15,
    marginLeft: 10,
    horizontalSpacing: 5,
    verticalSpacing: 3,
  },
  custom_medium: {
    name: 'Medium ID Labels',
    pageSize: 'A4',
    labelWidth: 60,
    labelHeight: 30,
    labelsPerRow: 3,
    labelsPerColumn: 8,
    marginTop: 15,
    marginLeft: 10,
    horizontalSpacing: 5,
    verticalSpacing: 5,
  },
  custom_large: {
    name: 'Large ID Labels',
    pageSize: 'A4',
    labelWidth: 80,
    labelHeight: 40,
    labelsPerRow: 2,
    labelsPerColumn: 6,
    marginTop: 20,
    marginLeft: 15,
    horizontalSpacing: 10,
    verticalSpacing: 8,
  },
};

// Font options
export const FONT_FAMILIES = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Georgia',
  'Trebuchet MS',
  'Comic Sans MS',
  'Aptos Black',
  'Aptos',
  'Calibri',
  'Segoe UI',
  'Tahoma',
  'Impact',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Inter',
];

export const FONT_WEIGHTS = [
  { value: 'normal', label: 'Normal' },
  { value: 'bold', label: 'Bold' },
];

export const TEXT_ALIGNMENTS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

// Calculate how many labels fit on a page with given configuration
export const calculateLabelsPerPage = (config) => {
  const {
    pageWidth,
    pageHeight,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    labelWidth,
    labelHeight,
    horizontalSpacing,
    verticalSpacing,
  } = config;

  // Available space
  const availableWidth = pageWidth - marginLeft - marginRight;
  const availableHeight = pageHeight - marginTop - marginBottom;

  // Calculate how many labels fit
  const labelsPerRow = Math.floor((availableWidth + horizontalSpacing) / (labelWidth + horizontalSpacing));
  const labelsPerColumn = Math.floor((availableHeight + verticalSpacing) / (labelHeight + verticalSpacing));

  return {
    labelsPerRow: Math.max(1, labelsPerRow),
    labelsPerColumn: Math.max(1, labelsPerColumn),
    totalPerPage: Math.max(1, labelsPerRow * labelsPerColumn),
  };
};

// Utility functions for type checking and validation
export const validateConfig = (config) => {
  const errors = [];

  if (config.labelWidth <= 0) errors.push('Label width must be greater than 0');
  if (config.labelHeight <= 0) errors.push('Label height must be greater than 0');
  if (config.labelsPerRow <= 0) errors.push('Labels per row must be greater than 0');
  if (config.labelsPerColumn <= 0) errors.push('Labels per column must be greater than 0');
  if (config.fontSize <= 0) errors.push('Font size must be greater than 0');

  return errors;
};

export const mmToPx = (mm, dpi = 96) => {
  return (mm * dpi) / 25.4;
};

export const pxToMm = (px, dpi = 96) => {
  return (px * 25.4) / dpi;
};

export const mmToPoints = (mm) => {
  return mm * 2.834645669;
};

export const pointsToMm = (points) => {
  return points / 2.834645669;
};

// Configuration preset management
export const PRESET_STORAGE_KEY = 'labelPrinter_userPresets';

export const DEFAULT_USER_PRESETS = [
  {
    id: 'default',
    name: 'Default Configuration',
    config: DEFAULT_CONFIG,
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
  }
];

// Utility functions for preset management
export const savePresetToStorage = (presets) => {
  try {
    localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets));
    return true;
  } catch (error) {
    console.error('Failed to save presets to localStorage:', error);
    return false;
  }
};

export const loadPresetsFromStorage = () => {
  try {
    const stored = localStorage.getItem(PRESET_STORAGE_KEY);
    if (stored) {
      const presets = JSON.parse(stored);
      // Ensure default preset exists
      const hasDefault = presets.some(p => p.id === 'default');
      if (!hasDefault) {
        return [...DEFAULT_USER_PRESETS, ...presets];
      }
      return presets;
    }
    return DEFAULT_USER_PRESETS;
  } catch (error) {
    console.error('Failed to load presets from localStorage:', error);
    return DEFAULT_USER_PRESETS;
  }
};

export const generatePresetId = () => {
  return 'preset_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const exportPresetsToFile = (presets, filename = 'label-printer-presets.json') => {
  try {
    const dataStr = JSON.stringify(presets, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Failed to export presets:', error);
    return false;
  }
};

export const importPresetsFromFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const presets = JSON.parse(e.target.result);
        // Validate preset structure
        if (Array.isArray(presets) && presets.every(p => p.id && p.name && p.config)) {
          resolve(presets);
        } else {
          reject(new Error('Invalid preset file format'));
        }
      } catch (error) {
        reject(new Error('Failed to parse preset file: ' + error.message));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
