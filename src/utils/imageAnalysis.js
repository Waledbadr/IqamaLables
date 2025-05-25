/**
 * Enhanced Image Analysis Utility for Label Sheet Detection
 * Uses advanced Computer Vision techniques for automatic detection of:
 * - Label dimensions with high precision
 * - Page margins calculation
 * - Spacing between labels measurement
 * - Grid pattern recognition
 * - Paper size estimation
 */

// Standard paper sizes in mm for reference
const PAPER_SIZES_MM = {
  A4: { width: 210, height: 297, name: 'A4' },
  LETTER: { width: 215.9, height: 279.4, name: 'Letter' },
  LEGAL: { width: 215.9, height: 355.6, name: 'Legal' }
};

// Common label sizes in mm with improved detection patterns
const COMMON_LABEL_SIZES = [
  { width: 50, height: 25, name: 'Standard ID', aspectRatio: 2.0 },
  { width: 66.7, height: 25.4, name: 'Avery 5160', aspectRatio: 2.63 },
  { width: 101.6, height: 25.4, name: 'Avery 5161', aspectRatio: 4.0 },
  { width: 101.6, height: 33.9, name: 'Avery 5162', aspectRatio: 3.0 },
  { width: 101.6, height: 50.8, name: 'Avery 5163', aspectRatio: 2.0 },
  { width: 70, height: 37, name: 'Large ID', aspectRatio: 1.89 },
  { width: 38.1, height: 21.2, name: 'Small Address', aspectRatio: 1.8 },
  { width: 63.5, height: 29.6, name: 'Medium Address', aspectRatio: 2.15 }
];

/**
 * Main enhanced function to analyze label sheet image
 */
export const analyzeImage = async (imageFile) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // Set canvas size with optimal resolution
        const maxSize = 1200; // Max dimension for processing
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        
        canvas.width = Math.floor(img.width * scale);
        canvas.height = Math.floor(img.height * scale);
        
        // Draw image with anti-aliasing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Enhanced analysis with multiple detection methods
        const result = enhancedAnalyzeImageData(imageData, canvas.width, canvas.height, img.width, img.height);
        
        resolve(result);
      } catch (error) {
        reject(new Error('Failed to analyze image: ' + error.message));
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image file'));
    };

    img.src = URL.createObjectURL(imageFile);
  });
};

/**
 * Enhanced image analysis with multiple detection methods and improved accuracy
 */
const enhancedAnalyzeImageData = (imageData, canvasWidth, canvasHeight, originalWidth, originalHeight) => {
  const data = imageData.data;
  
  // Step 1: Preprocessing - noise reduction and enhancement
  const preprocessedData = preprocessImage(data, canvasWidth, canvasHeight);
  
  // Step 2: Multiple edge detection methods
  const edges = enhancedEdgeDetection(preprocessedData, canvasWidth, canvasHeight);
  
  // Step 3: Contour detection and rectangle finding
  const rectangles = findRectanglesEnhanced(edges, canvasWidth, canvasHeight);
  
  // Step 4: Advanced pattern analysis with clustering
  const labelPattern = advancedPatternAnalysis(rectangles, canvasWidth, canvasHeight);
  
  // Step 5: Precise measurements with DPI calculation
  const measurements = calculatePreciseMeasurements(labelPattern, canvasWidth, canvasHeight, originalWidth, originalHeight);
  
  // Step 6: Multi-factor confidence assessment
  const confidence = calculateEnhancedConfidence(labelPattern, rectangles, edges, canvasWidth, canvasHeight);
  
  // Step 7: Comprehensive image quality analysis
  const imageQuality = comprehensiveQualityAssessment(data, canvasWidth, canvasHeight);
  
  // Step 8: Intelligent suggestions
  const suggestions = generateIntelligentSuggestions(confidence, imageQuality, labelPattern, measurements);

  return {
    ...measurements,
    confidence,
    imageQuality,
    suggestions,
    detectedLabels: labelPattern.labels.length,
    analysisDetails: {
      totalRectangles: rectangles.length,
      filteredLabels: labelPattern.labels.length,
      gridDetected: labelPattern.gridDetected,
      processingSteps: {
        preprocessing: true,
        edgeDetection: true,
        patternAnalysis: true,
        measurementCalculation: true
      }
    }
  };
};

/**
 * Basic image analysis (fallback method)
 */
const analyzeImageData = (imageData, width, height) => {
  const data = imageData.data;
  
  // Convert to grayscale and apply edge detection
  const edges = detectEdges(data, width, height);
  
  // Find rectangles (potential labels)
  const rectangles = findRectangles(edges, width, height);
  
  // Filter and group rectangles to find label pattern
  const labelPattern = analyzeLabelPattern(rectangles, width, height);
  
  // Calculate measurements in mm
  const measurements = calculateMeasurements(labelPattern, width, height);
  
  // Assess confidence and quality
  const confidence = assessConfidence(labelPattern, rectangles);
  const imageQuality = assessImageQuality(data, width, height);
  
  // Generate suggestions
  const suggestions = generateSuggestions(confidence, imageQuality, labelPattern);

  return {
    ...measurements,
    confidence,
    imageQuality,
    suggestions,
    detectedLabels: labelPattern.labels.length,
    analysisDetails: {
      totalRectangles: rectangles.length,
      filteredLabels: labelPattern.labels.length,
      gridDetected: labelPattern.gridDetected
    }
  };
};

/**
 * Simple edge detection using Sobel operator
 */
const detectEdges = (data, width, height) => {
  const edges = new Uint8ClampedArray(width * height);
  
  // Sobel kernels
  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0, gy = 0;
      
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
          
          const kernelIdx = (ky + 1) * 3 + (kx + 1);
          gx += gray * sobelX[kernelIdx];
          gy += gray * sobelY[kernelIdx];
        }
      }
      
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      edges[y * width + x] = magnitude > 30 ? 255 : 0; // Threshold
    }
  }
  
  return edges;
};

/**
 * Find rectangular shapes in edge image
 */
const findRectangles = (edges, width, height) => {
  const rectangles = [];
  const visited = new Set();
  
  // Simple contour detection
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      if (edges[y * width + x] === 255 && !visited.has(y * width + x)) {
        const contour = traceContour(edges, x, y, width, height, visited);
        const rect = getBoundingRect(contour);
        
        // Filter rectangles by size (potential labels)
        if (rect.width > 20 && rect.height > 10 && 
            rect.width < width * 0.3 && rect.height < height * 0.3) {
          rectangles.push(rect);
        }
      }
    }
  }
  
  return rectangles;
};

