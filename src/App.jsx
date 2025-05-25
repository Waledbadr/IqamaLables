import { useState, useCallback } from 'react';
import MainLayout from './components/Layout/MainLayout';
import LabelPreview from './components/LabelPreview/LabelPreview';
import ConfigPanel from './components/ConfigPanel/ConfigPanel';
import EmployeeInput from './components/EmployeeInput/EmployeeInput';
import PrintControls from './components/PrintControls/PrintControls';
import { DEFAULT_CONFIG } from './types/index.js';
import { generateLabelLayout } from './utils/labelGenerator.js';

function App() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [employeeIds, setEmployeeIds] = useState([]);
  const [labelPages, setLabelPages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Update configuration
  const handleConfigChange = useCallback((newConfig) => {
    setConfig(newConfig);

    // Regenerate labels if we have employee IDs
    if (employeeIds.length > 0) {
      const pages = generateLabelLayout(employeeIds, newConfig);
      setLabelPages(pages);
    }
  }, [employeeIds]);

  // Update employee IDs
  const handleEmployeeIdsChange = useCallback((ids) => {
    setEmployeeIds(ids);

    // Generate label layout
    if (ids.length > 0) {
      const pages = generateLabelLayout(ids, config);
      setLabelPages(pages);
    } else {
      setLabelPages([]);
    }
  }, [config]);

  // Handle loading state
  const handleLoadingChange = useCallback((loading) => {
    setIsLoading(loading);
  }, []);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Employee Label Printer
                </h1>
                <p className="text-sm text-gray-600">
                  Create and print professional employee ID labels
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {employeeIds.length > 0 && (
                  <span className="text-sm text-gray-600">
                    {employeeIds.length} employee{employeeIds.length !== 1 ? 's' : ''} • {labelPages.length} page{labelPages.length !== 1 ? 's' : ''}
                  </span>
                )}
                <PrintControls
                  labelPages={labelPages}
                  config={config}
                  onLoadingChange={handleLoadingChange}
                  disabled={employeeIds.length === 0}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Configuration */}
            <div className="lg:col-span-1 space-y-6">
              {/* Employee Input */}
              <EmployeeInput
                onEmployeeIdsChange={handleEmployeeIdsChange}
                isLoading={isLoading}
              />

              {/* Configuration Panel */}
              <ConfigPanel
                config={config}
                onConfigChange={handleConfigChange}
                onLoadingChange={handleLoadingChange}
                isLoading={isLoading}
              />
            </div>

            {/* Right Column - Preview */}
            <div className="lg:col-span-2">
              <LabelPreview
                labelPages={labelPages}
                config={config}
                isLoading={isLoading}
              />
            </div>
          </div>
        </main>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              <span className="text-gray-700">Processing...</span>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default App;
