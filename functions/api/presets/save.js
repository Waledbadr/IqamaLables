/**
 * API Endpoint: Save user presets to Cloudflare KV
 * POST /api/presets/save
 * Body: { userId: string, presets: array }
 */

export async function onRequestPost(context) {
  try {
    const { PRESETS } = context.env;
    
    // Get request data
    const data = await context.request.json();
    const { userId, presets } = data;
    
    // Validate input
    if (!userId || !presets) {
      return new Response(
        JSON.stringify({ error: 'Missing userId or presets' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Validate presets structure
    if (!Array.isArray(presets)) {
      return new Response(
        JSON.stringify({ error: 'Presets must be an array' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Create storage key
    const key = `user_${userId}_presets`;
    
    // Add metadata
    const dataToStore = {
      presets,
      lastUpdated: new Date().toISOString(),
      version: '1.0'
    };
    
    // Save to KV
    await PRESETS.put(key, JSON.stringify(dataToStore));
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Presets saved successfully',
        count: presets.length 
      }), 
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
    
  } catch (error) {
    console.error('Error saving presets:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle OPTIONS for CORS
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
