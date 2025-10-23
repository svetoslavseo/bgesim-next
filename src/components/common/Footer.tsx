import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3"></path>
                </svg>
              </div>
              <div className={styles.featureText}>Бързо и надеждно</div>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  <path d="M2 12h20"></path>
                </svg>
              </div>
              <div className={styles.featureText}>Работи в над 100 държави</div>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 4V2"></path>
                  <path d="M15 16v-2"></path>
                  <path d="M8 9h2"></path>
                  <path d="M20 9h2"></path>
                  <path d="M17.8 11.8 19 13"></path>
                  <path d="M15 9h0"></path>
                  <path d="M17.8 6.2 19 5"></path>
                  <path d="m3 21 9-9"></path>
                  <path d="M12.2 6.2 11 5"></path>
                </svg>
              </div>
              <div className={styles.featureText}>Мигновено активиране</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer Content */}
      <div className={styles.footerContent}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            {/* Logo and Description */}
            <div className={styles.footerColumn}>
              <Link href="/" className={styles.footerLogo}>
                <Image
                  src="/media/images/2-6.png"
                  alt="Travel eSIM by Breeze Logo"
                  width={200}
                  height={60}
                />
              </Link>
              <p className={styles.footerDescription}>
                TraveleSIM BG e уебсайт за eSIM в света, който решава проблема с високите сметки за роуминг, 
                като Ви дава достъп до над 100 eSIM (цифрови SIM карти) по целия свят на най-добри цени.
              </p>
            </div>

            {/* Quick Links */}
            <div className={styles.footerColumn}>
              <h4 className={styles.footerHeading}>Връзки</h4>
              <ul className={styles.footerLinks}>
                <li><Link href="/">Начало</Link></li>
                <li><Link href="/blog">Блог</Link></li>
                <li><Link href="/blog/kakvo-e-esim">Какво е eSIM?</Link></li>
                <li><Link href="/contacts">Контакти</Link></li>
              </ul>
            </div>

            {/* Social Media */}
            <div className={styles.footerColumn}>
              <h4 className={styles.footerHeading}>Последвайте ни:</h4>
              <div className={styles.socialLinks}>
                <a
                  href="https://www.facebook.com/profile.php?id=61573078586675"
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  aria-label="Visit our Facebook"
                  className={styles.socialLink}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/travelesim.bg/"
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  aria-label="Visit our Instagram"
                  className={styles.socialLink}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={styles.footerBottom}>
        <div className={styles.container}>
          <p className={styles.disclaimer}>
            Тази страница съдържа партньорски (афилиейт) връзки, което означава, че можем да получим комисиона, 
            ако закупите продукт чрез нашите линкове. За вас като потребител няма допълнителни разходи и цената, 
            която плащате, остава същата.
          </p>
          <p className={styles.copyright}>
            © {currentYear}, Developed by Travel eSIM by Breeze
          </p>
        </div>
      </div>
    </footer>
  );
}