/**
 * Trace contour from starting point
 */
const traceContour = (edges, startX, startY, width, height, visited) => {
  const contour = [];
  const stack = [{x: startX, y: startY}];
  
  while (stack.length > 0) {
    const {x, y} = stack.pop();
    const idx = y * width + x;
    
    if (visited.has(idx) || x < 0 || x >= width || y < 0 || y >= height) {
      continue;
    }
    
    if (edges[idx] === 255) {
      visited.add(idx);
      contour.push({x, y});
      
      // Add neighbors
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx !== 0 || dy !== 0) {
            stack.push({x: x + dx, y: y + dy});
          }
        }
      }
    }
  }
  
  return contour;
};

/**
 * Get bounding rectangle from contour points
 */
const getBoundingRect = (contour) => {
  if (contour.length === 0) return {x: 0, y: 0, width: 0, height: 0};
  
  let minX = contour[0].x, maxX = contour[0].x;
  let minY = contour[0].y, maxY = contour[0].y;
  
  for (const point of contour) {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  }
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
};

/**
 * Analyze pattern of detected rectangles to find label grid
 */
const analyzeLabelPattern = (rectangles, imageWidth, imageHeight) => {
  if (rectangles.length < 2) {
    return {
      labels: rectangles,
      gridDetected: false,
      rows: 1,
      columns: rectangles.length
    };
  }
  
  // Sort rectangles by position
  rectangles.sort((a, b) => {
    if (Math.abs(a.y - b.y) < 20) {
      return a.x - b.x; // Same row, sort by x
    }
    return a.y - b.y; // Sort by y
  });
  
  // Group rectangles into rows
  const rows = [];
  let currentRow = [];
  let lastY = rectangles[0].y;
  
  for (const rect of rectangles) {
    if (Math.abs(rect.y - lastY) < 20) {
      // Same row
      currentRow.push(rect);
    } else {
      // New row
      if (currentRow.length > 0) {
        rows.push([...currentRow]);
      }
      currentRow = [rect];
      lastY = rect.y;
    }
  }
  
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }
  
  // Find most common row length (columns)
  const rowLengths = rows.map(row => row.length);
  const columnCount = mode(rowLengths);
  
  // Filter rows with consistent column count
  const consistentRows = rows.filter(row => row.length === columnCount);
  
  // Flatten to get final label list
  const labels = consistentRows.flat();
  
  return {
    labels,
    gridDetected: consistentRows.length >= 2 && columnCount >= 2,
    rows: consistentRows.length,
    columns: columnCount,
    allRows: rows
  };
};

/**
 * Calculate measurements in millimeters
 */
const calculateMeasurements = (labelPattern, imageWidth, imageHeight) => {
  if (labelPattern.labels.length === 0) {
    return {
      labelWidth: 50,
      labelHeight: 25,
      marginTop: 10,
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 10,
      horizontalSpacing: 5,
      verticalSpacing: 3,
      labelsPerRow: 3,
      labelsPerColumn: 10,
      totalLabels: 30
    };
  }
  
  // Estimate DPI based on image size (assume A4 paper)
  const estimatedDPI = Math.max(imageWidth / 8.27, imageHeight / 11.69); // A4 in inches
  const pxToMm = (px) => (px / estimatedDPI) * 25.4;
  
  // Get average label dimensions
  const avgLabelWidth = pxToMm(
    labelPattern.labels.reduce((sum, label) => sum + label.width, 0) / labelPattern.labels.length
  );
  const avgLabelHeight = pxToMm(
    labelPattern.labels.reduce((sum, label) => sum + label.height, 0) / labelPattern.labels.length
  );
  
  // Find best matching standard size
  let bestMatch = COMMON_LABEL_SIZES[0];
  let minDifference = Math.abs(avgLabelWidth - bestMatch.width) + Math.abs(avgLabelHeight - bestMatch.height);
  
  for (const size of COMMON_LABEL_SIZES) {
    const difference = Math.abs(avgLabelWidth - size.width) + Math.abs(avgLabelHeight - size.height);
    if (difference < minDifference) {
      minDifference = difference;
      bestMatch = size;
    }
  }
  
  // Calculate margins and spacing
  const firstLabel = labelPattern.labels[0];
  const marginTop = pxToMm(firstLabel.y);
  const marginLeft = pxToMm(firstLabel.x);
  
  // Calculate spacing between labels
  let horizontalSpacing = 5; // default
  let verticalSpacing = 3; // default
  
  if (labelPattern.columns > 1) {
    // Find labels in the same row
    const firstRowLabels = labelPattern.allRows[0] || [];
    if (firstRowLabels.length >= 2) {
      const spacing = firstRowLabels[1].x - (firstRowLabels[0].x + firstRowLabels[0].width);
      horizontalSpacing = Math.max(0, pxToMm(spacing));
    }
  }
  
  if (labelPattern.rows > 1) {
    // Find spacing between rows
    const firstTwoRows = labelPattern.allRows.slice(0, 2);
    if (firstTwoRows.length === 2 && firstTwoRows[0].length > 0 && firstTwoRows[1].length > 0) {
      const spacing = firstTwoRows[1][0].y - (firstTwoRows[0][0].y + firstTwoRows[0][0].height);
      verticalSpacing = Math.max(0, pxToMm(spacing));
    }
  }
  
  return {
    labelWidth: Math.round(bestMatch.width * 10) / 10,
    labelHeight: Math.round(bestMatch.height * 10) / 10,
    marginTop: Math.round(marginTop * 10) / 10,
    marginLeft: Math.round(marginLeft * 10) / 10,
    marginRight: Math.round(marginLeft * 10) / 10, // Assume symmetric
    marginBottom: Math.round(marginTop * 10) / 10, // Assume symmetric
    horizontalSpacing: Math.round(horizontalSpacing * 10) / 10,
    verticalSpacing: Math.round(verticalSpacing * 10) / 10,
    labelsPerRow: labelPattern.columns,
    labelsPerColumn: labelPattern.rows,
    totalLabels: labelPattern.labels.length,
    detectedStandardSize: bestMatch.name
  };
};

/**
 * Assess confidence level of the analysis
 */
