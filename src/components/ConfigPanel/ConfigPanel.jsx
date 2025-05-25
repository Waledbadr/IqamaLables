import React, { useState, useCallback, useEffect } from 'react';
import { Settings, Save, RotateCcw, Palette, MapPin, Plus, Download, Upload, Trash2 } from 'lucide-react';
import {
  PAPER_SIZES,
  LABEL_PRESETS,
  FONT_FAMILIES,
  FONT_WEIGHTS,
  TEXT_ALIGNMENTS,
  DEFAULT_CONFIG,
  calculateLabelsPerPage,
  loadPresetsFromStorage,
  savePresetToStorage,
  generatePresetId,
  exportPresetsToFile,
  importPresetsFromFile,
} from '../../types/index.js';
import {
  calculateAvailablePositions,
  generatePositionGrid,
  parseUsedPositions
} from '../../utils/labelGenerator.js';

const ConfigPanel = ({ config, onConfigChange, isLoading, onLoadingChange }) => {
  const [activeTab, setActiveTab] = useState('layout');
  const [usedPositionsText, setUsedPositionsText] = useState('');

  // Label preset management state
  const [customLabelPresets, setCustomLabelPresets] = useState([]);
  const [selectedLabelPreset, setSelectedLabelPreset] = useState('custom');
  const [showSaveLabelDialog, setShowSaveLabelDialog] = useState(false);
  const [newLabelPresetName, setNewLabelPresetName] = useState('');
  const [error, setError] = useState('');

  // Handle configuration changes
  const handleChange = useCallback((field, value) => {
    const newConfig = { ...config, [field]: value };

    // Auto-calculate labels per page if page or label dimensions change
    if (['pageWidth', 'pageHeight', 'labelWidth', 'labelHeight', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'horizontalSpacing', 'verticalSpacing'].includes(field)) {
      const calculated = calculateLabelsPerPage(newConfig);
      newConfig.labelsPerRow = calculated.labelsPerRow;
      newConfig.labelsPerColumn = calculated.labelsPerColumn;
    }

    onConfigChange(newConfig);
  }, [config, onConfigChange]);

  // Handle paper size change
  const handlePaperSizeChange = useCallback((paperSize) => {
    const size = PAPER_SIZES[paperSize];
    const newConfig = {
      ...config,
      pageSize: paperSize,
      pageWidth: size.width,
      pageHeight: size.height,
    };

    const calculated = calculateLabelsPerPage(newConfig);
    newConfig.labelsPerRow = calculated.labelsPerRow;
    newConfig.labelsPerColumn = calculated.labelsPerColumn;

    onConfigChange(newConfig);
  }, [config, onConfigChange]);

  // Handle label preset selection
  const handleLabelPresetChange = useCallback((presetKey) => {
    setSelectedLabelPreset(presetKey);

    if (presetKey === 'custom') return;

    let preset;
    if (LABEL_PRESETS[presetKey]) {
      // Built-in preset
      preset = LABEL_PRESETS[presetKey];
    } else {
      // Custom preset
      const customPreset = customLabelPresets.find(p => p.id === presetKey);
      if (customPreset) {
        preset = customPreset.config;
      }
    }

    if (preset) {
      const paperSize = PAPER_SIZES[preset.pageSize];
      const newConfig = {
        ...config,
        ...preset,
        pageWidth: paperSize.width,
        pageHeight: paperSize.height,
      };
      onConfigChange(newConfig);
    }
  }, [config, onConfigChange, customLabelPresets]);

  // Load custom label presets on component mount
  useEffect(() => {
    const savedPresets = localStorage.getItem('labelPrinter_customLabelPresets');
    if (savedPresets) {
      try {
        setCustomLabelPresets(JSON.parse(savedPresets));
      } catch (error) {
        console.error('Failed to load custom label presets:', error);
      }
    }
  }, []);

  // Handle used positions text change
  const handleUsedPositionsChange = useCallback((text) => {
    setUsedPositionsText(text);
    const positions = parseUsedPositions(text);
    handleChange('usedPositions', positions);
  }, [handleChange]);

  // Label preset management functions
  const handleSaveLabelPreset = useCallback(() => {
    if (!newLabelPresetName.trim()) {
      setError('Please enter a preset name');
      return;
    }

    // Extract only label-related configuration
    const labelConfig = {
      pageSize: config.pageSize,
      pageWidth: config.pageWidth,
      pageHeight: config.pageHeight,
      labelWidth: config.labelWidth,
      labelHeight: config.labelHeight,
      labelsPerRow: config.labelsPerRow,
      labelsPerColumn: config.labelsPerColumn,
      marginTop: config.marginTop,
      marginBottom: config.marginBottom,
      marginLeft: config.marginLeft,
      marginRight: config.marginRight,
      horizontalSpacing: config.horizontalSpacing,
      verticalSpacing: config.verticalSpacing,
    };

    const newPreset = {
      id: generatePresetId(),
      name: newLabelPresetName.trim(),
      config: labelConfig,
      isBuiltIn: false,
      createdAt: new Date().toISOString(),
    };

    const updatedPresets = [...customLabelPresets, newPreset];
    setCustomLabelPresets(updatedPresets);
    localStorage.setItem('labelPrinter_customLabelPresets', JSON.stringify(updatedPresets));
    setSelectedLabelPreset(newPreset.id);
    setNewLabelPresetName('');
    setShowSaveLabelDialog(false);
    setError('');
  }, [config, customLabelPresets, newLabelPresetName]);

  const handleDeleteLabelPreset = useCallback((presetId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا القالب؟ / Are you sure you want to delete this preset?')) {
      const updatedPresets = customLabelPresets.filter(p => p.id !== presetId);
      setCustomLabelPresets(updatedPresets);
      localStorage.setItem('labelPrinter_customLabelPresets', JSON.stringify(updatedPresets));

      if (selectedLabelPreset === presetId) {
        setSelectedLabelPreset('custom');
      }
    }
  }, [customLabelPresets, selectedLabelPreset]);

  // Reset to defaults
  const handleReset = useCallback(() => {
    onConfigChange(DEFAULT_CONFIG);
    setUsedPositionsText('');
  }, [onConfigChange]);

  const tabs = [
    { id: 'layout', label: 'Layout', icon: Settings },
    { id: 'position', label: 'Position', icon: MapPin },
    { id: 'style', label: 'Style', icon: Palette },
  ];

  return (
    <div className="config-panel">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Configuration - الإعدادات</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="text-gray-600 hover:text-gray-700 p-1"
            title="Reset to defaults"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>



      {/* Tabs */}
      <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4 mr-1" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Layout Tab */}
      {activeTab === 'layout' && (
        <div className="space-y-4">
          {/* Label Presets */}
          <div className="input-group">
            <label className="input-label">Label Preset - قالب الملصقات</label>
            <div className="flex gap-2">
              <select
                value={selectedLabelPreset}
                onChange={(e) => handleLabelPresetChange(e.target.value)}
                className="input-field flex-1"
                disabled={isLoading}
              >
                <option value="custom">Custom - مخصص</option>
                {Object.entries(LABEL_PRESETS).map(([key, preset]) => (
                  <option key={key} value={key}>
                    {preset.name}
                  </option>
                ))}
                {customLabelPresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name} (مخصص)
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowSaveLabelDialog(true)}
                className="btn-secondary text-sm px-2"
                title="Save current label settings as preset"
                disabled={isLoading}
              >
                <Save className="w-4 h-4" />
              </button>

              {selectedLabelPreset !== 'custom' && !LABEL_PRESETS[selectedLabelPreset] && (
                <button
                  onClick={() => handleDeleteLabelPreset(selectedLabelPreset)}
                  className="btn-secondary text-sm px-2 text-red-600 hover:text-red-700"
                  title="Delete custom preset"
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-2 mt-2">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* Paper Size */}
          <div className="input-group">
            <label className="input-label">Paper Size</label>
            <select
              value={config.pageSize}
              onChange={(e) => handlePaperSizeChange(e.target.value)}
              className="input-field"
              disabled={isLoading}
            >
              {Object.entries(PAPER_SIZES).map(([key, size]) => (
                <option key={key} value={key}>
                  {size.name} ({size.width} × {size.height} mm)
                </option>
              ))}
            </select>
          </div>

          {/* Custom Page Dimensions */}
          {config.pageSize === 'Custom' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="input-group">
                <label className="input-label">Width (mm)</label>
                <input
                  type="number"
                  value={config.pageWidth}
                  onChange={(e) => handleChange('pageWidth', parseFloat(e.target.value) || 0)}
                  className="input-field"
                  min="50"
                  max="500"
                  step="0.1"
                  disabled={isLoading}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Height (mm)</label>
                <input
                  type="number"
                  value={config.pageHeight}
                  onChange={(e) => handleChange('pageHeight', parseFloat(e.target.value) || 0)}
                  className="input-field"
                  min="50"
                  max="500"
                  step="0.1"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Margins */}
          <div className="input-group">
            <label className="input-label">Margins (mm) - الهوامش</label>

            {/* Margin inputs in cross pattern */}
            <div className="relative">
              {/* Top margin */}
              <div className="flex justify-center mb-2">
                <div className="w-24">
                  <label className="input-label text-xs text-center block">Top / أعلى</label>
                  <input
                    type="number"
                    value={config.marginTop}
                    onChange={(e) => handleChange('marginTop', parseFloat(e.target.value) || 0)}
                    className="input-field text-sm text-center"
                    min="0"
                    max="50"
                    step="0.1"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Left and Right margins */}
              <div className="flex justify-between items-center mb-2">
                <div className="w-24">
                  <label className="input-label text-xs text-center block">Left / يسار</label>
                  <input
                    type="number"
                    value={config.marginLeft}
                    onChange={(e) => handleChange('marginLeft', parseFloat(e.target.value) || 0)}
                    className="input-field text-sm text-center"
                    min="0"
                    max="50"
                    step="0.1"
                    disabled={isLoading}
                  />
                </div>

                <div className="w-16 h-10 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-500">Page</span>
                </div>

                <div className="w-24">
                  <label className="input-label text-xs text-center block">Right / يمين</label>
                  <input
                    type="number"
                    value={config.marginRight}
                    onChange={(e) => handleChange('marginRight', parseFloat(e.target.value) || 0)}
                    className="input-field text-sm text-center"
                    min="0"
                    max="50"
                    step="0.1"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Bottom margin */}
              <div className="flex justify-center">
                <div className="w-24">
                  <label className="input-label text-xs text-center block">Bottom / أسفل</label>
                  <input
                    type="number"
                    value={config.marginBottom}
                    onChange={(e) => handleChange('marginBottom', parseFloat(e.target.value) || 0)}
                    className="input-field text-sm text-center"
                    min="0"
                    max="50"
                    step="0.1"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Label Dimensions */}
          <div className="grid grid-cols-2 gap-3">
            <div className="input-group">
              <label className="input-label">Label Width (mm)</label>
              <input
                type="number"
                value={config.labelWidth}
                onChange={(e) => handleChange('labelWidth', parseFloat(e.target.value) || 0)}
                className="input-field"
                min="10"
                max="200"
                step="0.1"
                disabled={isLoading}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Label Height (mm)</label>
              <input
                type="number"
                value={config.labelHeight}
                onChange={(e) => handleChange('labelHeight', parseFloat(e.target.value) || 0)}
                className="input-field"
                min="5"
                max="100"
                step="0.1"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Spacing */}
          <div className="grid grid-cols-2 gap-3">
            <div className="input-group">
              <label className="input-label">Horizontal Spacing (mm)</label>
              <input
                type="number"
                value={config.horizontalSpacing}
                onChange={(e) => handleChange('horizontalSpacing', parseFloat(e.target.value) || 0)}
                className="input-field"
                min="0"
                max="20"
                step="0.1"
                disabled={isLoading}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Vertical Spacing (mm)</label>
              <input
                type="number"
                value={config.verticalSpacing}
                onChange={(e) => handleChange('verticalSpacing', parseFloat(e.target.value) || 0)}
                className="input-field"
                min="0"
                max="20"
                step="0.1"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Layout Info */}
          <div className="bg-gray-50 rounded-md p-3">
            <p className="text-sm text-gray-700">
              <strong>Layout:</strong> {config.labelsPerRow} × {config.labelsPerColumn} = {config.labelsPerRow * config.labelsPerColumn} labels per page
            </p>
          </div>
        </div>
      )}

      {/* Position Tab */}
      {activeTab === 'position' && (
        <div className="space-y-4">
          {/* Starting Position */}
          <div className="input-group">
            <label className="input-label">Starting Position</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="input-label text-xs">Start Row (0-based)</label>
                <input
                  type="number"
                  value={config.startRow}
                  onChange={(e) => handleChange('startRow', parseInt(e.target.value, 10) || 0)}
                  className="input-field"
                  min="0"
                  max={config.labelsPerColumn - 1}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="input-label text-xs">Start Column (0-based)</label>
                <input
                  type="number"
                  value={config.startColumn}
                  onChange={(e) => handleChange('startColumn', parseInt(e.target.value, 10) || 0)}
                  className="input-field"
                  min="0"
                  max={config.labelsPerRow - 1}
                  disabled={isLoading}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Skip rows/columns from the top-left. Useful for continuing on partially used sheets.
            </p>
          </div>

          {/* Used Positions */}
          <div className="input-group">
            <label className="input-label">Used Positions (Optional)</label>
            <textarea
              value={usedPositionsText}
              onChange={(e) => handleUsedPositionsChange(e.target.value)}
              placeholder="Enter used positions as row,col pairs&#10;Example: 0,0; 0,1; 1,2&#10;or 0-0, 0-1, 1-2"
              className="input-field h-20 resize-none font-mono text-sm"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Specify positions that are already used. Format: row,col or row-col separated by semicolons or commas.
            </p>
          </div>

          {/* Position Grid Visualization */}
          <div className="input-group">
            <label className="input-label">Position Grid Preview</label>
            <div className="border border-gray-300 rounded p-3 bg-gray-50">
              <PositionGrid config={config} />
            </div>
          </div>

          {/* Available Positions Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-700">
              <strong>Available positions:</strong> {calculateAvailablePositions(config)} out of {config.labelsPerRow * config.labelsPerColumn}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Starting from row {config.startRow}, column {config.startColumn}
              {config.usedPositions.length > 0 && ` with ${config.usedPositions.length} used position(s)`}
            </p>
          </div>
        </div>
      )}

      {/* Style Tab */}
      {activeTab === 'style' && (
        <div className="space-y-4">
          {/* Font Settings */}
          <div className="input-group">
            <label className="input-label">Font Family</label>
            <select
              value={config.fontFamily}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              className="input-field"
              disabled={isLoading}
            >
              {FONT_FAMILIES.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="input-group">
              <label className="input-label">Font Size (pt)</label>
              <input
                type="number"
                value={config.fontSize}
                onChange={(e) => handleChange('fontSize', parseFloat(e.target.value) || 0)}
                className="input-field"
                min="6"
                max="24"
                disabled={isLoading}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Font Weight</label>
              <select
                value={config.fontWeight}
                onChange={(e) => handleChange('fontWeight', e.target.value)}
                className="input-field"
                disabled={isLoading}
              >
                {FONT_WEIGHTS.map((weight) => (
                  <option key={weight.value} value={weight.value}>
                    {weight.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Text Alignment */}
          <div className="input-group">
            <label className="input-label">Text Alignment</label>
            <select
              value={config.textAlign}
              onChange={(e) => handleChange('textAlign', e.target.value)}
              className="input-field"
              disabled={isLoading}
            >
              {TEXT_ALIGNMENTS.map((align) => (
                <option key={align.value} value={align.value}>
                  {align.label}
                </option>
              ))}
            </select>
          </div>

          {/* Prefix/Suffix */}
          <div className="grid grid-cols-2 gap-3">
            <div className="input-group">
              <label className="input-label">Prefix</label>
              <input
                type="text"
                value={config.prefix}
                onChange={(e) => handleChange('prefix', e.target.value)}
                className="input-field"
                placeholder="e.g., EMP-"
                maxLength="10"
                disabled={isLoading}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Suffix</label>
              <input
                type="text"
                value={config.suffix}
                onChange={(e) => handleChange('suffix', e.target.value)}
                className="input-field"
                placeholder="e.g., -ID"
                maxLength="10"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-3">
            <div className="input-group">
              <label className="input-label">Text Color</label>
              <input
                type="color"
                value={config.textColor}
                onChange={(e) => handleChange('textColor', e.target.value)}
                className="input-field h-10"
                disabled={isLoading}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Background Color</label>
              <input
                type="color"
                value={config.backgroundColor}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                className="input-field h-10"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="input-group">
              <label className="input-label">Border Color</label>
              <input
                type="color"
                value={config.borderColor}
                onChange={(e) => handleChange('borderColor', e.target.value)}
                className="input-field h-10"
                disabled={isLoading}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Border Width (px)</label>
              <input
                type="number"
                value={config.borderWidth}
                onChange={(e) => handleChange('borderWidth', parseFloat(e.target.value) || 0)}
                className="input-field"
                min="0"
                max="5"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Save Label Preset Dialog */}
      {showSaveLabelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">حفظ قالب الملصقات / Save Label Preset</h3>

            <div className="input-group">
              <label className="input-label">اسم القالب / Preset Name</label>
              <input
                type="text"
                value={newLabelPresetName}
                onChange={(e) => setNewLabelPresetName(e.target.value)}
                placeholder="أدخل اسم القالب... / Enter preset name..."
                className="input-field"
                autoFocus
              />
            </div>

            <div className="text-xs text-gray-600 mt-2 mb-4">
              سيتم حفظ: حجم الورقة، أبعاد الملصقات، الهوامش، والمسافات
              <br />
              Will save: page size, label dimensions, margins, and spacing
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => {
                  setShowSaveLabelDialog(false);
                  setNewLabelPresetName('');
                  setError('');
                }}
                className="btn-secondary"
              >
                إلغاء / Cancel
              </button>
              <button
                onClick={handleSaveLabelPreset}
                className="btn-primary"
              >
                <Save className="w-4 h-4 mr-1" />
                حفظ / Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Position Grid Component
const PositionGrid = ({ config }) => {
  const grid = generatePositionGrid(config);

  return (
    <div className="inline-block">
      <div className="text-xs text-gray-600 mb-2">
        <span className="inline-block w-3 h-3 bg-green-200 border border-green-400 mr-1"></span>
        Available
        <span className="inline-block w-3 h-3 bg-red-200 border border-red-400 mr-1 ml-3"></span>
        Used
        <span className="inline-block w-3 h-3 bg-gray-200 border border-gray-400 mr-1 ml-3"></span>
        Skipped
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${config.labelsPerRow}, 1fr)` }}>
        {grid.flat().map((cell, index) => (
          <div
            key={index}
            className={`w-6 h-4 border text-xs flex items-center justify-center ${
              cell.status === 'available'
                ? 'bg-green-200 border-green-400'
                : cell.status === 'used'
                ? 'bg-red-200 border-red-400'
                : 'bg-gray-200 border-gray-400'
            }`}
            title={`Row ${cell.row}, Col ${cell.col} - ${cell.status}`}
          >
            {cell.row === config.startRow && cell.col === config.startColumn && (
              <span className="text-blue-600 font-bold">S</span>
            )}
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        S = Starting position
      </div>
    </div>
  );
};

export default ConfigPanel;
