'use client';

import { useState, useEffect, useRef } from 'react';
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
    href: '#',
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

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };
  
  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  const handleMouseEnter = (label: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setOpenSubmenu(label);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setOpenSubmenu(null);
    }, 150); // Small delay to prevent accidental closing
    hoverTimeoutRef.current = timeout;
  };

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
            key={item.href} 
            className={classNames(
              styles.navItem,
              item.submenu && styles.hasSubmenu
            )}
            onMouseEnter={() => item.submenu && handleMouseEnter(item.label)}
            onMouseLeave={() => item.submenu && handleMouseLeave()}
          >
            {item.submenu ? (
              <>
                <button
                  className={styles.navLink}
                  onClick={() => toggleSubmenu(item.label)}
                  aria-expanded={openSubmenu === item.label}
                  aria-haspopup="true"
                >
                  {item.label}
                  <span className={styles.arrow}>▼</span>
                </button>
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
          <a
            href="https://breezesim.com?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg"
            className={styles.ctaButton}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
          >
            Виж Оферти
          </a>
        </li>
      </ul>
    </nav>
  );
}



