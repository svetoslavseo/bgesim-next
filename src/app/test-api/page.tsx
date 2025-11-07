import { TestApiClient } from '@/components/test/TestApiClient';

export default function TestApiPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '20px' }}>API Client Testing</h1>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          Use this page to test the API client improvements including error handling, caching, and performance.
        </p>
        <TestApiClient />
      </div>
    </div>
  );
}

