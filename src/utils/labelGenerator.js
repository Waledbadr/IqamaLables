import { mmToPx } from '../types/index.js';

/**
 * Generate label layout data based on configuration and employee IDs
 */
export const generateLabelLayout = (employeeIds, config) => {
  const { labelsPerRow, labelsPerColumn } = config;
  const labelsPerPage = labelsPerRow * labelsPerColumn;

  // Split employee IDs into pages
  const pages = [];
  for (let i = 0; i < employeeIds.length; i += labelsPerPage) {
    const pageEmployees = employeeIds.slice(i, i + labelsPerPage);
    pages.push(pageEmployees);
  }

  return pages.map((pageEmployees, pageIndex) => ({
    pageIndex,
    labels: generateLabelsForPage(pageEmployees, config),
    totalLabels: pageEmployees.length,
  }));
};

/**
 * Generate individual label data for a single page
 */
const generateLabelsForPage = (employeeIds, config) => {
  const {
    labelsPerRow,
    labelsPerColumn,
    labelWidth,
    labelHeight,
    marginLeft,
    marginTop,
    horizontalSpacing,
    verticalSpacing,
    prefix,
    suffix,
    startRow,
    startColumn,
    usedPositions,
  } = config;

  const labels = [];
  const usedPositionsSet = new Set(
    usedPositions.map(pos => `${pos.row}-${pos.col}`)
  );

  // Create a grid to track available positions
  const availablePositions = [];
  for (let row = startRow; row < labelsPerColumn; row++) {
    const colStart = (row === startRow) ? startColumn : 0;
    for (let col = colStart; col < labelsPerRow; col++) {
      const posKey = `${row}-${col}`;
      if (!usedPositionsSet.has(posKey)) {
        availablePositions.push({ row, col });
      }
    }
  }

  employeeIds.forEach((employeeId, index) => {
    if (index >= availablePositions.length) {
      // No more available positions on this page
      return;
    }

    const { row, col } = availablePositions[index];

    // Calculate position
    const x = marginLeft + col * (labelWidth + horizontalSpacing);
    const y = marginTop + row * (labelHeight + verticalSpacing);

    // Format the text
    const text = `${prefix}${employeeId}${suffix}`;

    labels.push({
      id: `label-${index}`,
      employeeId,
      text,
      position: { x, y },
      dimensions: { width: labelWidth, height: labelHeight },
      row,
      col,
      gridRow: row,
      gridCol: col,
    });
  });

  return labels;
};



/**
 * Generate CSS styles for label positioning
 */
