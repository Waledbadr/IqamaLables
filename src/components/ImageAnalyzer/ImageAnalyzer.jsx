import { useState, useRef, useCallback } from 'react';
import { analyzeImage } from '../../utils/imageAnalysis.js';

const ImageAnalyzer = ({ onAnalysisComplete, isLoading, onLoadingChange }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [showCalibration, setShowCalibration] = useState(false);
  const [calibratedMeasurements, setCalibratedMeasurements] = useState({});
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Handle file selection
  const handleFileSelect = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('الرجاء رفع ملف صورة صالح');
      return;
    }

    setError(null);
    onLoadingChange(true);

    try {
      // Create preview
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);

      // Analyze image
      const result = await analyzeImage(file);
      setAnalysisResult(result);
      
      // Initialize calibrated measurements with detected values
      setCalibratedMeasurements({
        labelWidth: result.labelWidth || 50,
        labelHeight: result.labelHeight || 25,
        marginTop: result.marginTop || 10,
        marginLeft: result.marginLeft || 10,
        marginRight: result.marginRight || 10,
        marginBottom: result.marginBottom || 10,
        horizontalSpacing: result.horizontalSpacing || 5,
        verticalSpacing: result.verticalSpacing || 3
      });
      
      // Pass result to parent component
      onAnalysisComplete(result);
      
    } catch (err) {
      console.error('Image analysis failed:', err);
      setError('فشل في تحليل الصورة. تأكد من أن الصورة واضحة وتحتوي على ملصقات.');
    } finally {
      onLoadingChange(false);
    }
  }, [onAnalysisComplete, onLoadingChange]);

  // Apply standard size
  const applyStandardSize = useCallback((width, height) => {
    setCalibratedMeasurements(prev => ({
      ...prev,
      labelWidth: width,
      labelHeight: height
    }));
  }, []);

  // Apply calibrated measurements
  const applyCalibratedMeasurements = useCallback(() => {
    const calibratedResult = {
      ...analysisResult,
      ...calibratedMeasurements,
      measurementConfidence: 'calibrated'
    };
    setAnalysisResult(calibratedResult);
    onAnalysisComplete(calibratedResult);
    setShowCalibration(false);
  }, [analysisResult, calibratedMeasurements, onAnalysisComplete]);

  // Drag and drop handlers
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
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, [handleFileSelect]);

  const handleInputChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  }, [handleFileSelect]);

  const handleReset = useCallback(() => {
    setPreviewImage(null);
    setAnalysisResult(null);
    setError(null);
    setShowCalibration(false);
    setCalibratedMeasurements({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Helper function to check if measurements seem incorrect
  const measurementsSeemIncorrect = useCallback((result) => {
    if (!result) return false;
    
    // Check for unrealistic dimensions
    const unrealisticDimensions = result.labelWidth < 10 || result.labelWidth > 200 || 
                                 result.labelHeight < 5 || result.labelHeight > 100;
    
    // Check for very low confidence
    const lowConfidence = result.confidence < 0.4;
    
    // Check if debug info indicates corrections were applied
    const correctionsApplied = result.debugInfo?.correction?.applied;
    
    return unrealisticDimensions || lowConfidence || correctionsApplied;
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          تحليل صورة الملصقات - Label Sheet Analysis
        </h3>
        {previewImage && (
          <button
            onClick={handleReset}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50"
          >
            مسح - Clear
          </button>
        )}
      </div>

      {/* Upload Area */}
      {!previewImage && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-4">
            <div className="text-6xl text-gray-400">📷</div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                اسحب صورة ورقة الملصقات هنا
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Drag label sheet image here
              </p>
              <p className="text-xs text-gray-500 mt-2">
                أو انقر لاختيار ملف - Or click to select file
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Preview and Analysis */}
      {previewImage && (
        <div className="space-y-4">
          {/* Image Preview */}
          <div className="border rounded-lg p-4 bg-white">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              معاينة الصورة - Image Preview
            </h4>
            <div className="relative">
              <img
                src={previewImage}
                alt="Label sheet preview"
                className="max-w-full max-h-64 mx-auto border rounded"
                style={{ maxHeight: '256px' }}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 max-w-full max-h-64 mx-auto border rounded opacity-75"
                style={{ maxHeight: '256px', pointerEvents: 'none' }}
              />
            </div>
          </div>

          {/* Analysis Results */}
          {analysisResult && (
            <div className="space-y-4">
              {/* Main Results Panel */}
              <div className="border rounded-lg p-4 bg-white">                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-700">
                    نتائج التحليل - Analysis Results
                  </h4>
                  <div className="flex space-x-2 space-x-reverse">
                    {/* Debug Info Toggle */}
                    {analysisResult.debugInfo && (
                      <button
                        onClick={() => setShowDebugInfo(!showDebugInfo)}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${
                          measurementsSeemIncorrect(analysisResult)
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title="عرض معلومات التصحيح - Show debug information"
                      >
                        {measurementsSeemIncorrect(analysisResult) && '⚠️ '}
                        🔧 معلومات تقنية
                      </button>
                    )}
                    
                    <button
                      onClick={() => onAnalysisComplete(analysisResult)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      تطبيق الإعدادات - Apply Settings
                    </button>
                  </div>
                </div>
                
                {/* Debug Information Panel */}
                {showDebugInfo && analysisResult.debugInfo && (
                  <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-800 mb-3">
                      🔧 معلومات التشخيص - Diagnostic Information
                    </h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Image Information */}
                      <div className="space-y-2">
                        <h6 className="font-medium text-gray-700">معلومات الصورة:</h6>
                        <div className="space-y-1 text-gray-600 font-mono">
                          <div>الحجم الأصلي: {analysisResult.debugInfo.originalSize?.width}×{analysisResult.debugInfo.originalSize?.height}px</div>
                          <div>حجم المعالجة: {analysisResult.debugInfo.canvasSize?.width}×{analysisResult.debugInfo.canvasSize?.height}px</div>
                          <div>معامل التصغير: {analysisResult.debugInfo.scale?.toFixed(3)}</div>
                          <div>DPI المقدر: {analysisResult.estimatedDPI}</div>
                        </div>
                      </div>
                      
                      {/* Detection Results */}
                      <div className="space-y-2">
                        <h6 className="font-medium text-gray-700">نتائج الكشف:</h6>
                        <div className="space-y-1 text-gray-600 font-mono">
                          <div>الملصقات المكتشفة: {analysisResult.debugInfo.detectedLabels}</div>
                          <div>متوسط الحجم (بكسل): {analysisResult.debugInfo.avgPixelSize?.width?.toFixed(1)}×{analysisResult.debugInfo.avgPixelSize?.height?.toFixed(1)}</div>
                          <div>القياسات الأولية: {analysisResult.debugInfo.initialMeasurements?.width?.toFixed(1)}×{analysisResult.debugInfo.initialMeasurements?.height?.toFixed(1)}mm</div>
                        </div>
                      </div>
                      
                      {/* DPI Estimation Details */}
                      {analysisResult.debugInfo.chosenDPI && (
                        <div className="space-y-2">
                          <h6 className="font-medium text-gray-700">تقدير DPI:</h6>
                          <div className="space-y-1 text-gray-600">
                            <div>الطريقة: {analysisResult.debugInfo.chosenDPI.method}</div>
                            <div>الثقة: {(analysisResult.debugInfo.chosenDPI.confidence * 100).toFixed(1)}%</div>
                            {analysisResult.debugInfo.chosenDPI.matchedSize && (
                              <div>الحجم المطابق: {analysisResult.debugInfo.chosenDPI.matchedSize}</div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Corrections Applied */}
                      {analysisResult.debugInfo.correction?.applied && (
                        <div className="space-y-2 md:col-span-2">
                          <h6 className="font-medium text-red-700">⚠️ تصحيحات مطبقة:</h6>
                          <div className="space-y-1 text-red-600 text-xs">
                            <div>السبب: {analysisResult.debugInfo.correction.reason}</div>
                            <div>معامل التصحيح: {analysisResult.debugInfo.correction.factor?.toFixed(3)}</div>
                            <div className="italic">القياسات الأصلية قد تكون غير دقيقة</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Suggestions based on debug info */}
                    {measurementsSeemIncorrect(analysisResult) && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <h6 className="text-sm font-medium text-yellow-800 mb-2">💡 توصيات للتحسين:</h6>
                        <ul className="text-xs text-yellow-700 space-y-1">
                          <li>• تأكد من أن الصورة واضحة ومضاءة جيداً</li>
                          <li>• تأكد من أن الملصقات مرئية بوضوح في الصورة</li>
                          <li>• استخدم ميزة "المعايرة اليدوية" أدناه لتصحيح القياسات</li>
                          <li>• جرب التقاط صورة من زاوية مختلفة أو بإضاءة أفضل</li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Detected Measurements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Label Dimensions */}
                  <div className="border rounded-lg p-3 bg-green-50">
                    <h5 className="text-sm font-medium text-green-800 mb-2">
                      أبعاد الملصق - Label Dimensions
                    </h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">العرض - Width:</span>
                        <span className="font-mono font-medium">{analysisResult.labelWidth?.toFixed(1)} مم</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">الارتفاع - Height:</span>
                        <span className="font-mono font-medium">{analysisResult.labelHeight?.toFixed(1)} مم</span>
                      </div>
                      {analysisResult.detectedStandardSize && (
                        <div className="text-xs text-green-700 mt-1">
                          نوع مكتشف: {analysisResult.detectedStandardSize}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Layout Information */}
                  <div className="border rounded-lg p-3 bg-blue-50">
                    <h5 className="text-sm font-medium text-blue-800 mb-2">
                      تخطيط الملصقات - Layout
                    </h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">عدد الصفوف:</span>
                        <span className="font-mono font-medium">{analysisResult.labelsPerColumn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">عدد الأعمدة:</span>
                        <span className="font-mono font-medium">{analysisResult.labelsPerRow}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">إجمالي الملصقات:</span>
                        <span className="font-mono font-medium">{analysisResult.totalLabels || (analysisResult.labelsPerRow * analysisResult.labelsPerColumn)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Margins */}
                  <div className="border rounded-lg p-3 bg-yellow-50">
                    <h5 className="text-sm font-medium text-yellow-800 mb-2">
                      الهوامش - Margins
                    </h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">علوي - Top:</span>
                        <span className="font-mono font-medium">{analysisResult.marginTop?.toFixed(1)} مم</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">أيسر - Left:</span>
                        <span className="font-mono font-medium">{analysisResult.marginLeft?.toFixed(1)} مم</span>
                      </div>
                    </div>
                  </div>

                  {/* Spacing */}
                  <div className="border rounded-lg p-3 bg-purple-50">
                    <h5 className="text-sm font-medium text-purple-800 mb-2">
                      المسافات - Spacing
                    </h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">أفقي - Horizontal:</span>
                        <span className="font-mono font-medium">{analysisResult.horizontalSpacing?.toFixed(1)} مم</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">عمودي - Vertical:</span>
                        <span className="font-mono font-medium">{analysisResult.verticalSpacing?.toFixed(1)} مم</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quality Assessment */}
                <div className="border-t pt-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-xs font-medium text-gray-600 uppercase mb-1">دقة الكشف</h5>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          analysisResult.confidence > 0.8 ? 'bg-green-500' : 
                          analysisResult.confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-sm font-medium">
                          {(analysisResult.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xs font-medium text-gray-600 uppercase mb-1">جودة الصورة</h5>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          analysisResult.imageQuality?.level === 'excellent' || analysisResult.imageQuality === 'good' ? 'bg-green-500' :
                          analysisResult.imageQuality?.level === 'good' || analysisResult.imageQuality === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-sm font-medium">
                          {analysisResult.imageQuality?.level === 'excellent' ? 'ممتازة' :
                           analysisResult.imageQuality?.level === 'good' || analysisResult.imageQuality === 'good' ? 'جيدة' :
                           analysisResult.imageQuality?.level === 'fair' || analysisResult.imageQuality === 'fair' ? 'متوسطة' : 'ضعيفة'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calibration Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-medium text-gray-700">
                      🔧 معايرة المقاسات - Measurement Calibration
                    </h5>
                    <button
                      onClick={() => setShowCalibration(!showCalibration)}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${
                        showCalibration 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {showCalibration ? '✕ إغلاق' : '⚙️ تصحيح المقاسات'}
                    </button>
                  </div>
                  
                  {showCalibration && (
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
                      <div className="text-xs text-gray-600 mb-3">
                        💡 إذا كانت المقاسات المكتشفة غير صحيحة، يمكنك تصحيحها يدوياً هنا:
                      </div>
                      
                      {/* Manual Size Input */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            عرض الملصق (مم) - Label Width
                          </label>
                          <input
                            type="number"
                            value={calibratedMeasurements.labelWidth || ''}
                            onChange={(e) => setCalibratedMeasurements(prev => ({
                              ...prev,
                              labelWidth: parseFloat(e.target.value) || 0
                            }))}
                            step="0.1"
                            min="5"
                            max="200"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="50.0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            ارتفاع الملصق (مم) - Label Height
                          </label>
                          <input
                            type="number"
                            value={calibratedMeasurements.labelHeight || ''}
                            onChange={(e) => setCalibratedMeasurements(prev => ({
                              ...prev,
                              labelHeight: parseFloat(e.target.value) || 0
                            }))}
                            step="0.1"
                            min="5"
                            max="100"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="25.0"
                          />
                        </div>
                      </div>

                      {/* Standard Size Buttons */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          🏷️ أو اختر مقاساً قياسياً - Select Standard Size:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => applyStandardSize(50, 25)}
                            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 text-left"
                          >
                            🪪 هوية عادية<br />
                            <span className="text-gray-500">50×25 مم</span>
                          </button>
                          <button
                            onClick={() => applyStandardSize(66.7, 25.4)}
                            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 text-left"
                          >
                            📄 Avery 5160<br />
                            <span className="text-gray-500">66.7×25.4 مم</span>
                          </button>
                          <button
                            onClick={() => applyStandardSize(101.6, 25.4)}
                            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 text-left"
                          >
                            📋 Avery 5161<br />
                            <span className="text-gray-500">101.6×25.4 مم</span>
                          </button>
                          <button
                            onClick={() => applyStandardSize(70, 37)}
                            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 text-left"
                          >
                            🆔 هوية كبيرة<br />
                            <span className="text-gray-500">70×37 مم</span>
                          </button>
                        </div>
                      </div>

                      {/* Apply Calibration Button */}
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setShowCalibration(false)}
                          className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
                        >
                          إلغاء
                        </button>
                        <button
                          onClick={applyCalibratedMeasurements}
                          className="px-4 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                        >
                          ✅ تطبيق التصحيحات
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Debug Information */}
                {showDebugInfo && analysisResult.debugInfo && (
                  <div className="border-t pt-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h6 className="text-sm font-medium text-gray-700 mb-2">🐞 معلومات التصحيح - Debug Information:</h6>
                      <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                        {JSON.stringify(analysisResult.debugInfo, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h6 className="text-sm font-medium text-blue-800 mb-2">💡 اقتراحات التحسين:</h6>
                      <ul className="list-disc list-inside text-xs text-blue-700 space-y-1">
                        {analysisResult.suggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="border border-red-300 rounded-lg p-4 bg-red-50">
          <div className="flex items-center space-x-2">
            <span className="text-red-600">⚠️</span>
            <span className="text-sm text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">🔍 جاري تحليل الصورة...</span>
        </div>
      )}

      {/* Instructions */}
      <div className="text-xs text-gray-500 bg-gray-50 rounded p-3">
        <h5 className="font-medium mb-1">📋 نصائح للحصول على أفضل النتائج:</h5>
        <ul className="list-disc list-inside space-y-1">
          <li>تأكد من أن الصورة واضحة وبدون ضبابية</li>
          <li>اجعل الإضاءة متساوية على كامل الورقة</li>
          <li>تأكد من أن حدود الملصقات واضحة ومرئية</li>
          <li>اجعل الورقة مستقيمة في الصورة (بدون انحراف)</li>
          <li>استخدم خلفية بيضاء أو فاتحة خلف الورقة</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageAnalyzer;
