'use client';

import { useState, useEffect } from 'react';
import { extractTableOfContentsFiltered, hasTableOfContents, type TOCItem } from '@/lib/toc';
import styles from './DesktopTableOfContents.module.css';

interface DesktopTableOfContentsProps {
  content: string;
  className?: string;
}

export default function DesktopTableOfContents({ content, className = '' }: DesktopTableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');
  const [isSticky, setIsSticky] = useState(false);
  const [tocPosition, setTocPosition] = useState<number>(0);
  const [headerOffset, setHeaderOffset] = useState(100); // Default value, will be updated dynamically
  const [isPositioned, setIsPositioned] = useState(false); // Track if TOC has been positioned

  // Calculate header offset dynamically on mount
  useEffect(() => {
    const calculateHeaderOffset = () => {
      const headerElement = document.querySelector('header, nav, [class*="header"], [class*="nav"]');
      if (headerElement) {
        const headerRect = headerElement.getBoundingClientRect();
        // Set headerOffset to header height + desired padding below header
        const newOffset = headerRect.height + 20;
        setHeaderOffset(newOffset);
        console.log('DesktopTableOfContents: Header offset set to', newOffset);
      } else {
        // Fallback if no header found
        setHeaderOffset(120);
      }
    };
    
    calculateHeaderOffset();
    
    // Also recalculate on window resize
    window.addEventListener('resize', calculateHeaderOffset);
    return () => window.removeEventListener('resize', calculateHeaderOffset);
  }, []);

  useEffect(() => {
    console.log('DesktopTableOfContents: Checking content for TOC...');
    console.log('DesktopTableOfContents: hasTableOfContents:', hasTableOfContents(content));
    
    if (hasTableOfContents(content)) {
      const filteredTocItems = extractTableOfContentsFiltered(content, [2, 3]);
      console.log('DesktopTableOfContents: Filtered TOC items:', filteredTocItems);
      setTocItems(filteredTocItems);
      
      // Add IDs to headings in the DOM if they don't exist
      const addIdsToHeadings = () => {
        const headings = document.querySelectorAll('h2, h3');
        console.log('DesktopTableOfContents: Found headings:', headings.length);
        headings.forEach((heading) => {
          if (!heading.id) {
            const text = heading.textContent || '';
            const id = text
              .replace(/[^\w\s\u0400-\u04FF]/g, '')
              .replace(/\s+/g, '-')
              .toLowerCase();
            heading.id = id;
            console.log('DesktopTableOfContents: Added ID to heading:', id, text);
          }
        });
      };
      
      // Add IDs after a short delay to ensure DOM is ready
      setTimeout(addIdsToHeadings, 100);
    } else {
      console.log('DesktopTableOfContents: No TOC found in content');
      setTocItems([]);
    }
  }, [content]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      setActiveSection(id);
      setTimeout(() => {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };

  // Track active section and sticky behavior on scroll
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h2[id], h3[id]');
      let current = '';
      
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        // Check if heading is in view, considering the header offset
        if (rect.top <= headerOffset + 10) { // 10px buffer
          current = heading.id;
        }
      });
      
      if (current) {
        setActiveSection(current);
      }
      
      // Sticky logic: become sticky when scroll position passes the initial TOC position
      // adjusted for the header offset
      const scrollY = window.scrollY;
      const shouldBeSticky = scrollY > (tocPosition - headerOffset);
      setIsSticky(shouldBeSticky);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocPosition, headerOffset]);

  // Set initial position after component mounts
  useEffect(() => {
    const setInitialPosition = () => {
      // Reserve space immediately to prevent layout shifts
      setTocPosition(headerOffset + 20);
      setIsPositioned(true);
      
      // Look for the image wrapper div first, then the image inside
      // The blog post structure has: <div className={styles.imageWrapper}><BlogFeaturedImage /></div>
      const imageWrapper = document.querySelector('article > div:has(img), article [class*="imageWrapper"], article [class*="featuredImage"]');
      
      let targetElement = null;
      
      if (imageWrapper) {
        targetElement = imageWrapper;
        console.log('DesktopTableOfContents: Found image wrapper:', imageWrapper.className);
      } else {
        // Fallback: try to find the featured image directly
        const featuredImage = document.querySelector('article img:first-of-type');
        if (featuredImage) {
          targetElement = featuredImage;
          console.log('DesktopTableOfContents: Found featured image directly');
        }
      }
      
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const scrollTop = window.scrollY;
        const elementBottom = rect.bottom + scrollTop;
        
        // Position TOC at the bottom of the featured image with minimal spacing
        const newPosition = Math.max(elementBottom, headerOffset + 20);
        setTocPosition(newPosition);
        setIsPositioned(true); // Mark as positioned
        console.log('DesktopTableOfContents: Positioned at', newPosition, 'element bottom:', elementBottom);
      } else {
        // Fallback: look for first content heading
        const firstHeading = document.querySelector('h1, h2');
        const articleStart = document.querySelector('article');
        const fallbackElement = firstHeading || articleStart;
        
        if (fallbackElement) {
          const rect = fallbackElement.getBoundingClientRect();
          const scrollTop = window.scrollY;
          const elementBottom = rect.bottom + scrollTop;
          
          const newPosition = Math.max(elementBottom + 20, headerOffset + 20);
          setTocPosition(newPosition);
          setIsPositioned(true); // Mark as positioned
          console.log('DesktopTableOfContents: Using fallback position at', newPosition);
        } else {
          // Final fallback
          setTocPosition(headerOffset + 20);
          setIsPositioned(true); // Mark as positioned
          console.log('DesktopTableOfContents: Using header offset fallback');
        }
      }
    };
    
    // Set position after a short delay to ensure DOM is ready
    setTimeout(setInitialPosition, 300);
    
    // Also set on window resize
    window.addEventListener('resize', setInitialPosition);
    return () => window.removeEventListener('resize', setInitialPosition);
  }, [headerOffset]);

  const renderTOCItem = (item: TOCItem, index: number) => (
    <li key={item.id} className={styles.tocItem}>
      <button
        onClick={() => scrollToHeading(item.id)}
        className={`${styles.tocLink} ${styles[`level${item.level}`]} ${
          activeSection === item.id ? styles.active : ''
        }`}
        aria-current={activeSection === item.id ? 'location' : undefined}
      >
        {item.text}
      </button>
      {item.children && item.children.length > 0 && (
        <ul className={styles.tocSubList}>
          {item.children.map((child, childIndex) => 
            renderTOCItem(child, childIndex)
          )}
        </ul>
      )}
    </li>
  );

  // Hide TOC if no items (don't show debug version to prevent flash)
  if (tocItems.length === 0) {
    return null;
  }

  return (
    <aside 
      className={`${styles.desktopToc} ${isSticky ? styles.sticky : ''} ${className}`}
      style={{
        top: isSticky ? `${headerOffset}px` : `${tocPosition}px`,
        position: isSticky ? 'fixed' : 'absolute',
        maxHeight: `calc(100vh - ${headerOffset + 20}px)`, // Dynamic max-height
        opacity: isPositioned ? 1 : 0, // Hide until positioned
        visibility: isPositioned ? 'visible' : 'hidden', // Prevent interaction before positioned
        transition: 'opacity 0.2s ease-in-out' // Smooth fade-in
      }}
    >
      <div className={styles.tocHeader}>
        <h3 className={styles.tocTitle}>📋 Съдържание</h3>
      </div>
      
      <nav className={styles.tocNav}>
        <ul className={styles.tocList}>
          {tocItems.map((item, index) => renderTOCItem(item, index))}
        </ul>
      </nav>
    </aside>
  );
}
