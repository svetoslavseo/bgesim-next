'use client';

import { useState, useEffect } from 'react';
import { extractTableOfContents, hasTableOfContents, type TOCItem } from '@/lib/toc';
import styles from './TableOfContents.module.css';

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export default function TableOfContents({ content, className = '' }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false); // Start collapsed, CSS will override on desktop

  useEffect(() => {
    console.log('TableOfContents: Checking content for TOC...');
    console.log('TableOfContents: hasTableOfContents:', hasTableOfContents(content));
    
    if (hasTableOfContents(content)) {
      const toc = extractTableOfContents(content);
      console.log('TableOfContents: Extracted TOC items:', toc);
      setTocItems(toc);
    } else {
      console.log('TableOfContents: No TOC found in content');
      setTocItems([]);
    }
  }, [content]);

  const scrollToHeading = (id: string) => {
    console.log('TOC: Attempting to scroll to:', id);
    const element = document.getElementById(id);
    if (element) {
      console.log('TOC: Found element, scrolling...');
      setActiveSection(id);
      // Add a small delay to ensure the element is ready
      setTimeout(() => {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    } else {
      console.log('TOC: Element not found with id:', id);
      // Try to find the element by other means
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading) => {
        if (heading.id === id) {
          console.log('TOC: Found heading by querySelector:', heading);
          setActiveSection(id);
          setTimeout(() => {
            heading.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }, 100);
        }
      });
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
      let current = '';
      
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          current = heading.id;
        }
      });
      
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.tocContainer} ${className}`}>
      <div className={styles.tocHeader}>
        <h3 className={styles.tocTitle}>📋 Съдържание</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={styles.toggleButton}
          aria-label={isExpanded ? 'Скрий съдържанието' : 'Покажи съдържанието'}
        >
          <svg
            className={`${styles.toggleIcon} ${isExpanded ? styles.expanded : ''}`}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      
      <nav className={`${styles.tocNav} ${isExpanded ? styles.expanded : styles.collapsed}`}>
        <ul className={styles.tocList}>
          {tocItems.map((item, index) => renderTOCItem(item, index))}
        </ul>
      </nav>
    </div>
  );
}