const assessConfidence = (labelPattern, allRectangles) => {
  let confidence = 0.5; // Base confidence
  
  // Grid detection increases confidence
  if (labelPattern.gridDetected) {
    confidence += 0.3;
  }
  
  // More labels increases confidence
  if (labelPattern.labels.length >= 6) {
    confidence += 0.1;
  }
  
  // Consistent sizes increase confidence
  if (labelPattern.labels.length > 1) {
    const widths = labelPattern.labels.map(l => l.width);
    const heights = labelPattern.labels.map(l => l.height);
    const widthVariance = variance(widths);
    const heightVariance = variance(heights);
    
    if (widthVariance < 100 && heightVariance < 100) {
      confidence += 0.1;
    }
  }
  
  // Filter quality (fewer false positives)
  const filterQuality = labelPattern.labels.length / Math.max(1, allRectangles.length);
  if (filterQuality > 0.3) {
    confidence += 0.1;
  }
  
  return Math.min(1, confidence);
};

/**
 * Assess image quality
 */
const assessImageQuality = (data, width, height) => {
  // Calculate average brightness and contrast
  let totalBrightness = 0;
  let minBrightness = 255;
  let maxBrightness = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
    totalBrightness += brightness;
    minBrightness = Math.min(minBrightness, brightness);
    maxBrightness = Math.max(maxBrightness, brightness);
  }
  
  const avgBrightness = totalBrightness / (width * height);
  const contrast = maxBrightness - minBrightness;
  
  // Assess quality based on brightness and contrast
  if (avgBrightness > 200 && contrast > 100) {
    return 'good';
  } else if (avgBrightness > 150 && contrast > 50) {
    return 'fair';
  } else {
    return 'poor';
  }
};

/**
 * Generate suggestions for improvement
 */
const generateSuggestions = (confidence, imageQuality, labelPattern) => {
  const suggestions = [];
  
  if (confidence < 0.7) {
    suggestions.push('حاول استخدام صورة أكثر وضوحاً مع حدود ملصقات واضحة');
  }
  
  if (imageQuality === 'poor') {
    suggestions.push('حسن الإضاءة للحصول على صورة أكثر إشراقاً');
  }
  
  if (!labelPattern.gridDetected) {
    suggestions.push('تأكد من أن الملصقات مرتبة في صفوف وأعمدة منتظمة');
  }
  
  if (labelPattern.labels.length < 6) {
    suggestions.push('تأكد من وجود عدد كافٍ من الملصقات المرئية في الصورة');
  }
  
  if (suggestions.length === 0) {
    suggestions.push('التحليل تم بنجاح! يمكنك تطبيق الإعدادات المكتشفة');
  }
    return suggestions;
};

// ========== ENHANCED ANALYSIS FUNCTIONS ==========

/**
 * Preprocess image to reduce noise and enhance features
 */
const preprocessImage = (data, width, height) => {
  const processed = new Uint8ClampedArray(data.length);
  
  // Apply Gaussian blur to reduce noise
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      // Calculate weighted average for each channel
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        let weightSum = 0;
        
        // 3x3 Gaussian kernel
        const weights = [1, 2, 1, 2, 4, 2, 1, 2, 1];
        let weightIndex = 0;
        
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const neighborIdx = ((y + dy) * width + (x + dx)) * 4;
            const weight = weights[weightIndex++];
            sum += data[neighborIdx + c] * weight;
            weightSum += weight;
          }
        }
        
        processed[idx + c] = sum / weightSum;
      }
      processed[idx + 3] = data[idx + 3]; // Alpha channel
    }
  }
  
  return processed;
};

/**
 * Enhanced edge detection with multiple methods
 */
const enhancedEdgeDetection = (data, width, height) => {
  const edges = new Uint8ClampedArray(width * height);
  
  // Convert to grayscale first
  const grayscale = new Uint8ClampedArray(width * height);
  for (let i = 0; i < width * height; i++) {
    const pixelIdx = i * 4;
    grayscale[i] = (data[pixelIdx] + data[pixelIdx + 1] + data[pixelIdx + 2]) / 3;
  }
  
  // Apply enhanced Sobel operator with better kernels
  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
  
  // Roberts cross-gradient (for fine details)
  const robertsX = [1, 0, 0, -1];
  const robertsY = [0, 1, -1, 0];
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let sobelMagnitude = 0;
      let robertsMagnitude = 0;
      
      // Sobel edge detection
      let gx = 0, gy = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = (y + ky) * width + (x + kx);
          const kernelIdx = (ky + 1) * 3 + (kx + 1);
          gx += grayscale[idx] * sobelX[kernelIdx];
          gy += grayscale[idx] * sobelY[kernelIdx];
        }
      }
      sobelMagnitude = Math.sqrt(gx * gx + gy * gy);
      
      // Roberts edge detection (for comparison)
      let rx = 0, ry = 0;
      rx += grayscale[y * width + x] * robertsX[0];
      rx += grayscale[y * width + (x + 1)] * robertsX[1];
      rx += grayscale[(y + 1) * width + x] * robertsX[2];
      rx += grayscale[(y + 1) * width + (x + 1)] * robertsX[3];
      
      ry += grayscale[y * width + x] * robertsY[0];
      ry += grayscale[y * width + (x + 1)] * robertsY[1];
      ry += grayscale[(y + 1) * width + x] * robertsY[2];
      ry += grayscale[(y + 1) * width + (x + 1)] * robertsY[3];
      
      robertsMagnitude = Math.sqrt(rx * rx + ry * ry);
      
      // Combine both methods with adaptive threshold
      const combinedMagnitude = Math.max(sobelMagnitude, robertsMagnitude * 1.5);
      const threshold = 25; // Adaptive threshold could be implemented here
      
      edges[y * width + x] = combinedMagnitude > threshold ? 255 : 0;
    }
  }
  
  return edges;
};

/**
 * Enhanced rectangle detection with better filtering
 */
const findRectanglesEnhanced = (edges, width, height) => {
  const rectangles = [];
  const visited = new Set();
  
  // Scan for edge pixels and trace contours
  for (let y = 2; y < height - 2; y++) {
    for (let x = 2; x < width - 2; x++) {
      if (edges[y * width + x] === 255 && !visited.has(y * width + x)) {
        const contour = traceContourEnhanced(edges, x, y, width, height, visited);
        
        if (contour.length > 20) { // Minimum contour length
          const rect = getBoundingRectEnhanced(contour);
          
          // Enhanced filtering criteria
          const aspectRatio = rect.width / rect.height;
          const minSize = Math.min(width, height) * 0.02; // 2% of image size
          const maxSize = Math.min(width, height) * 0.4;  // 40% of image size
          
          if (rect.width >= minSize && rect.height >= minSize &&
              rect.width <= maxSize && rect.height <= maxSize &&
              aspectRatio >= 0.5 && aspectRatio <= 10 && // Reasonable aspect ratios
              rect.area > 100) { // Minimum area
            
            // Calculate contour complexity (perimeter vs area ratio)
            const complexity = (contour.length * contour.length) / rect.area;
            
            if (complexity < 50) { // Filter out overly complex shapes
              rectangles.push({
                ...rect,
                contour,
                complexity,
                aspectRatio
              });
            }
          }
        }
      }
    }
  }
  
  // Remove overlapping rectangles (keep the larger one)
  return removeOverlappingRectangles(rectangles);
};

