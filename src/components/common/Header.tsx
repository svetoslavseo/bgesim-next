import Link from 'next/link';
import Image from 'next/image';
import Navigation from './Navigation';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={`${styles.header} contain-layout`}>
      <div className={styles.headerRow}>
        <div className={styles.container}>
          <div className={styles.headerLeft}>
            <Link href="/" className={styles.logo}>
              <Image
                src="/media/images/travelesim/TraveleSIMBG-logo.png"
                alt="Travel eSIM BG Logo"
                width={400}
                height={100}
                priority
                fetchPriority="high"
                quality={90}
                style={{
                  width: 'auto',
                  height: 'auto',
                  maxHeight: '100px'
                }}
                sizes="(max-width: 768px) 300px, 400px"
              />
            </Link>
          </div>
          
          <div className={styles.headerCenter}>
            <Navigation />
          </div>
        </div>
      </div>
    </header>
  );
}



