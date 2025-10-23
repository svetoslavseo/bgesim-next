/**
 * Utility functions for table of contents extraction and processing
 */

export interface TOCItem {
  id: string;
  text: string;
  level: number;
  children?: TOCItem[];
}

/**
 * Generate a URL-friendly ID from heading text
 */
function generateHeadingId(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .trim()
    .replace(/[^\w\s\u0400-\u04FF]/g, '') // Remove special characters, keep Cyrillic
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .toLowerCase();
}

/**
 * Extract table of contents from HTML content
 * Handles both direct heading IDs, WordPress ez-toc format, and generates IDs for headings without them
 */
export function extractTableOfContents(content: string): TOCItem[] {
  const headings: TOCItem[] = [];
  
  // First, try to extract from ez-toc format (WordPress Easy Table of Contents)
  const ezTocIds: string[] = [];
  const ezTocRegex = /<span class="ez-toc-section"[^>]*id="([^"]*)"[^>]*><\/span>/gi;
  let match;
  
  while ((match = ezTocRegex.exec(content)) !== null) {
    const id = match[1];
    if (id) {
      ezTocIds.push(decodeURIComponent(id));
    }
  }
  
  // Find all headings and match with ez-toc IDs or generate new ones
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = parseInt(match[1] ?? '1');
    const headingText = match[2]?.replace(/<[^>]*>/g, '').trim();
    
    if (!headingText) continue;
    
    // Check if this heading text matches any of our ez-toc IDs (normalized)
    const normalizedText = headingText.replace(/[^\w\s\u0400-\u04FF]/g, '').replace(/\s+/g, '_').toLowerCase();
    const matchingId = ezTocIds.find(id => {
      const normalizedId = id.replace(/[^\w\s\u0400-\u04FF]/g, '').replace(/\s+/g, '_').toLowerCase();
      return normalizedId === normalizedText;
    });
    
    if (matchingId) {
      headings.push({
        id: matchingId,
        text: headingText,
        level,
      });
    } else {
      // Generate ID for heading without one
      const generatedId = generateHeadingId(headingText);
      headings.push({
        id: generatedId,
        text: headingText,
        level,
      });
    }
  }
  
  // If no ez-toc headings found, try direct heading extraction with existing IDs
  if (headings.length === 0) {
    const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[1-6]>/gi;
    
    while ((match = headingRegex.exec(content)) !== null) {
      const level = parseInt(match[1] ?? '1');
      const id = match[2] ?? '';
      const text = match[3]?.replace(/<[^>]*>/g, '').trim();
      
      if (text && id) {
        headings.push({
          id,
          text,
          level,
        });
      }
    }
  }

  // Build hierarchical structure
  const toc: TOCItem[] = [];
  const stack: TOCItem[] = [];

  headings.forEach((heading) => {
    const item: TOCItem = {
      id: heading.id,
      text: heading.text,
      level: heading.level,
      children: [],
    };

    // Find the correct parent
    while (stack.length > 0 && (stack[stack.length - 1]?.level ?? 0) >= heading.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      toc.push(item);
    } else {
      const parent = stack[stack.length - 1];
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(item);
      }
    }

    stack.push(item);
  });

  return toc;
}

/**
 * Extract table of contents from HTML content, filtered for specific heading levels
 * @param content HTML content
 * @param levels Array of heading levels to include (e.g., [2, 3] for H2 and H3 only)
 */
export function extractTableOfContentsFiltered(content: string, levels: number[] = [2, 3]): TOCItem[] {
  const allTocItems = extractTableOfContents(content);
  
  // Filter the TOC items to only include specified levels
  const filterTocItems = (items: TOCItem[]): TOCItem[] => {
    return items
      .filter(item => levels.includes(item.level))
      .map(item => ({
        ...item,
        children: item.children ? filterTocItems(item.children) : []
      }))
      .filter(item => item.children?.length > 0 || levels.includes(item.level));
  };
  
  return filterTocItems(allTocItems);
}

/**
 * Check if content has table of contents
 */
export function hasTableOfContents(content: string): boolean {
  // Check for ez-toc format first
  if (/<span class="ez-toc-section"[^>]*id="[^"]*"[^>]*>/i.test(content)) {
    return true;
  }
  
  // Check for direct heading IDs
  if (/<h[1-6][^>]*id="[^"]*"[^>]*>/i.test(content)) {
    return true;
  }
  
  // Check for any H2 or H3 headings (we'll generate IDs for them)
  return /<h[23][^>]*>/i.test(content);
}