/**
 * Enhanced contour tracing with better connectivity
 */
const traceContourEnhanced = (edges, startX, startY, width, height, visited) => {
  const contour = [];
  const stack = [{x: startX, y: startY}];
  const directions = [
    {dx: -1, dy: -1}, {dx: 0, dy: -1}, {dx: 1, dy: -1},
    {dx: -1, dy: 0},                    {dx: 1, dy: 0},
    {dx: -1, dy: 1},  {dx: 0, dy: 1},  {dx: 1, dy: 1}
  ];
  
  while (stack.length > 0) {
    const {x, y} = stack.pop();
    const idx = y * width + x;
    
    if (visited.has(idx) || x < 0 || x >= width || y < 0 || y >= height) {
      continue;
    }
    
    if (edges[idx] === 255) {
      visited.add(idx);
      contour.push({x, y});
      
      // Add neighbors in order of connectivity
      for (const dir of directions) {
        const newX = x + dir.dx;
        const newY = y + dir.dy;
        if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
          stack.push({x: newX, y: newY});
        }
      }
    }
  }
  
  return contour;
};

/**
 * Enhanced bounding rectangle calculation with additional properties
 */
const getBoundingRectEnhanced = (contour) => {
  if (contour.length === 0) return {x: 0, y: 0, width: 0, height: 0, area: 0};
  
  let minX = contour[0].x, maxX = contour[0].x;
  let minY = contour[0].y, maxY = contour[0].y;
  
  for (const point of contour) {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  }
  
  const width = maxX - minX;
  const height = maxY - minY;
  
  return {
    x: minX,
    y: minY,
    width,
    height,
    area: width * height,
    centerX: minX + width / 2,
    centerY: minY + height / 2
  };
};

/**
 * Remove overlapping rectangles
 */
const removeOverlappingRectangles = (rectangles) => {
  const filtered = [];
  
  for (let i = 0; i < rectangles.length; i++) {
    let isOverlapping = false;
    
    for (let j = 0; j < filtered.length; j++) {
      const overlap = calculateOverlap(rectangles[i], filtered[j]);
      if (overlap > 0.3) { // 30% overlap threshold
        isOverlapping = true;
        // Keep the larger rectangle
        if (rectangles[i].area > filtered[j].area) {
          filtered[j] = rectangles[i];
        }
        break;
      }
    }
    
    if (!isOverlapping) {
      filtered.push(rectangles[i]);
    }
  }
  
  return filtered;
};

/**
 * Calculate overlap percentage between two rectangles
 */
const calculateOverlap = (rect1, rect2) => {
  const left = Math.max(rect1.x, rect2.x);
  const right = Math.min(rect1.x + rect1.width, rect2.x + rect2.width);
  const top = Math.max(rect1.y, rect2.y);
  const bottom = Math.min(rect1.y + rect1.height, rect2.y + rect2.height);
  
  if (left < right && top < bottom) {
    const overlapArea = (right - left) * (bottom - top);
    const union = rect1.area + rect2.area - overlapArea;
    return overlapArea / union;
  }
  
  return 0;
};

/**
 * Advanced pattern analysis with clustering
 */
const advancedPatternAnalysis = (rectangles, imageWidth, imageHeight) => {
  if (rectangles.length < 2) {
    return {
      labels: rectangles,
      gridDetected: false,
      rows: rectangles.length > 0 ? 1 : 0,
      columns: rectangles.length,
      clusters: []
    };
  }
  
  // Cluster rectangles by size (labels should have similar sizes)
  const sizeClusters = clusterBySimilarity(rectangles, (r1, r2) => {
    const widthDiff = Math.abs(r1.width - r2.width) / Math.max(r1.width, r2.width);
    const heightDiff = Math.abs(r1.height - r2.height) / Math.max(r1.height, r2.height);
    return widthDiff + heightDiff;
  }, 0.2); // 20% tolerance
  
  // Find the largest cluster (most likely to be labels)
  const mainCluster = sizeClusters.reduce((max, cluster) => 
    cluster.length > max.length ? cluster : max, sizeClusters[0] || []);
  
  if (mainCluster.length < 2) {
    return {
      labels: rectangles,
      gridDetected: false,
      rows: 1,
      columns: rectangles.length,
      clusters: sizeClusters
    };
  }
  
  // Analyze grid pattern in the main cluster
  const gridAnalysis = analyzeGridPattern(mainCluster, imageWidth, imageHeight);
  
  return {
    labels: mainCluster,
    gridDetected: gridAnalysis.isGrid,
    rows: gridAnalysis.rows,
    columns: gridAnalysis.columns,
    clusters: sizeClusters,
    gridConfidence: gridAnalysis.confidence,
    spacing: gridAnalysis.spacing
  };
};

/**
 * Cluster items by similarity
 */
const clusterBySimilarity = (items, distanceFunction, threshold) => {
  const clusters = [];
  const assigned = new Set();
  
  for (let i = 0; i < items.length; i++) {
    if (assigned.has(i)) continue;
    
    const cluster = [items[i]];
    assigned.add(i);
    
    for (let j = i + 1; j < items.length; j++) {
      if (assigned.has(j)) continue;
      
      const distance = distanceFunction(items[i], items[j]);
      if (distance < threshold) {
        cluster.push(items[j]);
        assigned.add(j);
      }
    }
    
    clusters.push(cluster);
  }
  
  return clusters;
};

/**
 * Analyze grid pattern in rectangles
 */
