/**
 * General utility functions
 */

/**
 * Format date to readable string
 */
export function formatDate(dateString: string, locale: string = 'bg-BG'): string {
  const date = new Date(dateString);
  
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Create a slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

/**
 * Combine class names conditionally
 */
export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Extract excerpt from HTML content
 */
export function extractExcerpt(html: string, maxLength: number = 200): string {
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  const decoded = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
  
  if (decoded.length <= maxLength) {
    return decoded;
  }
  
  // Truncate at word boundary
  const truncated = decoded.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

/**
 * Delay execution
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if a URL is external
 */
export function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url, 'https://travelesim.bg');
    return urlObj.hostname !== 'travelesim.bg';
  } catch {
    return false;
  }
}

/**
 * Sanitize HTML for safe rendering
 */
export function sanitizeHtml(html: string): string {
  // Basic sanitization - for production, consider using a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');
}

/**
 * Parse query string
 */
export function parseQueryString(query: string): Record<string, string> {
  const params = new URLSearchParams(query);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      const sourceValue = source[key as keyof T];
      const targetValue = target[key as keyof T];
      
      if (isObject(sourceValue) && isObject(targetValue)) {
        (output as any)[key] = deepMerge(targetValue as any, sourceValue as any);
      } else {
        (output as any)[key] = sourceValue;
      }
    });
  }
  
  return output;
}

function isObject(item: any): item is object {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}



