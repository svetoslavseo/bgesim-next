import Link from 'next/link';
import Image from 'next/image';
import Navigation from './Navigation';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerRow}>
        <div className={styles.container}>
          <div className={styles.headerLeft}>
            <Link href="/" className={styles.logo}>
              <Image
                src="/media/images/TeSim-Logo-Breeze.png"
                alt="Travel eSIM by Breeze Logo"
                width={200}
                height={50}
                priority
                style={{
                  width: 'auto',
                  height: 'auto',
                  maxHeight: '50px'
                }}
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