const analyzeGridPattern = (rectangles, imageWidth, imageHeight) => {
  // Sort by position (top-left to bottom-right)
  const sorted = [...rectangles].sort((a, b) => {
    if (Math.abs(a.y - b.y) < 20) return a.x - b.x;
    return a.y - b.y;
  });
  
  // Group into rows based on Y position
  const rows = [];
  let currentRow = [];
  let lastY = sorted[0]?.y || 0;
  const rowTolerance = sorted[0]?.height * 0.3 || 20;
  
  for (const rect of sorted) {
    if (Math.abs(rect.y - lastY) <= rowTolerance) {
      currentRow.push(rect);
    } else {
      if (currentRow.length > 0) rows.push([...currentRow]);
      currentRow = [rect];
      lastY = rect.y;
    }
  }
  if (currentRow.length > 0) rows.push(currentRow);
  
  // Analyze row consistency
  const rowLengths = rows.map(row => row.length);
  const avgRowLength = rowLengths.reduce((sum, len) => sum + len, 0) / rowLengths.length;
  const rowConsistency = rowLengths.filter(len => Math.abs(len - avgRowLength) <= 1).length / rowLengths.length;
  
  // Calculate spacing consistency
  let spacingConsistency = 0;
  if (rows.length > 1) {
    const horizontalSpacings = [];
    const verticalSpacings = [];
    
    // Horizontal spacings
    for (const row of rows) {
      for (let i = 1; i < row.length; i++) {
        const spacing = row[i].x - (row[i-1].x + row[i-1].width);
        if (spacing > 0) horizontalSpacings.push(spacing);
      }
    }
    
    // Vertical spacings
    for (let i = 1; i < rows.length; i++) {
      if (rows[i-1].length > 0 && rows[i].length > 0) {
        const spacing = rows[i][0].y - (rows[i-1][0].y + rows[i-1][0].height);
        if (spacing > 0) verticalSpacings.push(spacing);
      }
    }
    
    // Calculate spacing variance
    const hSpacingVariance = variance(horizontalSpacings);
    const vSpacingVariance = variance(verticalSpacings);
    spacingConsistency = 1 / (1 + (hSpacingVariance + vSpacingVariance) / 1000);
  }
  
  const isGrid = rowConsistency > 0.7 && spacingConsistency > 0.6 && rows.length >= 2;
  const confidence = (rowConsistency + spacingConsistency) / 2;
  
  return {
    isGrid,
    rows: rows.length,
    columns: Math.round(avgRowLength),
    confidence,
    spacing: {
      horizontal: horizontalSpacings.length > 0 ? 
        horizontalSpacings.reduce((sum, s) => sum + s, 0) / horizontalSpacings.length : 0,
      vertical: verticalSpacings.length > 0 ? 
        verticalSpacings.reduce((sum, s) => sum + s, 0) / verticalSpacings.length : 0
    },
    rowData: rows
  };
};

/**
 * Calculate precise measurements with improved accuracy and robust error handling
 */
