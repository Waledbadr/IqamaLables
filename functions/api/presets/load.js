/**
 * API Endpoint: Load user presets from Cloudflare KV
 * GET /api/presets/load?userId=xxxxx
 */

export async function onRequestGet(context) {
  try {
    const { PRESETS } = context.env;
    
    // Get userId from query parameters
    const url = new URL(context.request.url);
    const userId = url.searchParams.get('userId');
    
    // Validate input
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId parameter' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Create storage key
    const key = `user_${userId}_presets`;
    
    // Load from KV
    const data = await PRESETS.get(key);
    
    if (!data) {
      return new Response(
        JSON.stringify({ 
          success: true,
          presets: [],
          message: 'No presets found for this user'
        }), 
        { 
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }
    
    // Parse and return data
    const parsedData = JSON.parse(data);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        presets: parsedData.presets || [],
        lastUpdated: parsedData.lastUpdated,
        version: parsedData.version
      }), 
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache'
        }
      }
    );
    
  } catch (error) {
    console.error('Error loading presets:', error);
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
