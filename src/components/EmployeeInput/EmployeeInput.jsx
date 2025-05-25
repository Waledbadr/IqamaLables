import React, { useState, useCallback } from 'react';
import { Upload, FileText, Users, X, Plus } from 'lucide-react';
import { parseCSVFile, validateCSVFile, generateSampleCSV } from '../../utils/csvImport.js';
import { parseEmployeeIds, generateSampleIds } from '../../utils/labelGenerator.js';

const EmployeeInput = ({ onEmployeeIdsChange, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [currentIds, setCurrentIds] = useState([]);

  // Handle text input change
  const handleTextChange = useCallback((e) => {
    const text = e.target.value;
    setInputText(text);
    
    if (text.trim()) {
      const ids = parseEmployeeIds(text);
      setCurrentIds(ids);
      onEmployeeIdsChange(ids);
      setError('');
    } else {
      setCurrentIds([]);
      onEmployeeIdsChange([]);
    }
  }, [onEmployeeIdsChange]);

  // Handle file upload
  const handleFileUpload = useCallback(async (file) => {
    setError('');
    
    const validation = validateCSVFile(file);
    if (!validation.valid) {
      setError(validation.errors.join(', '));
      return;
    }

    try {
      const result = await parseCSVFile(file);
      if (result.success) {
        const idsText = result.data.join('\n');
        setInputText(idsText);
        setCurrentIds(result.data);
        onEmployeeIdsChange(result.data);
        
        if (result.errors.length > 0) {
          console.warn('CSV parsing warnings:', result.errors);
        }
      }
    } catch (error) {
      setError(error.error || 'Failed to parse CSV file');
    }
  }, [onEmployeeIdsChange]);

  // Handle drag and drop
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, [handleFileUpload]);

  // Handle file input change
  const handleFileInputChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  }, [handleFileUpload]);

  // Load sample data
  const handleLoadSample = useCallback(() => {
    const sampleIds = generateSampleIds(30);
    const idsText = sampleIds.join('\n');
    setInputText(idsText);
    setCurrentIds(sampleIds);
    onEmployeeIdsChange(sampleIds);
    setError('');
  }, [onEmployeeIdsChange]);

  // Download sample CSV
  const handleDownloadSample = useCallback(() => {
    const csvContent = generateSampleCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample-employees.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  // Clear input
  const handleClear = useCallback(() => {
    setInputText('');
    setCurrentIds([]);
    onEmployeeIdsChange([]);
    setError('');
  }, [onEmployeeIdsChange]);

  return (
    <div className="config-panel">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Employee IDs
        </h2>
        {currentIds.length > 0 && (
          <button
            onClick={handleClear}
            className="text-red-600 hover:text-red-700 p-1"
            title="Clear all"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Input Methods */}
      <div className="space-y-4">
        {/* Text Input */}
        <div className="input-group">
          <label className="input-label">
            Enter Employee IDs (one per line or comma-separated)
          </label>
          <textarea
            value={inputText}
            onChange={handleTextChange}
            placeholder="EMP001&#10;EMP002&#10;EMP003&#10;or EMP001, EMP002, EMP003"
            className="input-field h-32 resize-none font-mono text-sm"
            disabled={isLoading}
          />
          {currentIds.length > 0 && (
            <p className="text-sm text-gray-600">
              {currentIds.length} employee ID{currentIds.length !== 1 ? 's' : ''} entered
            </p>
          )}
        </div>

        {/* File Upload */}
        <div className="input-group">
          <label className="input-label">Or upload a CSV file</label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop a CSV file here, or click to select
            </p>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileInputChange}
              className="hidden"
              id="csv-upload"
              disabled={isLoading}
            />
            <label
              htmlFor="csv-upload"
              className="btn-secondary cursor-pointer inline-block"
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Choose CSV File
            </label>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleLoadSample}
            className="btn-secondary text-sm"
            disabled={isLoading}
          >
            <Plus className="w-4 h-4 mr-1" />
            Load Sample Data
          </button>
          <button
            onClick={handleDownloadSample}
            className="btn-secondary text-sm"
            disabled={isLoading}
          >
            <FileText className="w-4 h-4 mr-1" />
            Download Sample CSV
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-700">
            <strong>Supported formats:</strong>
          </p>
          <ul className="text-sm text-blue-600 mt-1 space-y-1">
            <li>• One employee ID per line</li>
            <li>• Comma-separated values</li>
            <li>• CSV files with employee_id column</li>
            <li>• Maximum 20 characters per ID</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmployeeInput;
