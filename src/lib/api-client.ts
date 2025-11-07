/**
 * API Client with Error Handling and Caching
 * 
 * Best practices for Next.js API integration:
 * - Automatic retry with exponential backoff
 * - Request/response caching
 * - Type-safe error handling
 * - Timeout handling
 * - Request deduplication
 */

export interface ApiClientConfig {
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cache?: {
    enabled: boolean;
    ttl?: number; // Time to live in milliseconds
    strategy?: 'memory' | 'localStorage';
  };
  headers?: Record<string, string>;
}

export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  data?: any;
  code?: string;
}

export class ApiClientError extends Error {
  status?: number;
  statusText?: string;
  data?: any;
  code?: string;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiClientError';
    this.status = error.status;
    this.statusText = error.statusText;
    this.data = error.data;
    this.code = error.code;
  }
}

// In-memory cache for server-side and client-side
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

// LocalStorage cache for client-side only
class LocalStorageCache {
  private prefix = 'api_cache_';

  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);
      const now = Date.now();

      if (now - entry.timestamp > entry.ttl) {
        localStorage.removeItem(this.prefix + key);
        return null;
      }

      return entry.data;
    } catch {
      return null;
    }
  }

  set<T>(key: string, data: T, ttl: number): void {
    if (typeof window === 'undefined') return;

    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(this.prefix + key, JSON.stringify(entry));
    } catch (error) {
      // LocalStorage might be full or disabled
      console.warn('Failed to cache in localStorage:', error);
    }
  }

  clear(): void {
    if (typeof window === 'undefined') return;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear localStorage cache:', error);
    }
  }

  delete(key: string): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.warn('Failed to delete from localStorage cache:', error);
    }
  }
}

// Request deduplication - prevents multiple identical requests
class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<any>>();

  async deduplicate<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    const existing = this.pendingRequests.get(key);
    if (existing) {
      return existing;
    }

    const promise = requestFn()
      .finally(() => {
        this.pendingRequests.delete(key);
      });

    this.pendingRequests.set(key, promise);
    return promise;
  }
}

export class ApiClient {
  private config: Required<ApiClientConfig>;
  private memoryCache: MemoryCache;
  private localStorageCache: LocalStorageCache;
  private deduplicator: RequestDeduplicator;

  constructor(config: ApiClientConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl || '',
      timeout: config.timeout || 30000, // 30 seconds
      retries: config.retries ?? 3,
      retryDelay: config.retryDelay || 1000, // 1 second
      cache: {
        enabled: config.cache?.enabled ?? true,
        ttl: config.cache?.ttl || 5 * 60 * 1000, // 5 minutes default
        strategy: config.cache?.strategy || 'memory',
      },
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    };

