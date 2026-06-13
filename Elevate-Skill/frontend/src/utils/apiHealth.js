import { api } from '../services/api';

/**
 * Check if the backend API is reachable
 * @returns {Promise<boolean>}
 */
export async function checkApiHealth() {
  try {
    const response = await api.get('/homepage/', { timeout: 3000 });
    return response.status === 200;
  } catch (error) {
    console.warn('API health check failed:', error.message);
    return false;
  }
}

/**
 * Get API status with details
 * @returns {Promise<Object>} { healthy, message, data }
 */
export async function getApiStatus() {
  try {
    const startTime = Date.now();
    const response = await api.get('/homepage/', { timeout: 5000 });
    const responseTime = Date.now() - startTime;

    return {
      healthy: true,
      message: 'API is operational',
      responseTime,
      dataAvailable: {
        hero: !!response.data?.hero,
        testimonials: Array.isArray(response.data?.testimonials) && response.data.testimonials.length > 0,
        faqs: Array.isArray(response.data?.faqs) && response.data.faqs.length > 0,
        about: !!response.data?.about,
        siteSettings: !!response.data?.site_settings
      }
    };
  } catch (error) {
    return {
      healthy: false,
      message: error.response?.status === 404 
        ? 'API endpoint not found'
        : error.message || 'API is not reachable',
      error: error.message
    };
  }
}

/**
 * Display API status in console (for debugging)
 */
export async function logApiStatus() {
  console.group('🔍 API Health Check');
  
  const status = await getApiStatus();
  
  if (status.healthy) {
    console.log('✅ Status: Healthy');
    console.log(`⏱️  Response Time: ${status.responseTime}ms`);
    console.log('📊 Data Available:');
    console.table(status.dataAvailable);
  } else {
    console.warn('❌ Status: Unhealthy');
    console.warn('📝 Message:', status.message);
    console.warn('🔄 Fallback: Using static content');
  }
  
  console.groupEnd();
}

/**
 * Test all API endpoints
 */
export async function testAllEndpoints() {
  const endpoints = [
    { name: 'Homepage', path: '/homepage/' },
    { name: 'Announcements', path: '/announcements/' },
    { name: 'News', path: '/news/' },
    { name: 'Courses', path: '/courses/' }
  ];

  console.group('🧪 API Endpoint Tests');

  const results = [];
  
  for (const endpoint of endpoints) {
    try {
      const startTime = Date.now();
      const response = await api.get(endpoint.path, { timeout: 3000 });
      const responseTime = Date.now() - startTime;
      
      results.push({
        endpoint: endpoint.name,
        status: '✅ OK',
        code: response.status,
        time: `${responseTime}ms`
      });
    } catch (error) {
      results.push({
        endpoint: endpoint.name,
        status: '❌ Failed',
        code: error.response?.status || 'N/A',
        time: 'N/A'
      });
    }
  }

  console.table(results);
  console.groupEnd();
  
  return results;
}

/**
 * Run comprehensive API diagnostics
 */
export async function runDiagnostics() {
  console.group('🏥 API Diagnostics');
  
  // 1. Check basic health
  await logApiStatus();
  
  // 2. Test cache
  console.log('\n💾 Cache Check:');
  const cache = localStorage.getItem('elevate_homepage_cache');
  if (cache) {
    try {
      const { timestamp } = JSON.parse(cache);
      const age = Math.floor((Date.now() - timestamp) / 1000 / 60);
      console.log(`✅ Cache exists (${age} minutes old)`);
    } catch {
      console.warn('⚠️  Cache corrupted');
    }
  } else {
    console.log('ℹ️  No cache found');
  }
  
  // 3. Test all endpoints
  console.log('\n🔗 Endpoint Tests:');
  await testAllEndpoints();
  
  console.groupEnd();
}

// Make it available in browser console for debugging
if (typeof window !== 'undefined') {
  window.apiDiagnostics = runDiagnostics;
  window.apiStatus = logApiStatus;
  window.testEndpoints = testAllEndpoints;
}
