'use client';

import { useState } from 'react';
import { apiClient, ApiClientError } from '@/lib/api-client';

export function TestApiClient() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [countryCode, setCountryCode] = useState('US');

  const testApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    const startTime = performance.now();
    
    try {
      const data = await apiClient.get(`/api/saily-plans?countryCode=${countryCode}`, {
        cache: true,
        cacheKey: `test-plans-${countryCode}`,
      });
      
      const endTime = performance.now();
      setDuration(endTime - startTime);
      setResult(data);
    } catch (err) {
      const endTime = performance.now();
      setDuration(endTime - startTime);
      
      if (err instanceof ApiClientError) {
        setError(`Error ${err.status}: ${err.message}`);
      } else {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  const testCache = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    // First request
    const start1 = performance.now();
    try {
      await apiClient.get(`/api/saily-plans?countryCode=${countryCode}`, {
        cache: true,
        cacheKey: `cache-test-${countryCode}`,
      });
    } catch (err) {
      // Ignore errors for cache test
    }
    const duration1 = performance.now() - start1;
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Second request (should use cache)
    const start2 = performance.now();
    try {
      const data = await apiClient.get(`/api/saily-plans?countryCode=${countryCode}`, {
        cache: true,
        cacheKey: `cache-test-${countryCode}`,
      });
      const duration2 = performance.now() - start2;
      
      setDuration(duration2);
      setResult({
        firstRequest: duration1.toFixed(2) + 'ms',
        secondRequest: duration2.toFixed(2) + 'ms',
        improvement: ((duration1 - duration2) / duration1 * 100).toFixed(1) + '%',
        data,
      });
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(`Error ${err.status}: ${err.message}`);
      } else {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  const testError = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      await apiClient.get('/api/nonexistent-endpoint', { cache: false });
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(`✅ Error handled correctly: ${err.status} - ${err.message}`);
        setResult({ status: err.status, message: err.message });
      } else {
        setError('❌ Unexpected error type');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      margin: '20px',
      borderRadius: '8px',
      background: '#fff',
      maxWidth: '800px'
    }}>
      <h2 style={{ marginTop: 0 }}>API Client Test</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Country Code:
        </label>
        <input
          type="text"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
          placeholder="US, GB, TH, etc."
          style={{
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            width: '100px',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
        <button 
          onClick={testApi} 
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: loading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
          }}
        >
          {loading ? 'Loading...' : 'Test API'}
        </button>

        <button 
          onClick={testCache} 
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: loading ? '#ccc' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
          }}
        >
          Test Caching
        </button>

        <button 
          onClick={testError} 
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: loading ? '#ccc' : '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
          }}
        >
          Test Error Handling
        </button>
      </div>
      
      {duration && (
        <div style={{ 
          padding: '10px', 
          background: '#f0f9ff', 
          borderRadius: '4px',
          marginBottom: '10px'
        }}>
          <strong>Duration:</strong> {duration.toFixed(2)}ms
        </div>
      )}
      
      {error && (
        <div style={{ 
          color: '#dc2626', 
          marginTop: '10px',
          padding: '10px',
          background: '#fef2f2',
          borderRadius: '4px',
          border: '1px solid #fecaca'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {result && (
        <div style={{ marginTop: '10px' }}>
          <strong style={{ color: '#10b981' }}>✅ Success!</strong>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '15px', 
            overflow: 'auto',
            maxHeight: '400px',
            borderRadius: '4px',
            fontSize: '12px',
            border: '1px solid #e5e7eb'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        background: '#f9fafb', 
        borderRadius: '4px',
        fontSize: '12px',
        color: '#6b7280'
      }}>
        <strong>Tips:</strong>
        <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
          <li>Open DevTools Network tab to see actual requests</li>
          <li>Check Console for any errors</li>
          <li>Test Caching button shows performance improvement</li>
          <li>Test Error Handling verifies error handling works</li>
        </ul>
      </div>
    </div>
  );
}

