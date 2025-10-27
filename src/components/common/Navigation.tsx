'use client';

import { useState, useEffect, useRef, useMemo, memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';
import { classNames } from '@/lib/utils';

// Navigation menu structure from WordPress
const navigationItems = [
  { label: 'Начало', href: '/' },
  { label: 'Блог', href: '/blog' },
  {
    label: 'Държави',
    href: '/durjavi',
    submenu: [
      { label: 'eSIM Турция', href: '/turcia' },
      { label: 'eSIM Сърбия', href: '/esim-serbia' },
      { label: 'eSIM САЩ', href: '/esim-za-usa' },
      { label: 'eSIM Великобритания', href: '/esim-velikobritania' },
      { label: 'eSIM Тайланд', href: '/esim-thailand' },
      { label: 'eSIM Дубай', href: '/esim-dubai' },
      { label: 'eSIM Египет', href: '/esim-egipet' },
    ]
  },
  {
    label: 'Инструменти',
    href: '#',
    submenu: [
      { label: 'Проверка на съвместимост с eSIM', href: '/proverka-na-syvmestimost-s-esim' },
      { label: 'Калкулатор за използвани мобилни данни', href: '/calculator-za-izpolzvani-mobilni-danni' },
    ]
  },
  { label: 'Какво е eSIM?', href: '/blog/kakvo-e-esim' },
];

function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  
  const toggleMobileMenu = useMemo(() => () => {
    setMobileMenuOpen(prev => !prev);
  }, []);
  
  const isActive = useMemo(() => (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  }, [pathname]);
  
  const toggleSubmenu = useMemo(() => (label: string) => {
    setOpenSubmenu(prev => prev === label ? null : label);
  }, []);

  const handleMouseEnter = useMemo(() => (label: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setOpenSubmenu(label);
  }, []);

  const handleMouseLeave = useMemo(() => () => {
    const timeout = setTimeout(() => {
      setOpenSubmenu(null);
    }, 150); // Small delay to prevent accidental closing
    hoverTimeoutRef.current = timeout;
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);
  
  return (
    <nav className={styles.nav} aria-label="Main">
      {/* Mobile menu button */}
      <button
        className={styles.mobileMenuButton}
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
        aria-expanded={mobileMenuOpen}
      >
        <span className={styles.hamburger}>
          <span className={classNames(styles.hamburgerLine, mobileMenuOpen && styles.hamburgerLineActive)}></span>
          <span className={classNames(styles.hamburgerLine, mobileMenuOpen && styles.hamburgerLineActive)}></span>
          <span className={classNames(styles.hamburgerLine, mobileMenuOpen && styles.hamburgerLineActive)}></span>
        </span>
      </button>
      
      {/* Navigation menu */}
      <ul className={classNames(
        styles.navList,
        mobileMenuOpen && styles.navListMobile
      )}>
        {navigationItems.map((item) => (
          <li 
            key={item.label} 
            className={classNames(
              styles.navItem,
              item.submenu && styles.hasSubmenu
            )}
            onMouseEnter={() => item.submenu && handleMouseEnter(item.label)}
            onMouseLeave={() => item.submenu && handleMouseLeave()}
          >
            {item.submenu ? (
              <>
                {item.href && item.href !== '#' ? (
                  <Link
                    href={item.href}
                    className={classNames(
                      styles.navLink,
                      isActive(item.href) && styles.navLinkActive
                    )}
                    onClick={(e) => {
                      // On mobile, toggle submenu on first click
                      if (window.innerWidth <= 1120) {
                        if (openSubmenu !== item.label) {
                          e.preventDefault();
                          toggleSubmenu(item.label);
                        } else {
                          setMobileMenuOpen(false);
                        }
                      }
                    }}
                    aria-expanded={openSubmenu === item.label}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <span className={styles.arrow}>▼</span>
                  </Link>
                ) : (
                  <button
                    className={styles.navLink}
                    onClick={() => toggleSubmenu(item.label)}
                    aria-expanded={openSubmenu === item.label}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <span className={styles.arrow}>▼</span>
                  </button>
                )}
                {openSubmenu === item.label && (
                  <ul className={styles.submenu}>
                    {item.submenu.map((subItem) => (
                      <li key={subItem.href}>
                        <Link
                          href={subItem.href}
                          className={styles.submenuLink}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                className={classNames(
                  styles.navLink,
                  isActive(item.href) && styles.navLinkActive
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
        {/* CTA Button */}
        <li className={styles.navItem}>
          <Link
            href="/durjavi"
            className={styles.ctaButton}
            onClick={() => setMobileMenuOpen(false)}
          >
            Дестинации
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default memo(Navigation);

