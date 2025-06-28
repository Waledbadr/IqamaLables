import React, { useState, useCallback } from 'react';
import AdvancedDragDropDesigner from './AdvancedDragDropDesigner';
import WYSIWYGEditor from './WYSIWYGEditor';
import { AdvancedButton } from '../UI';
import { Eye, Code, Save, ArrowLeft } from 'lucide-react';

/**
 * Main Label Designer Component
 * Provides interface for creating and editing labels with multiple design modes
 */
const LabelDesigner = ({
  onSave,
  onCancel,
  onPreview,
  labelConfig = {},
  initialData = null
}) => {
  const [designMode, setDesignMode] = useState('visual'); // 'visual' or 'code'
  const [currentDesign, setCurrentDesign] = useState(initialData?.elements || []);
  const [isDirty, setIsDirty] = useState(false);

  const handleSave = useCallback((designData) => {
    setIsDirty(false);
    onSave?.(designData);
  }, [onSave]);

  const handlePreview = useCallback((designData) => {
    setCurrentDesign(designData);
    onPreview?.(designData);
  }, [onPreview]);

  const handleDesignChange = useCallback((elements) => {
    setCurrentDesign(elements);
    setIsDirty(true);
  }, []);
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Premium Header with Glassmorphism */}
      <div className="relative backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-white/20 dark:border-slate-700/50 shadow-lg shadow-black/5">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10"></div>
        
        <div className="relative flex items-center justify-between p-6">
          <div className="flex items-center space-x-6">
            <AdvancedButton
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="group text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white/60 hover:bg-white/80 dark:bg-slate-800/60 dark:hover:bg-slate-700/80 backdrop-blur-sm border border-white/30 dark:border-slate-600/30 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Back
            </AdvancedButton>
            
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent dark:via-slate-600"></div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Label Designer Pro
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Advanced label creation studio</p>
              </div>
            </div>
            
            {isDirty && (
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                  Unsaved changes
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Premium Design Mode Toggle */}
            <div className="relative p-1 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/30 dark:border-slate-600/30 rounded-2xl shadow-lg">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setDesignMode('visual')}
                  className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    designMode === 'visual'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Eye className="w-4 h-4 mr-2 inline" />
                  Visual Studio
                  {designMode === 'visual' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30 -z-10"></div>
                  )}
                </button>
                <button
                  onClick={() => setDesignMode('code')}
                  className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    designMode === 'code'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 transform scale-105'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Code className="w-4 h-4 mr-2 inline" />
                  Code Editor
                  {designMode === 'code' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl blur opacity-30 -z-10"></div>
                  )}
                </button>
              </div>
            </div>

            {/* Premium Action Buttons */}
            <AdvancedButton
              variant="outline"
              size="sm"
              onClick={() => handlePreview(currentDesign)}
              className="group bg-white/60 hover:bg-white/80 dark:bg-slate-800/60 dark:hover:bg-slate-700/80 backdrop-blur-sm border border-white/30 dark:border-slate-600/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Preview
            </AdvancedButton>

            <AdvancedButton
              variant="primary"
              size="sm"
              onClick={() => handleSave(currentDesign)}
              disabled={!isDirty}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 border-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Save Design
              {!isDirty && (
                <div className="absolute inset-0 bg-white/10 rounded-lg"></div>
              )}
            </AdvancedButton>
          </div>
        </div>
      </div>

      {/* Designer Content */}
      <div className="flex-1 overflow-hidden">        {designMode === 'visual' ? (
          <AdvancedDragDropDesigner
            initialElements={currentDesign}
            labelConfig={labelConfig}
            onSave={handleSave}
            onCancel={onCancel}
            onPreview={handlePreview}
          />
        ) : (
          <WYSIWYGEditor
            initialData={currentDesign}
            labelConfig={labelConfig}
            onSave={handleSave}
            onCancel={onCancel}
            onPreview={handlePreview}
            onChange={handleDesignChange}
          />
        )}
      </div>
    </div>
  );
};

export default LabelDesigner;