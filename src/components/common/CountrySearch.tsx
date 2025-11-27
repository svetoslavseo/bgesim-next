'use client';

import { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './CountrySearch.module.css';

interface Country {
  name: string;
  href: string;
  flag: string;
}

const countries: Country[] = [
  {
    name: 'Турция',
    href: '/turcia/',
    flag: '/media/images/4.png',
  },
  {
    name: 'Великобритания',
    href: '/esim-velikobritania/',
    flag: '/media/images/5.png',
  },
  {
    name: 'САЩ',
    href: '/esim-za-usa/',
    flag: '/media/images/Flags_-1.png',
  },
  {
    name: 'Тайланд',
    href: '/esim-thailand/',
    flag: '/media/images/2-1.png',
  },
  {
    name: 'Дубай',
    href: '/esim-dubai/',
    flag: '/media/images/6.png',
  },
  {
    name: 'Сърбия',
    href: '/esim-serbia/',
    flag: '/media/images/Flags_-2.png',
  },
  {
    name: 'Египет',
    href: '/esim-egipet/',
    flag: '/media/flags/eg.png',
  },
  {
    name: 'Мароко',
    href: '/esim-maroko/',
    flag: '/media/flags/ma.png',
  },
  {
    name: 'Индонезия',
    href: '/esim-indonesia/',
    flag: '/media/flags/id.png',
  },
  {
    name: 'Израел',
    href: '/esim-israel/',
    flag: '/media/flags/il.png',
  },
  {
    name: 'Канада',
    href: '/esim-canada/',
    flag: '/media/flags/ca.png',
  },
  {
    name: 'Малдиви',
    href: '/esim-maldives/',
    flag: '/media/flags/mv.png',
  },
  {
    name: 'Виетнам',
    href: '/esim-vietnam/',
    flag: '/media/flags/vn.png',
  }
];

function CountrySearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return [];
    const lowerQuery = searchQuery.toLowerCase();
    return countries.filter(country =>
      country.name.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  }, []);

  const handleSearchFocus = useCallback(() => {
    if (filteredCountries.length > 0) {
      setIsOpen(true);
    }
  }, [filteredCountries.length]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev =>
        prev < filteredCountries.length - 1 ? prev + 1 : 0
      );
      setIsOpen(true);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : filteredCountries.length - 1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0 && filteredCountries[highlightedIndex]) {
      e.preventDefault();
      window.location.href = filteredCountries[highlightedIndex].href;
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, [filteredCountries, highlightedIndex]);

  const handleCountryClick = useCallback((href: string) => {
    setSearchQuery('');
    setIsOpen(false);
  }, []);

  return (
    <div className={styles.searchContainer} ref={searchContainerRef}>
      <div className={styles.searchInputWrapper}>
        <svg
          className={styles.searchIcon}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 19L15 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Търсене на държава..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          onKeyDown={handleKeyDown}
          className={styles.searchInput}
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setIsOpen(false);
              searchInputRef.current?.focus();
            }}
            className={styles.clearButton}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      {isOpen && filteredCountries.length > 0 && (
        <div className={styles.dropdown}>
          {filteredCountries.map((country, index) => (
            <Link
              key={country.href}
              href={country.href}
              onClick={() => handleCountryClick(country.href)}
              className={`${styles.dropdownItem} ${
                index === highlightedIndex ? styles.highlighted : ''
              }`}
            >
              <Image
                src={country.flag}
                alt={`${country.name} flag`}
                width={24}
                height={24}
                className={styles.flag}
              />
              <span>{country.name}</span>
            </Link>
          ))}
        </div>
      )}

      {isOpen && searchQuery && filteredCountries.length === 0 && (
        <div className={styles.noResults}>
          <p>Няма намерени резултати</p>
        </div>
      )}
    </div>
  );
}

export default memo(CountrySearch);