    this.memoryCache = new MemoryCache();
    this.localStorageCache = new LocalStorageCache();
    this.deduplicator = new RequestDeduplicator();
  }

  /**
   * Create a cache key from URL and options
   */
  private getCacheKey(url: string, options?: RequestInit): string {
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  /**
   * Get from cache based on strategy
   */
  private getCached<T>(key: string): T | null {
    if (!this.config.cache.enabled) return null;

    if (this.config.cache.strategy === 'localStorage') {
      return this.localStorageCache.get<T>(key);
    }

    return this.memoryCache.get<T>(key);
  }

  /**
   * Set cache based on strategy
   */
  private setCache<T>(key: string, data: T): void {
    if (!this.config.cache.enabled) return;

    if (this.config.cache.strategy === 'localStorage') {
      this.localStorageCache.set(key, data, this.config.cache.ttl);
    } else {
      this.memoryCache.set(key, data, this.config.cache.ttl);
    }
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: any): boolean {
    // Network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return true;
    }

    // Timeout errors
    if (error.code === 'ETIMEDOUT' || error.name === 'TimeoutError') {
      return true;
    }

    // 5xx server errors
    if (error.status >= 500 && error.status < 600) {
      return true;
    }

    // 429 Too Many Requests
    if (error.status === 429) {
      return true;
    }

    return false;
  }

  /**
   * Create timeout promise
   */
  private createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request timeout after ${timeout}ms`));
      }, timeout);
    });
  }

  /**
   * Execute fetch with timeout
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await Promise.race([
        fetch(url, {
          ...options,
          signal: controller.signal,
        }),
        this.createTimeoutPromise(timeout),
      ]);

      clearTimeout(timeoutId);
      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  /**
   * Parse error response
   */
  private async parseErrorResponse(response: Response): Promise<ApiError> {
    let data: any;
    const contentType = response.headers.get('content-type');

    try {
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    } catch {
      data = null;
    }

    return {
      message: data?.message || data?.error || response.statusText || 'Request failed',
      status: response.status,
      statusText: response.statusText,
      data,
      code: data?.code,
    };
  }

  /**
   * Execute request with retry logic
   */
  private async executeRequest<T>(
    url: string,
    options: RequestInit = {},
    attempt = 0
  ): Promise<T> {
    const fullUrl = url.startsWith('http') ? url : `${this.config.baseUrl}${url}`;

    try {
      const response = await this.fetchWithTimeout(
        fullUrl,
        {
          ...options,
          headers: {
            ...this.config.headers,
            ...options.headers,
          },
        },
        this.config.timeout
      );

      // Handle non-OK responses
      if (!response.ok) {
        const error = await this.parseErrorResponse(response);
        throw new ApiClientError(error);
      }

      // Parse response
      const contentType = response.headers.get('content-type');
      let data: T;

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = (await response.text()) as unknown as T;
      }

      return data;
    } catch (error: any) {
      // Check if we should retry
      const shouldRetry =
        attempt < this.config.retries &&
        this.isRetryableError(error);

      if (shouldRetry) {
        // Exponential backoff: delay = baseDelay * 2^attempt
        const delay = this.config.retryDelay * Math.pow(2, attempt);
        await this.sleep(delay);

        return this.executeRequest<T>(url, options, attempt + 1);
      }

      // Re-throw if not retryable or max retries reached
      if (error instanceof ApiClientError) {
        throw error;
      }

      throw new ApiClientError({
        message: error.message || 'Request failed',
        code: error.code,
      });
    }
  }

  /**
   * GET request
   */
  async get<T>(
    url: string,
    options?: {
      cache?: boolean;
      cacheKey?: string;
      headers?: Record<string, string>;
    }
  ): Promise<T> {
    const cacheKey = options?.cacheKey || this.getCacheKey(url, { method: 'GET' });

    // Check cache first (only for GET requests)
    if (options?.cache !== false) {
      const cached = this.getCached<T>(cacheKey);
      if (cached !== null) {
        return cached;
      }
    }

    // Deduplicate requests
    return this.deduplicator.deduplicate(cacheKey, async () => {
      const data = await this.executeRequest<T>(url, {
        method: 'GET',
        headers: options?.headers,
      });

      // Cache successful response
      if (options?.cache !== false) {
        this.setCache(cacheKey, data);
      }

      return data;
    });
  }

  /**
   * POST request
   */
  async post<T>(
    url: string,
    body?: any,
    options?: {
      headers?: Record<string, string>;
    }
  ): Promise<T> {
    return this.executeRequest<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers: options?.headers,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    url: string,
    body?: any,
    options?: {
      headers?: Record<string, string>;
    }
  ): Promise<T> {
    return this.executeRequest<T>(url, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      headers: options?.headers,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(
    url: string,
    options?: {
      headers?: Record<string, string>;
    }
  ): Promise<T> {
    return this.executeRequest<T>(url, {
      method: 'DELETE',
      headers: options?.headers,
    });
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.memoryCache.clear();
    this.localStorageCache.clear();
  }

  /**
   * Clear specific cache entry
   */
  clearCacheEntry(key: string): void {
    this.memoryCache.delete(key);
    this.localStorageCache.delete(key);
  }
}

// Default instance
export const apiClient = new ApiClient({
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5 minutes
    strategy: 'memory',
  },
});

// Helper function for Next.js API routes (server-side)
export async function handleApiError(error: unknown): Promise<Response> {
  console.error('API Error:', error);

  if (error instanceof ApiClientError) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        status: error.status,
        data: error.data,
      }),
      {
        status: error.status || 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  if (error instanceof Error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: false,
      error: 'Unknown error occurred',
    }),
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