export const generateLabelStyles = (label, config, dpi = 96) => {
  const { position, dimensions } = label;
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

  return {
    position: 'absolute',
    left: `${mmToPx(position.x, dpi)}px`,
    top: `${mmToPx(position.y, dpi)}px`,
    width: `${mmToPx(dimensions.width, dpi)}px`,
    height: `${mmToPx(dimensions.height, dpi)}px`,
    fontSize: `${fontSize}pt`,
    fontFamily,
    fontWeight,
    textAlign,
    color: textColor,
    backgroundColor,
    border: `${borderWidth}px solid ${borderColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: textAlign === 'left' ? 'flex-start' : textAlign === 'right' ? 'flex-end' : 'center',
    padding: '2px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    wordBreak: 'break-word',
  };
};

/**
 * Generate page styles for print layout
 */
export const generatePageStyles = (config, dpi = 96) => {
  const { pageWidth, pageHeight } = config;

  return {
    width: `${mmToPx(pageWidth, dpi)}px`,
    height: `${mmToPx(pageHeight, dpi)}px`,
    position: 'relative',
    backgroundColor: 'white',
    margin: '0 auto',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  };
};

/**
 * Validate employee ID format
 */
export const validateEmployeeId = (id) => {
  if (!id || typeof id !== 'string') return false;

  // Remove whitespace
  const trimmed = id.trim();
  if (trimmed.length === 0) return false;

  // Check for reasonable length (1-20 characters)
  if (trimmed.length > 20) return false;

  return true;
};

/**
 * Parse employee IDs from text input
 */
export const parseEmployeeIds = (text) => {
  if (!text) return [];

  // Split by common delimiters and filter valid IDs
  const ids = text
    .split(/[\n,;|\t]+/)
    .map(id => id.trim())
    .filter(id => validateEmployeeId(id))
    .filter((id, index, array) => array.indexOf(id) === index); // Remove duplicates

  return ids;
};

/**
 * Generate sample employee IDs for testing
 */
export const generateSampleIds = (count = 30) => {
  const ids = [];
  for (let i = 1; i <= count; i++) {
    ids.push(`EMP${i.toString().padStart(4, '0')}`);
  }
  return ids;
};

/**
 * Calculate optimal font size based on label dimensions and text length
 */
export const calculateOptimalFontSize = (text, labelWidth, labelHeight, config) => {
  const maxWidth = mmToPx(labelWidth - 4); // Account for padding
  const maxHeight = mmToPx(labelHeight - 4);

  // Start with configured font size and adjust down if needed
  let fontSize = config.fontSize;
  const minFontSize = 6;
  const maxFontSize = 24;

  // Simple heuristic based on text length and label size
  const textLength = text.length;
  const labelArea = labelWidth * labelHeight;

  if (textLength > 10 && labelArea < 1000) {
    fontSize = Math.max(minFontSize, fontSize - 2);
  } else if (textLength > 15 && labelArea < 1500) {
    fontSize = Math.max(minFontSize, fontSize - 3);
  }

  return Math.min(maxFontSize, Math.max(minFontSize, fontSize));
};

/**
 * Calculate how many labels can fit on a page considering starting position and used positions
 */
export const calculateAvailablePositions = (config) => {
  const { labelsPerRow, labelsPerColumn, startRow, startColumn, usedPositions } = config;

  const usedPositionsSet = new Set(
    usedPositions.map(pos => `${pos.row}-${pos.col}`)
  );

  let availableCount = 0;
  for (let row = startRow; row < labelsPerColumn; row++) {
    const colStart = (row === startRow) ? startColumn : 0;
    for (let col = colStart; col < labelsPerRow; col++) {
      const posKey = `${row}-${col}`;
      if (!usedPositionsSet.has(posKey)) {
        availableCount++;
      }
    }
  }

  return availableCount;
};

/**
 * Generate a visual grid showing used and available positions
 */
export const generatePositionGrid = (config) => {
  const { labelsPerRow, labelsPerColumn, startRow, startColumn, usedPositions } = config;

  const usedPositionsSet = new Set(
    usedPositions.map(pos => `${pos.row}-${pos.col}`)
  );

  const grid = [];
  for (let row = 0; row < labelsPerColumn; row++) {
    const rowData = [];
    for (let col = 0; col < labelsPerRow; col++) {
      const posKey = `${row}-${col}`;
      const isUsed = usedPositionsSet.has(posKey);
      const isBeforeStart = row < startRow || (row === startRow && col < startColumn);
      const isAvailable = !isUsed && !isBeforeStart;

      rowData.push({
        row,
        col,
        isUsed,
        isBeforeStart,
        isAvailable,
        status: isUsed ? 'used' : isBeforeStart ? 'skipped' : 'available'
      });
    }
    grid.push(rowData);
  }

  return grid;
};

/**
 * Parse used positions from text input (e.g., "1,2;3,4" or "1-2,3-4")
 */
export const parseUsedPositions = (text) => {
  if (!text || typeof text !== 'string') return [];

  const positions = [];
  const pairs = text.split(/[;,|\n]+/).map(s => s.trim()).filter(s => s.length > 0);

  pairs.forEach(pair => {
    // Support formats like "1,2" or "1-2"
    const parts = pair.split(/[-,]/).map(s => s.trim());
    if (parts.length === 2) {
      const row = parseInt(parts[0], 10);
      const col = parseInt(parts[1], 10);
      if (!isNaN(row) && !isNaN(col) && row >= 0 && col >= 0) {
        positions.push({ row, col });
      }
    }
  });

  return positions;
};
