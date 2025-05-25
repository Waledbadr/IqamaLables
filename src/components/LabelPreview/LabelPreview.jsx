import React, { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { generateLabelStyles, generatePageStyles, generatePositionGrid } from '../../utils/labelGenerator.js';

const LabelPreview = ({ labelPages, config, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(0.5);

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

  return (
    <div className="label-preview">
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

      {/* Preview Content */}
      <div className="overflow-auto max-h-[calc(100vh-300px)] bg-gray-100 p-4">
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
              };

              if (cell.status === 'skipped') {
                cellStyle.backgroundColor = '#f3f4f6';
                cellStyle.border = '1px dashed #9ca3af';
              } else if (cell.status === 'used') {
                cellStyle.backgroundColor = '#fef2f2';
                cellStyle.border = '1px dashed #f87171';
              }

              return (
                <div key={`grid-${index}`} style={cellStyle} className="screen-only">
                  {cell.status === 'skipped' && 'Skip'}
                  {cell.status === 'used' && 'Used'}
                </div>
              );
            })}

            {/* Labels */}
            {currentPageData.labels.map((label) => (
              <div
                key={label.id}
                style={generateLabelStyles(label, config, dpi)}
                className="label-item"
              >
                <span style={{ fontSize: 'inherit' }}>
                  {label.text}
                </span>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Info */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
        </div>
      </div>
    </div>
  );
};

export default LabelPreview;