const calculatePreciseMeasurements = (labelPattern, canvasWidth, canvasHeight, originalWidth, originalHeight) => {
  if (labelPattern.labels.length === 0) {
    return {
      labelWidth: 50,
      labelHeight: 25,
      marginTop: 10,
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 10,
      horizontalSpacing: 5,
      verticalSpacing: 3,
      labelsPerRow: 3,
      labelsPerColumn: 10,
      totalLabels: 30,
      measurementConfidence: 'default',
      debugInfo: { error: 'No labels detected' }
    };
  }
  
  // Calculate scale factor
  const scale = canvasWidth / originalWidth;
  
  // Debug information for troubleshooting
  const debugInfo = {
    originalSize: { width: originalWidth, height: originalHeight },
    canvasSize: { width: canvasWidth, height: canvasHeight },
    scale: scale,
    detectedLabels: labelPattern.labels.length,
    gridInfo: { rows: labelPattern.rows, columns: labelPattern.columns }
  };
  
  // Calculate average label dimensions in canvas pixels
  const avgLabelWidthPx = labelPattern.labels.reduce((sum, label) => sum + label.width, 0) / labelPattern.labels.length;
  const avgLabelHeightPx = labelPattern.labels.reduce((sum, label) => sum + label.height, 0) / labelPattern.labels.length;
  
  debugInfo.avgPixelSize = { width: avgLabelWidthPx, height: avgLabelHeightPx };
  
  // Robust DPI estimation with multiple methods
  const dpiEstimations = [];
  
  // Method 1: Simple assumption-based DPI (most reliable for typical scans)
  const commonDPIs = [150, 200, 300, 600]; // Common scanning resolutions
  for (const dpi of commonDPIs) {
    // Calculate what the image dimensions would be at this DPI
    const expectedWidthInches = originalWidth / dpi;
    const expectedHeightInches = originalHeight / dpi;
    const expectedWidthMM = expectedWidthInches * 25.4;
    const expectedHeightMM = expectedHeightInches * 25.4;
    
    // Check if this gives reasonable paper sizes
    let confidence = 0;
    for (const paperSize of Object.values(PAPER_SIZES_MM)) {
      const widthDiff = Math.abs(expectedWidthMM - paperSize.width) / paperSize.width;
      const heightDiff = Math.abs(expectedHeightMM - paperSize.height) / paperSize.height;
      
      if (widthDiff < 0.15 && heightDiff < 0.15) { // Within 15% of paper size
        confidence = Math.max(confidence, 1 - (widthDiff + heightDiff) / 2);
      }
      
      // Check landscape orientation
      const widthDiffLandscape = Math.abs(expectedWidthMM - paperSize.height) / paperSize.height;
      const heightDiffLandscape = Math.abs(expectedHeightMM - paperSize.width) / paperSize.width;
      
      if (widthDiffLandscape < 0.15 && heightDiffLandscape < 0.15) {
        confidence = Math.max(confidence, 1 - (widthDiffLandscape + heightDiffLandscape) / 2);
      }
    }
    
    if (confidence > 0) {
      dpiEstimations.push({
        dpi: dpi,
        confidence: confidence,
        method: 'paperSizeMatch',
        expectedPaperSize: { width: expectedWidthMM, height: expectedHeightMM }
      });
    }
  }
  
  // Method 2: Label size estimation (if we have enough labels)
  if (labelPattern.labels.length >= 3) {
    for (const standardSize of COMMON_LABEL_SIZES) {
      // Calculate what DPI would give us this standard size
      const expectedWidthPx = avgLabelWidthPx / scale; // Convert to original image pixels
      const expectedHeightPx = avgLabelHeightPx / scale;
      
      const dpiFromWidth = expectedWidthPx / (standardSize.width / 25.4);
      const dpiFromHeight = expectedHeightPx / (standardSize.height / 25.4);
      
      if (dpiFromWidth > 50 && dpiFromWidth < 800 && dpiFromHeight > 50 && dpiFromHeight < 800) {
        const avgDPI = (dpiFromWidth + dpiFromHeight) / 2;
        const dpiConsistency = 1 - Math.abs(dpiFromWidth - dpiFromHeight) / Math.max(dpiFromWidth, dpiFromHeight);
        
        const aspectRatio = avgLabelWidthPx / avgLabelHeightPx;
        const aspectRatioMatch = 1 - Math.abs(aspectRatio - standardSize.aspectRatio) / standardSize.aspectRatio;
        
        const confidence = Math.min(dpiConsistency, aspectRatioMatch) * 0.8; // Lower than paper size method
        
        if (confidence > 0.3) {
          dpiEstimations.push({
            dpi: avgDPI,
            confidence: confidence,
            method: 'labelSizeMatch',
            matchedSize: standardSize.name,
            aspectRatioMatch: aspectRatioMatch
          });
        }
      }
    }
  }
  
  // Method 3: Fallback estimation
  dpiEstimations.push({
    dpi: 200, // Common default
    confidence: 0.2,
    method: 'fallback'
  });
  
  // Choose best DPI estimation
  const bestDPIEstimation = dpiEstimations.reduce((best, current) => 
    current.confidence > best.confidence ? current : best
  );
  
  debugInfo.dpiEstimations = dpiEstimations;
  debugInfo.chosenDPI = bestDPIEstimation;
  
  // Simple and reliable pixel to mm conversion
  const pxToMm = (canvasPx) => {
    const originalPx = canvasPx / scale;
    return (originalPx / bestDPIEstimation.dpi) * 25.4;
  };
  
  // Convert label dimensions to mm
  let avgLabelWidth = pxToMm(avgLabelWidthPx);
  let avgLabelHeight = pxToMm(avgLabelHeightPx);
  
  debugInfo.initialMeasurements = { width: avgLabelWidth, height: avgLabelHeight };
  
  // Validation and correction
  let correctionApplied = false;
  if (avgLabelWidth < 5 || avgLabelWidth > 300 || avgLabelHeight < 3 || avgLabelHeight > 200) {
    // Measurements are unrealistic, apply correction
    console.warn('Unrealistic measurements detected, applying correction');
    
    // Use grid-based estimation
    const estimatedPageWidth = 210; // A4 assumption
    const labelsPerRow = labelPattern.columns || 3;
    const estimatedTotalMarginWidth = 20; // 10mm each side
    const estimatedLabelWidth = (estimatedPageWidth - estimatedTotalMarginWidth) / labelsPerRow;
    
    const correctionFactor = estimatedLabelWidth / avgLabelWidth;
    avgLabelWidth = estimatedLabelWidth;
    avgLabelHeight *= correctionFactor;
    
    correctionApplied = true;
    debugInfo.correction = {
      applied: true,
      factor: correctionFactor,
      reason: 'Unrealistic measurements'
    };
  }
  
  // Find best matching standard size
  let bestMatch = COMMON_LABEL_SIZES[0];
  let minScore = Infinity;
  let matchConfidence = 0;
  
  for (const size of COMMON_LABEL_SIZES) {
    const widthDiff = Math.abs(avgLabelWidth - size.width) / Math.max(avgLabelWidth, size.width);
    const heightDiff = Math.abs(avgLabelHeight - size.height) / Math.max(avgLabelHeight, size.height);
    const aspectRatioDiff = Math.abs((avgLabelWidth / avgLabelHeight) - size.aspectRatio) / size.aspectRatio;
    
    const score = (widthDiff + heightDiff) * 0.7 + aspectRatioDiff * 0.3;
    
    if (score < minScore) {
      minScore = score;
      bestMatch = size;
      matchConfidence = Math.max(0, 1 - score);
    }
  }
  
  debugInfo.standardSizeMatch = {
    bestMatch: bestMatch.name,
    score: minScore,
    confidence: matchConfidence
  };
  
  // Determine final dimensions
  const useDetected = matchConfidence < 0.6 || correctionApplied; // Use detected if standard match is poor
  let finalWidth, finalHeight;
  
  if (useDetected) {
    finalWidth = avgLabelWidth;
    finalHeight = avgLabelHeight;
  } else if (matchConfidence > 0.8) {
    // High confidence in standard size
    finalWidth = bestMatch.width;
    finalHeight = bestMatch.height;
  } else {
    // Blend detected and standard
    const blendRatio = (matchConfidence - 0.6) / 0.2; // Maps 0.6-0.8 to 0-1
    finalWidth = avgLabelWidth * (1 - blendRatio) + bestMatch.width * blendRatio;
    finalHeight = avgLabelHeight * (1 - blendRatio) + bestMatch.height * blendRatio;
  }
  
  // Calculate margins more robustly
  let marginTop = 10, marginLeft = 10, marginRight = 10, marginBottom = 10;
  
  if (labelPattern.labels.length > 0) {
    // Find actual boundaries
    const minX = Math.min(...labelPattern.labels.map(l => l.x));
    const minY = Math.min(...labelPattern.labels.map(l => l.y));
    const maxX = Math.max(...labelPattern.labels.map(l => l.x + l.width));
    const maxY = Math.max(...labelPattern.labels.map(l => l.y + l.height));
    
    marginTop = Math.max(1, pxToMm(minY));
    marginLeft = Math.max(1, pxToMm(minX));
    marginRight = Math.max(1, pxToMm(canvasWidth - maxX));
    marginBottom = Math.max(1, pxToMm(canvasHeight - maxY));
  }
  
  debugInfo.margins = { top: marginTop, left: marginLeft, right: marginRight, bottom: marginBottom };
  
  // Calculate spacing
  const spacing = calculateAccurateSpacing(labelPattern, pxToMm);
  
  return {
    labelWidth: Math.round(finalWidth * 10) / 10,
    labelHeight: Math.round(finalHeight * 10) / 10,
    marginTop: Math.round(marginTop * 10) / 10,
    marginLeft: Math.round(marginLeft * 10) / 10,
    marginRight: Math.round(marginRight * 10) / 10,
    marginBottom: Math.round(marginBottom * 10) / 10,
    horizontalSpacing: spacing.horizontal,
    verticalSpacing: spacing.vertical,
    labelsPerRow: labelPattern.columns,
    labelsPerColumn: labelPattern.rows,
    totalLabels: labelPattern.labels.length,
    detectedStandardSize: bestMatch.name,
    estimatedDPI: Math.round(bestDPIEstimation.dpi),
    measurementConfidence: useDetected ? 'detected' : 'standard',
    detectedDimensions: {
      width: Math.round(avgLabelWidth * 10) / 10,
      height: Math.round(avgLabelHeight * 10) / 10
    },
    dpiEstimation: bestDPIEstimation,
    debugInfo: debugInfo
  };
};

