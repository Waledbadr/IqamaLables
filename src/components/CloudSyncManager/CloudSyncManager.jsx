import React, { useState, useEffect } from 'react';
import { Cloud, CloudOff, Key, Check, X, RefreshCw, Info } from 'lucide-react';
import {
  isCloudSyncEnabled,
  getUserSyncCode,
  enableCloudSync,
  disableCloudSync,
  syncPresets,
} from '../../utils/cloudSync.js';

const CloudSyncManager = ({ presets, onPresetsSync }) => {
  const [isSyncEnabled, setIsSyncEnabled] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [showSetup, setShowSetup] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setIsSyncEnabled(isCloudSyncEnabled());
    setUserCode(getUserSyncCode() || '');
  }, []);

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleEnableSync = () => {
    if (inputCode.length !== 6 || !/^\d{6}$/.test(inputCode)) {
      showMessage('❌ الكود يجب أن يكون 6 أرقام / Code must be 6 digits', 'error');
      return;
    }

    const result = enableCloudSync(inputCode);
    
    if (result.success) {
      setIsSyncEnabled(true);
      setUserCode(inputCode);
      setShowSetup(false);
      setInputCode('');
      showMessage('✅ تم تفعيل التزامن السحابي! / Cloud sync enabled!', 'success');
      
      // Auto sync after enabling
      handleSync();
    } else {
      showMessage('❌ فشل تفعيل التزامن: ' + result.error, 'error');
    }
  };

  const handleDisableSync = () => {
    if (window.confirm('هل تريد تعطيل التزامن السحابي؟ / Disable cloud sync?\n\nستبقى البيانات في السحابة ويمكن الوصول إليها باستخدام نفس الكود.\nData will remain in cloud and can be accessed with the same code.')) {
      const result = disableCloudSync();
      
      if (result.success) {
        setIsSyncEnabled(false);
        setUserCode('');
        showMessage('✅ تم تعطيل التزامن السحابي / Cloud sync disabled', 'success');
      } else {
        showMessage('❌ فشل تعطيل التزامن: ' + result.error, 'error');
      }
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    showMessage('🔄 جاري المزامنة... / Syncing...', 'info');
    
    try {
      const result = await syncPresets(presets);
      
      if (result.success) {
        if (onPresetsSync) {
          onPresetsSync(result.presets);
        }
        showMessage(`✅ تم التزامن بنجاح! / Synced successfully! (${result.presets.length} presets)`, 'success');
      } else {
        showMessage('⚠️ فشل التزامن: ' + result.error, 'error');
      }
    } catch (error) {
      showMessage('❌ خطأ في التزامن: ' + error.message, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="cloud-sync-manager border-t border-gray-200 pt-4 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {isSyncEnabled ? (
            <Cloud className="w-5 h-5 text-blue-600" />
          ) : (
            <CloudOff className="w-5 h-5 text-gray-400" />
          )}
          <h3 className="text-sm font-semibold text-gray-900">
            التزامن السحابي / Cloud Sync
          </h3>
        </div>
        
        {isSyncEnabled && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
            ✓ نشط / Active
          </span>
        )}
      </div>

      {/* Messages */}
      {message && (
        <div className={`mb-3 p-2 rounded text-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
          message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
          'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Info Box */}
      {!isSyncEnabled && !showSetup && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-blue-800">
              <p className="font-medium mb-1">💡 ما هو التزامن السحابي؟</p>
              <ul className="text-xs space-y-1 list-disc list-inside">
                <li>احفظ قوالبك في السحابة</li>
                <li>وصول من أي جهاز أو متصفح</li>
                <li>تزامن تلقائي للتحديثات</li>
                <li>نسخة احتياطية آمنة</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Sync Status */}
      {isSyncEnabled && (
        <div className="mb-3 p-3 bg-white border border-gray-200 rounded">
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-gray-600 mb-1">كود التزامن / Sync Code:</p>
              <p className="font-mono text-lg font-bold text-blue-600">{userCode}</p>
              <p className="text-xs text-gray-500 mt-1">
                استخدم هذا الكود للوصول من أجهزة أخرى
              </p>
            </div>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="btn-secondary px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center space-x-2"
              title="مزامنة الآن / Sync now"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="text-xs">مزامنة</span>
            </button>
          </div>
        </div>
      )}

      {/* Setup Form */}
      {showSetup && (
        <div className="mb-3 p-4 bg-white border-2 border-blue-300 rounded">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            إعداد التزامن السحابي / Setup Cloud Sync
          </h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-700 mb-2">
                أدخل كود من 6 أرقام (سيكون كلمة المرور الخاصة بك)
                <br />
                <span className="text-gray-500">Enter a 6-digit code (this will be your password)</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength="6"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="input-field font-mono text-lg text-center tracking-widest"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                ⚠️ احفظ هذا الكود - ستحتاجه للوصول من أجهزة أخرى
              </p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleEnableSync}
                disabled={inputCode.length !== 6}
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>تفعيل / Enable</span>
              </button>
              <button
                onClick={() => {
                  setShowSetup(false);
                  setInputCode('');
                }}
                className="btn-secondary px-4"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        {!isSyncEnabled ? (
          <button
            onClick={() => setShowSetup(!showSetup)}
            className="btn-primary flex-1 flex items-center justify-center space-x-2 text-sm"
          >
            <Key className="w-4 h-4" />
            <span>تفعيل التزامن السحابي / Enable Cloud Sync</span>
          </button>
        ) : (
          <button
            onClick={handleDisableSync}
            className="btn-secondary flex-1 flex items-center justify-center space-x-2 text-sm text-red-600 hover:text-red-700"
          >
            <CloudOff className="w-4 h-4" />
            <span>تعطيل التزامن / Disable Sync</span>
          </button>
        )}
      </div>

      {/* Tips */}
      {isSyncEnabled && (
        <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
          <p className="font-medium mb-1">💡 نصائح:</p>
          <ul className="space-y-0.5 list-disc list-inside">
            <li>يتم الحفظ تلقائياً كل مرة تعدل فيها القوالب</li>
            <li>اضغط "مزامنة" لتحديث من السحابة</li>
            <li>احفظ الكود في مكان آمن</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default CloudSyncManager;
