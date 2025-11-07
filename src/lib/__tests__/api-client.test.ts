/**
 * Unit tests for API Client
 * 
 * Run with: npm test api-client.test.ts
 */

import { ApiClient, ApiClientError } from '../api-client';

// Mock fetch globally
global.fetch = jest.fn();

describe('ApiClient', () => {
  let client: ApiClient;

  beforeEach(() => {
    client = new ApiClient({
      baseUrl: 'https://api.test.com',
      timeout: 5000,
      retries: 2,
      cache: {
        enabled: true,
        ttl: 1000,
        strategy: 'memory',
      },
    });
    jest.clearAllMocks();
    client.clearCache();
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockData = { success: true, data: 'test' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await client.get('/test');

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test.com/test',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should handle 404 errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ error: 'Not found' }),
      });

      await expect(client.get('/test')).rejects.toThrow(ApiClientError);
      
      try {
        await client.get('/test');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiClientError);
        expect((error as ApiClientError).status).toBe(404);
      }
    });

    it('should retry on network errors', async () => {
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new TypeError('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
          headers: new Headers({ 'content-type': 'application/json' }),
        });

      const result = await client.get('/test');

      expect(result).toEqual({ success: true });
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should cache responses', async () => {
      const mockData = { success: true, data: 'cached' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      // First request
      const result1 = await client.get('/test', { cache: true });
      // Second request (should use cache)
      const result2 = await client.get('/test', { cache: true });

      expect(result1).toEqual(mockData);
      expect(result2).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledTimes(1); // Only called once due to cache
    });

    it('should not cache when cache is disabled', async () => {
      const mockData = { success: true, data: 'test' };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockData,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      await client.get('/test', { cache: false });
      await client.get('/test', { cache: false });

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('POST requests', () => {
    it('should make successful POST request', async () => {
      const mockData = { success: true, id: '123' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      const result = await client.post('/test', { name: 'test' });

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test.com/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'test' }),
        })
      );
    });
  });

  describe('Error handling', () => {
    it('should throw ApiClientError for non-OK responses', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ error: 'Server error' }),
      });

      try {
        await client.get('/test');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(ApiClientError);
        expect((error as ApiClientError).status).toBe(500);
        expect((error as ApiClientError).message).toBeDefined();
      }
    });

    it('should handle 429 rate limiting with retry', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          statusText: 'Too Many Requests',
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({ error: 'Rate limit exceeded' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
          headers: new Headers({ 'content-type': 'application/json' }),
        });

      const result = await client.get('/test');

      expect(result).toEqual({ success: true });
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Cache management', () => {
    it('should clear all cache', async () => {
      const mockData = { data: 'test' };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockData,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      await client.get('/test', { cache: true });
      client.clearCache();
      await client.get('/test', { cache: true });

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should clear specific cache entry', async () => {
      const mockData = { data: 'test' };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockData,
        headers: new Headers({ 'content-type': 'application/json' }),
      });

      await client.get('/test', { cache: true, cacheKey: 'test-key' });
      client.clearCacheEntry('test-key');
      await client.get('/test', { cache: true, cacheKey: 'test-key' });

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Request deduplication', () => {
    it('should deduplicate simultaneous requests', async () => {
      const mockData = { data: 'test' };
      (global.fetch as jest.Mock).mockImplementation(
        () => new Promise(resolve =>
          setTimeout(() => resolve({
            ok: true,
            json: async () => mockData,
            headers: new Headers({ 'content-type': 'application/json' }),
          }), 100)
        )
      );

      // Make multiple simultaneous requests
      const promises = [
        client.get('/test', { cacheKey: 'dedup-test' }),
        client.get('/test', { cacheKey: 'dedup-test' }),
        client.get('/test', { cacheKey: 'dedup-test' }),
      ];

      await Promise.all(promises);

      // Should only make one actual request
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Timeout handling', () => {
    it('should timeout after specified time', async () => {
      jest.useFakeTimers();
      
      (global.fetch as jest.Mock).mockImplementation(
        () => new Promise((resolve) => {
          setTimeout(() => resolve({
            ok: true,
            json: async () => ({}),
            headers: new Headers({ 'content-type': 'application/json' }),
          }), 10000);
        })
      );

      const clientWithTimeout = new ApiClient({
        timeout: 5000,
      });

      const promise = clientWithTimeout.get('/test');
      
      jest.advanceTimersByTime(5000);
      
      await expect(promise).rejects.toThrow();
      
      jest.useRealTimers();
    });
  });
});