/**
 * Calculate confidence for paper size estimation
 */
const calculatePaperSizeConfidence = (width, height, paperSize) => {
  const aspectRatio = width / height;
  const paperAspectRatio = paperSize.width / paperSize.height;
  
  // Check both orientations
  const portraitDiff = Math.abs(aspectRatio - paperAspectRatio) / paperAspectRatio;
  const landscapeDiff = Math.abs(aspectRatio - (1 / paperAspectRatio)) / (1 / paperAspectRatio);
  
  const bestDiff = Math.min(portraitDiff, landscapeDiff);
  return Math.max(0, 1 - bestDiff);
};

/**
 * Calculate spacing between labels more accurately
 */
const calculateAccurateSpacing = (labelPattern, pxToMm) => {
  let horizontalSpacing = 5; // Default
  let verticalSpacing = 3; // Default
  
  if (labelPattern.spacing) {
    horizontalSpacing = Math.max(0, Math.round(pxToMm(labelPattern.spacing.horizontal || 0) * 10) / 10);
    verticalSpacing = Math.max(0, Math.round(pxToMm(labelPattern.spacing.vertical || 0) * 10) / 10);
  } else {
    // Calculate from label positions
    const horizontalSpacings = [];
    const verticalSpacings = [];
    
    // Group labels by rows
    const rows = groupLabelsByRows(labelPattern.labels);
      // Calculate horizontal spacing from each row
    for (const row of rows) {
      for (let i = 1; i < row.length; i++) {
        const spacing = row[i].x - (row[i-1].x + row[i-1].width);
        const spacingMm = pxToMm(spacing);
        // Filter unrealistic spacing values (between 0.5mm and 50mm)
        if (spacing > 0 && spacingMm >= 0.5 && spacingMm <= 50) {
          horizontalSpacings.push(spacingMm);
        }
      }
    }
    
    // Calculate vertical spacing between rows
    for (let i = 1; i < rows.length; i++) {
      if (rows[i-1].length > 0 && rows[i].length > 0) {
        const spacing = rows[i][0].y - (rows[i-1][0].y + rows[i-1][0].height);
        const spacingMm = pxToMm(spacing);
        // Filter unrealistic spacing values (between 0.5mm and 50mm)
        if (spacing > 0 && spacingMm >= 0.5 && spacingMm <= 50) {
          verticalSpacings.push(spacingMm);
        }
      }
    }
      // Use median for robustness and apply additional validation
    if (horizontalSpacings.length > 0) {
      horizontalSpacing = Math.round(median(horizontalSpacings) * 10) / 10;
      // Ensure minimum spacing
      horizontalSpacing = Math.max(0.5, horizontalSpacing);
    }
    if (verticalSpacings.length > 0) {
      verticalSpacing = Math.round(median(verticalSpacings) * 10) / 10;
      // Ensure minimum spacing
      verticalSpacing = Math.max(0.5, verticalSpacing);
    }
  }
  
  return {
    horizontal: Math.max(0.5, horizontalSpacing), // Minimum 0.5mm spacing
    vertical: Math.max(0.5, verticalSpacing)      // Minimum 0.5mm spacing
  };
};

/**
 * Group labels by rows based on Y position
 */
const groupLabelsByRows = (labels) => {
  const sortedLabels = [...labels].sort((a, b) => a.y - b.y);
  const rows = [];
  let currentRow = [];
  let lastY = sortedLabels[0]?.y || 0;
  
  for (const label of sortedLabels) {
    if (Math.abs(label.y - lastY) <= 20) { // Same row tolerance
      currentRow.push(label);
    } else {
      if (currentRow.length > 0) {
        rows.push([...currentRow.sort((a, b) => a.x - b.x)]); // Sort row by X
      }
      currentRow = [label];
      lastY = label.y;
    }
  }
  
  if (currentRow.length > 0) {
    rows.push(currentRow.sort((a, b) => a.x - b.x));
  }
  
  return rows;
};

/**
 * Calculate median value from array
 */
const median = (arr) => {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 
    ? (sorted[mid - 1] + sorted[mid]) / 2 
    : sorted[mid];
};

/**
 * Enhanced confidence calculation
 */
const calculateEnhancedConfidence = (labelPattern, rectangles, edges, width, height) => {
  let confidence = 0.3; // Base confidence
  
  // Grid detection significantly increases confidence
  if (labelPattern.gridDetected) {
    confidence += 0.4;
    // Grid confidence also matters
    if (labelPattern.gridConfidence > 0.8) {
      confidence += 0.1;
    }
  }
  
  // Number of labels found
  if (labelPattern.labels.length >= 6) {
    confidence += 0.15;
  } else if (labelPattern.labels.length >= 3) {
    confidence += 0.1;
  }
  
  // Size consistency
  if (labelPattern.labels.length > 1) {
    const widths = labelPattern.labels.map(l => l.width);
    const heights = labelPattern.labels.map(l => l.height);
    const widthCoeff = coefficientOfVariation(widths);
    const heightCoeff = coefficientOfVariation(heights);
    
    if (widthCoeff < 0.15 && heightCoeff < 0.15) { // Low variation
      confidence += 0.15;
    } else if (widthCoeff < 0.25 && heightCoeff < 0.25) {
      confidence += 0.1;
    }
  }
  
  // Edge detection quality
  const edgePixels = edges.filter(pixel => pixel === 255).length;
  const edgeDensity = edgePixels / (width * height);
  if (edgeDensity > 0.02 && edgeDensity < 0.15) { // Good edge density range
    confidence += 0.1;
  }
  
  // Clustering quality
  if (labelPattern.clusters && labelPattern.clusters.length > 0) {
    const mainClusterSize = Math.max(...labelPattern.clusters.map(c => c.length));
    const clusterQuality = mainClusterSize / rectangles.length;
    if (clusterQuality > 0.7) {
      confidence += 0.05;
    }
  }
  
  return Math.min(1, Math.max(0, confidence));
};

/**
 * Comprehensive image quality assessment
 */
