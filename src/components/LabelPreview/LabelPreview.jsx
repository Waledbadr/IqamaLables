import React, { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, MapPin } from 'lucide-react';
import { generateLabelStyles, generatePageStyles, generatePositionGrid } from '../../utils/labelGenerator.js';

const LabelPreview = ({ labelPages, config, isLoading, onConfigChange }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(0.5);
  const [copiedText, setCopiedText] = useState(null);
  const [isSelectingStartPosition, setIsSelectingStartPosition] = useState(false);
  const [isDraggingMode, setIsDraggingMode] = useState(false);
  const [draggedLabel, setDraggedLabel] = useState(null);
  const [highlightedCell, setHighlightedCell] = useState(null);

  if (isLoading) {
    return (
      <div className="label-preview p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating preview...</p>
        </div>
      </div>
    );
  }

  if (!labelPages || labelPages.length === 0) {
    return (
      <div className="label-preview p-8 flex items-center justify-center">
        <div className="text-center">
          <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Preview Available</h3>
          <p className="text-gray-600">
            Enter employee IDs to see a preview of your labels
          </p>
        </div>
      </div>
    );
  }

  const currentPageData = labelPages[currentPage];
  const dpi = 96; // Standard screen DPI

  const handlePrevPage = () => {
    setCurrentPage(Math.max(0, currentPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(Math.min(labelPages.length - 1, currentPage + 1));
  };

  const handleZoomIn = () => {
    setZoom(Math.min(2, zoom + 0.1));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(0.2, zoom - 0.1));
  };

  // Handle grid cell click to set start position
  const handleGridCellClick = (row, col) => {
    if (isSelectingStartPosition && onConfigChange) {
      onConfigChange({
        ...config,
        startRow: row,
        startColumn: col,
      });
      setIsSelectingStartPosition(false);
      
      // Show confirmation
      setCopiedText(`Start position set to Row ${row + 1}, Column ${col + 1}`);
      setTimeout(() => {
        setCopiedText(null);
      }, 2000);
    }
  };

  // Toggle start position selection mode
  const toggleStartPositionSelection = () => {
    setIsSelectingStartPosition(!isSelectingStartPosition);
    setIsDraggingMode(false); // Disable dragging when selecting start position
  };

  // Toggle drag mode
  const toggleDragMode = () => {
    setIsDraggingMode(!isDraggingMode);
    setIsSelectingStartPosition(false); // Disable start position selection
  };

  // Handle label drag start
  const handleLabelDragStart = (label, employeeIds) => {
    if (!isDraggingMode) return;
    
    const labelIndex = employeeIds.findIndex(id => id === label.employeeId);
    setDraggedLabel({
      ...label,
      isFirst: labelIndex === 0,
      allEmployeeIds: employeeIds,
    });
  };

  // Handle drop on cell
  const handleCellDrop = (row, col, employeeIds) => {
    if (!draggedLabel || !onConfigChange) return;

    const customPositions = { ...(config.customPositions || {}) };
    
    if (draggedLabel.isFirst) {
      // Moving first label - move entire sequence
      const rowDiff = row - draggedLabel.row;
      const colDiff = col - draggedLabel.col;
      
      // Update all labels positions
      employeeIds.forEach((employeeId, index) => {
        const currentLabel = currentPageData.labels.find(l => l.employeeId === employeeId);
        if (currentLabel) {
          const newRow = currentLabel.row + rowDiff;
          const newCol = currentLabel.col + colDiff;
          
          // Check if new position is valid
          if (newRow >= 0 && newRow < config.labelsPerColumn && 
              newCol >= 0 && newCol < config.labelsPerRow) {
            customPositions[employeeId] = { row: newRow, col: newCol };
          }
        }
      });
      
      setCopiedText('Entire sequence moved!');
    } else {
      // Moving individual label
      customPositions[draggedLabel.employeeId] = { row, col };
      setCopiedText(`Label moved to Row ${row + 1}, Column ${col + 1}`);
    }
    
    onConfigChange({
      ...config,
      customPositions,
    });
    
    setDraggedLabel(null);
    setHighlightedCell(null);
    
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  // Handle drag over cell
  const handleCellDragOver = (event, row, col) => {
    if (!draggedLabel) return;
    event.preventDefault();
    setHighlightedCell({ row, col });
  };

  // Handle field click to select text
  const handleFieldClick = (event) => {
    // Don't select text if in position selection mode or drag mode
    if (isSelectingStartPosition || isDraggingMode) return;
    
    const target = event.target;
    
    // Check if clicked element is a label or contains text
    if (target.classList.contains('label-item') || target.closest('.label-item')) {
      const labelElement = target.classList.contains('label-item') 
        ? target 
        : target.closest('.label-item');
      
      // Select all text in the label
      const range = document.createRange();
      const selection = window.getSelection();
      
      range.selectNodeContents(labelElement);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  return (
    <div className="label-preview relative">
      {/* Notification */}
      {copiedText && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-fade-in">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{copiedText}</span>
        </div>
      )}
      
      {/* Preview Header */}
      <div className="flex items-center justify-between mb-4 p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Label Preview
          </h2>

          {/* Page Navigation */}
          {labelPages.length > 1 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage + 1} of {labelPages.length}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === labelPages.length - 1}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Start Position Button */}
          {onConfigChange && (
            <>
              <button
                onClick={toggleStartPositionSelection}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isSelectingStartPosition
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Click to select starting position"
              >
                <MapPin className="w-4 h-4" />
                <span>{isSelectingStartPosition ? 'Click on a cell...' : 'Set Start Position'}</span>
              </button>

              {/* Drag Mode Button */}
              <button
                onClick={toggleDragMode}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDraggingMode
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Enable drag mode to move labels"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <span>{isDraggingMode ? 'Drag Mode Active' : 'Move Labels'}</span>
              </button>
            </>
          )}

          {/* Zoom Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-1 rounded hover:bg-gray-100"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 min-w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 rounded hover:bg-gray-100"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="overflow-auto max-h-[calc(100vh-300px)] bg-gray-100 p-4">
        {/* Selection Mode Banner */}
        {isSelectingStartPosition && (
          <div className="mb-4 p-3 bg-blue-50 border-2 border-blue-400 rounded-lg text-center animate-fade-in">
            <p className="text-blue-800 font-medium">
              📍 Click on any cell to set it as the starting position
            </p>
            <p className="text-blue-600 text-sm mt-1">
              انقر على أي خانة لتعيينها كنقطة البداية
            </p>
          </div>
        )}

        {/* Drag Mode Banner */}
        {isDraggingMode && (
          <div className="mb-4 p-3 bg-green-50 border-2 border-green-400 rounded-lg text-center animate-fade-in">
            <p className="text-green-800 font-medium">
              🎯 Drag labels to reposition them
            </p>
            <p className="text-green-600 text-sm mt-1">
              • First label: Moves entire sequence | الرقم الأول: ينقل التسلسل بالكامل<br />
              • Other labels: Move individually | الأرقام الأخرى: تتحرك فردياً
            </p>
          </div>
        )}
        
        <div
          className="mx-auto"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-in-out'
          }}
        >
          {/* Container with row/column numbers */}
          <div className="relative inline-block">
            {/* Column Numbers */}
            <div className="flex absolute -top-6 left-0" style={{ marginLeft: `${(config.marginLeft * dpi) / 25.4}px` }}>
              {Array.from({ length: config.labelsPerRow }, (_, i) => (
                <div
                  key={`col-${i}`}
                  className="text-xs text-gray-600 text-center font-mono screen-only"
                  style={{
                    width: `${(config.labelWidth * dpi) / 25.4}px`,
                    marginRight: i < config.labelsPerRow - 1 ? `${(config.horizontalSpacing * dpi) / 25.4}px` : '0'
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Row Numbers */}
            <div className="absolute -left-8 top-0 flex flex-col" style={{ marginTop: `${(config.marginTop * dpi) / 25.4}px` }}>
              {Array.from({ length: config.labelsPerColumn }, (_, i) => (
                <div
                  key={`row-${i}`}
                  className="text-xs text-gray-600 text-center font-mono screen-only flex items-center justify-center"
                  style={{
                    height: `${(config.labelHeight * dpi) / 25.4}px`,
                    marginBottom: i < config.labelsPerColumn - 1 ? `${(config.verticalSpacing * dpi) / 25.4}px` : '0'
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Page Container */}
            <div
              id={`preview-page-${currentPage}`}
              style={generatePageStyles(config, dpi)}
              className="print-page"
            >
            {/* Show all grid positions for context */}
            {generatePositionGrid(config).flat().map((cell, index) => {
              const x = config.marginLeft + cell.col * (config.labelWidth + config.horizontalSpacing);
              const y = config.marginTop + cell.row * (config.labelHeight + config.verticalSpacing);

              const cellStyle = {
                position: 'absolute',
                left: `${(x * dpi) / 25.4}px`,
                top: `${(y * dpi) / 25.4}px`,
                width: `${(config.labelWidth * dpi) / 25.4}px`,
                height: `${(config.labelHeight * dpi) / 25.4}px`,
                border: '1px dashed #d1d5db',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: '#9ca3af',
                cursor: isSelectingStartPosition || (isDraggingMode && draggedLabel) ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
              };

              if (cell.status === 'skipped') {
                cellStyle.backgroundColor = '#f3f4f6';
                cellStyle.border = '1px dashed #9ca3af';
              } else if (cell.status === 'used') {
                cellStyle.backgroundColor = '#fef2f2';
                cellStyle.border = '1px dashed #f87171';
              }

              // Highlight if this is the start position
              const isStartPosition = cell.row === config.startRow && cell.col === config.startColumn;
              if (isStartPosition) {
                cellStyle.backgroundColor = '#dbeafe';
                cellStyle.border = '2px solid #3b82f6';
                cellStyle.fontWeight = 'bold';
              }

              // Highlight if this cell is hovered during drag
              const isHighlighted = highlightedCell && highlightedCell.row === cell.row && highlightedCell.col === cell.col;
              if (isHighlighted) {
                cellStyle.backgroundColor = '#d1fae5';
                cellStyle.border = '2px solid #10b981';
                cellStyle.transform = 'scale(1.05)';
              }

              // Hover effect when in selection mode or drag mode
              const hoverClass = (isSelectingStartPosition || (isDraggingMode && draggedLabel)) 
                ? 'hover:bg-blue-100 hover:border-blue-400 hover:scale-105' 
                : '';

              return (
                <div
                  key={`grid-${index}`}
                  style={cellStyle}
                  className={`screen-only ${hoverClass}`}
                  onClick={() => handleGridCellClick(cell.row, cell.col)}
                  onDragOver={(e) => handleCellDragOver(e, cell.row, cell.col)}
                  onDrop={() => handleCellDrop(cell.row, cell.col, currentPageData.labels.map(l => l.employeeId))}
                  onDragLeave={() => setHighlightedCell(null)}
                  title={
                    isSelectingStartPosition
                      ? `Click to set start position to Row ${cell.row + 1}, Column ${cell.col + 1}`
                      : `Row ${cell.row + 1}, Col ${cell.col + 1} - ${cell.status}`
                  }
                >
                  {isStartPosition && (
                    <span className="text-blue-600 font-bold text-sm">S</span>
                  )}
                  {!isStartPosition && cell.status === 'skipped' && 'Skip'}
                  {!isStartPosition && cell.status === 'used' && 'Used'}
                </div>
              );
            })}

            {/* Labels */}
            {currentPageData.labels.map((label, labelIndex) => {
              const isFirstLabel = labelIndex === 0;
              const isDragging = draggedLabel && draggedLabel.employeeId === label.employeeId;
              
              return (
                <div
                  key={label.id}
                  draggable={isDraggingMode}
                  onDragStart={() => handleLabelDragStart(label, currentPageData.labels.map(l => l.employeeId))}
                  onDragEnd={() => {
                    setDraggedLabel(null);
                    setHighlightedCell(null);
                  }}
                  style={{
                    ...generateLabelStyles(label, config, dpi),
                    cursor: isDraggingMode ? 'move' : 'pointer',
                    userSelect: isDraggingMode ? 'none' : 'text',
                    transition: 'all 0.2s ease',
                    opacity: isDragging ? 0.5 : 1,
                    border: isFirstLabel && isDraggingMode ? '2px solid #10b981' : undefined,
                    boxShadow: isFirstLabel && isDraggingMode ? '0 0 10px rgba(16, 185, 129, 0.3)' : undefined,
                  }}
                  className={`label-item ${!isDraggingMode ? 'hover:ring-2 hover:ring-blue-400 hover:shadow-md' : ''}`}
                  onClick={handleFieldClick}
                  title={
                    isDraggingMode 
                      ? (isFirstLabel ? 'First label - drag to move entire sequence' : 'Drag to move this label only')
                      : 'Click to select text'
                  }
                >
                  <span style={{ fontSize: 'inherit' }}>
                    {label.text}
                  </span>
                  {isFirstLabel && isDraggingMode && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold screen-only">
                      1st
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Info */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm flex-1">
            <div>
              <span className="text-gray-600">Page Size:</span>
              <span className="ml-2 font-medium">
                {config.pageWidth} × {config.pageHeight} mm
              </span>
            </div>
            <div>
              <span className="text-gray-600">Label Size:</span>
              <span className="ml-2 font-medium">
                {config.labelWidth} × {config.labelHeight} mm
              </span>
            </div>
            <div>
              <span className="text-gray-600">Labels per Page:</span>
              <span className="ml-2 font-medium">
                {config.labelsPerRow} × {config.labelsPerColumn} = {config.labelsPerRow * config.labelsPerColumn}
              </span>
            </div>
            <div>
              <span className="text-gray-600">This Page:</span>
              <span className="ml-2 font-medium">
                {currentPageData.totalLabels} label{currentPageData.totalLabels !== 1 ? 's' : ''}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Start Position:</span>
              <span className="ml-2 font-medium text-blue-600">
                Row {config.startRow + 1}, Col {config.startColumn + 1}
              </span>
            </div>
          </div>
          
          {/* Reset Custom Positions Button */}
          {onConfigChange && config.customPositions && Object.keys(config.customPositions).length > 0 && (
            <button
              onClick={() => {
                onConfigChange({
                  ...config,
                  customPositions: {},
                });
                setCopiedText('Custom positions reset!');
                setTimeout(() => setCopiedText(null), 2000);
              }}
              className="ml-4 px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              title="Reset all custom label positions"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset Positions</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabelPreview;
