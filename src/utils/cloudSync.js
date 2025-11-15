/**
 * Cloud Sync Service for Iqama Labels
 * Handles synchronization between localStorage and Cloudflare KV
 */

const SYNC_ENABLED_KEY = 'cloudSyncEnabled';
const USER_CODE_KEY = 'userSyncCode';

// Generate a simple hash from user code (6 digits)
export const hashUserCode = (code) => {
  if (!code || code.length !== 6) {
    throw new Error('User code must be 6 digits');
  }
  
  // Simple hash - for production, use a proper hash function
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = ((hash << 5) - hash) + code.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
};

// Check if cloud sync is enabled
export const isCloudSyncEnabled = () => {
  try {
    return localStorage.getItem(SYNC_ENABLED_KEY) === 'true';
  } catch {
    return false;
  }
};

// Get user sync code
export const getUserSyncCode = () => {
  try {
    return localStorage.getItem(USER_CODE_KEY);
  } catch {
    return null;
  }
};

// Enable cloud sync with user code
export const enableCloudSync = (userCode) => {
  try {
    const userId = hashUserCode(userCode);
    localStorage.setItem(SYNC_ENABLED_KEY, 'true');
    localStorage.setItem(USER_CODE_KEY, userCode);
    return { success: true, userId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Disable cloud sync
export const disableCloudSync = () => {
  try {
    localStorage.removeItem(SYNC_ENABLED_KEY);
    localStorage.removeItem(USER_CODE_KEY);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Save presets to cloud
export const savePresetsToCloud = async (presets) => {
  if (!isCloudSyncEnabled()) {
    return { success: false, error: 'Cloud sync is not enabled' };
  }
  
  try {
    const userCode = getUserSyncCode();
    if (!userCode) {
      return { success: false, error: 'User code not found' };
    }
    
    const userId = hashUserCode(userCode);
    
    const response = await fetch('/api/presets/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        presets,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save to cloud');
    }
    
    const result = await response.json();
    return { success: true, data: result };
    
  } catch (error) {
    console.error('Error saving to cloud:', error);
    return { success: false, error: error.message };
  }
};

// Load presets from cloud
export const loadPresetsFromCloud = async () => {
  if (!isCloudSyncEnabled()) {
    return { success: false, error: 'Cloud sync is not enabled' };
  }
  
  try {
    const userCode = getUserSyncCode();
    if (!userCode) {
      return { success: false, error: 'User code not found' };
    }
    
    const userId = hashUserCode(userCode);
    
    const response = await fetch(`/api/presets/load?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to load from cloud');
    }
    
    const result = await response.json();
    return { success: true, data: result };
    
  } catch (error) {
    console.error('Error loading from cloud:', error);
    return { success: false, error: error.message };
  }
};

// Sync presets (merge local and cloud)
export const syncPresets = async (localPresets) => {
  if (!isCloudSyncEnabled()) {
    return { success: false, error: 'Cloud sync is not enabled', presets: localPresets };
  }
  
  try {
    // Load from cloud
    const cloudResult = await loadPresetsFromCloud();
    
    if (!cloudResult.success) {
      return { success: false, error: cloudResult.error, presets: localPresets };
    }
    
    const cloudPresets = cloudResult.data.presets || [];
    
    // Merge: keep unique presets by ID
    const mergedMap = new Map();
    
    // Add local presets first
    localPresets.forEach(preset => {
      mergedMap.set(preset.id, preset);
    });
    
    // Add/update with cloud presets (cloud takes precedence if newer)
    cloudPresets.forEach(preset => {
      const existing = mergedMap.get(preset.id);
      if (!existing || new Date(preset.createdAt) > new Date(existing.createdAt)) {
        mergedMap.set(preset.id, preset);
      }
    });
    
    const mergedPresets = Array.from(mergedMap.values());
    
    // Save merged result back to cloud
    await savePresetsToCloud(mergedPresets);
    
    return { 
      success: true, 
      presets: mergedPresets,
      lastUpdated: cloudResult.data.lastUpdated
    };
    
  } catch (error) {
    console.error('Error syncing presets:', error);
    return { success: false, error: error.message, presets: localPresets };
  }
};

// Auto-save to cloud with debounce
let saveTimeout = null;
export const autoSaveToCloud = (presets, delay = 2000) => {
  if (!isCloudSyncEnabled()) {
    return;
  }
  
  // Clear previous timeout
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  
  // Set new timeout
  saveTimeout = setTimeout(async () => {
    const result = await savePresetsToCloud(presets);
    if (result.success) {
      console.log('✓ Auto-saved to cloud');
    } else {
      console.warn('⚠ Auto-save failed:', result.error);
    }
  }, delay);
};