const comprehensiveQualityAssessment = (data, width, height) => {
  let qualityScore = 0;
  let qualityFactors = [];
  
  // 1. Brightness analysis
  let totalBrightness = 0;
  let minBrightness = 255;
  let maxBrightness = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
    totalBrightness += brightness;
    minBrightness = Math.min(minBrightness, brightness);
    maxBrightness = Math.max(maxBrightness, brightness);
  }
  
  const avgBrightness = totalBrightness / (width * height);
  const contrast = maxBrightness - minBrightness;
  
  // Brightness score (optimal range: 120-200)
  let brightnessScore = 0;
  if (avgBrightness >= 120 && avgBrightness <= 200) {
    brightnessScore = 1;
  } else if (avgBrightness >= 80 && avgBrightness <= 240) {
    brightnessScore = 0.7;
  } else {
    brightnessScore = 0.3;
  }
  qualityFactors.push({factor: 'brightness', score: brightnessScore});
  
  // Contrast score (higher is better, up to a point)
  let contrastScore = 0;
  if (contrast >= 150) {
    contrastScore = 1;
  } else if (contrast >= 100) {
    contrastScore = 0.8;
  } else if (contrast >= 50) {
    contrastScore = 0.5;
  } else {
    contrastScore = 0.2;
  }
  qualityFactors.push({factor: 'contrast', score: contrastScore});
  
  // 2. Noise analysis (simplified)
  let noiseLevel = 0;
  const sampleSize = Math.min(1000, width * height / 10);
  
  for (let i = 0; i < sampleSize; i++) {
    const idx = Math.floor(Math.random() * (width * height)) * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    
    // Simple noise estimation based on color variance
    const variance = Math.pow(r - avgBrightness, 2) + 
                    Math.pow(g - avgBrightness, 2) + 
                    Math.pow(b - avgBrightness, 2);
    noiseLevel += variance;
  }
  
  noiseLevel /= sampleSize;
  const noiseScore = Math.max(0, 1 - noiseLevel / 10000);
  qualityFactors.push({factor: 'noise', score: noiseScore});
  
  // 3. Sharpness estimation (edge density)
  let edgeCount = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const current = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      
      // Check neighbors for significant changes
      const neighbors = [
        data[((y-1) * width + x) * 4],
        data[((y+1) * width + x) * 4],
        data[(y * width + (x-1)) * 4],
        data[(y * width + (x+1)) * 4]
      ];
      
      for (const neighbor of neighbors) {
        if (Math.abs(current - neighbor) > 30) {
          edgeCount++;
          break;
        }
      }
    }
  }
  
  const edgeDensity = edgeCount / (width * height);
  const sharpnessScore = Math.min(1, edgeDensity * 20); // Scale appropriately
  qualityFactors.push({factor: 'sharpness', score: sharpnessScore});
  
  // Calculate overall quality score
  qualityScore = qualityFactors.reduce((sum, factor) => sum + factor.score, 0) / qualityFactors.length;
  
  let qualityLevel;
  if (qualityScore >= 0.8) {
    qualityLevel = 'excellent';
  } else if (qualityScore >= 0.65) {
    qualityLevel = 'good';
  } else if (qualityScore >= 0.45) {
    qualityLevel = 'fair';
  } else {
    qualityLevel = 'poor';
  }
  
  return {
    level: qualityLevel,
    score: qualityScore,
    factors: qualityFactors,
    metrics: {
      brightness: avgBrightness,
      contrast,
      edgeDensity,
      noiseLevel
    }
  };
};

/**
 * Generate intelligent suggestions based on analysis
 */
const generateIntelligentSuggestions = (confidence, imageQuality, labelPattern, measurements) => {
  const suggestions = [];
  
  // Confidence-based suggestions
  if (confidence < 0.5) {
    suggestions.push('جودة الكشف منخفضة - جرب صورة بجودة أعلى أو إضاءة أفضل');
  } else if (confidence < 0.7) {
    suggestions.push('جودة الكشف متوسطة - قد تحتاج لضبط النتائج يدوياً');
  }
  
  // Image quality suggestions
  if (imageQuality.level === 'poor') {
    if (imageQuality.metrics.brightness < 100) {
      suggestions.push('الصورة مظلمة جداً - اعد التصوير بإضاءة أقوى');
    } else if (imageQuality.metrics.brightness > 220) {
      suggestions.push('الصورة مضيئة جداً - قلل الإضاءة أو استخدم إعدادات تصوير مختلفة');
    }
    
    if (imageQuality.metrics.contrast < 50) {
      suggestions.push('التباين ضعيف - تأكد من وضوح حدود الملصقات');
    }
    
    if (imageQuality.metrics.edgeDensity < 0.01) {
      suggestions.push('الصورة غير حادة - تأكد من التركيز الصحيح للكاميرا');
    }
  }
  
  // Pattern detection suggestions
  if (!labelPattern.gridDetected) {
    suggestions.push('لم يتم اكتشاف نمط شبكي منتظم - تأكد من تنظيم الملصقات في صفوف وأعمدة');
  }
  
  if (labelPattern.labels.length < 4) {
    suggestions.push('عدد قليل من الملصقات - تأكد من ظهور جميع الملصقات بوضوح');
  }
  
  // Measurement accuracy suggestions
  if (measurements.measurementConfidence === 'matched') {
    suggestions.push('تم استخدام أبعاد قياسية مطابقة - تحقق من دقة القياسات المكتشفة');
  }
  
  // Success message
  if (confidence >= 0.8 && imageQuality.level === 'good') {
    suggestions.push('ممتاز! تم الكشف بنجاح - يمكنك تطبيق الإعدادات');
  }
  
  // Default suggestion if none
  if (suggestions.length === 0) {
    suggestions.push('التحليل مكتمل - راجع النتائج وطبق الإعدادات');
  }
  
  return suggestions;
};

// Utility functions for enhanced analysis
const coefficientOfVariation = (arr) => {
  if (arr.length === 0) return 0;
  const mean = arr.reduce((sum, val) => sum + val, 0) / arr.length;
  const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
  return Math.sqrt(variance) / mean;
};

// Utility functions
const mode = (arr) => {
  const frequency = {};
  let maxCount = 0;
  let mode = arr[0];
  
  for (const value of arr) {
    frequency[value] = (frequency[value] || 0) + 1;
    if (frequency[value] > maxCount) {
      maxCount = frequency[value];
      mode = value;
    }
  }
  
  return mode;
};

const variance = (arr) => {
  const mean = arr.reduce((sum, val) => sum + val, 0) / arr.length;
  const squaredDiffs = arr.map(val => Math.pow(val - mean, 2));
  return squaredDiffs.reduce((sum, val) => sum + val, 0) / arr.length;
};
