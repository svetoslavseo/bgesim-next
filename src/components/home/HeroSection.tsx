import Link from 'next/link';
import CountrySearch from '@/components/common/CountrySearch';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  title: string;
  subtitle: string;
}

export default function HeroSection({ title, subtitle }: HeroSectionProps) {
  const activeUsers = [
    { id: 1, bg: '#FF99C8' },
    { id: 2, bg: '#E5E900' },
    { id: 3, bg: '#9068BE' },
    { id: 4, bg: '#018FA6' },
  ];

  return (
    <section className={`${styles.hero} hero-section`}>
      <div className={styles.glowEffect} aria-hidden="true" />
      
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.mainContent}>
            <div className={styles.headerGroup}>
              <div className={styles.trustBadge}>
                <span className={styles.pulseDot} />
                Над 15,000 активни SIM карти днес
              </div>
              <h1 className={styles.title}>
                <span className={styles.titleGradient}>Интернет свобода</span>
                <br />
                във всяка точка на света
              </h1>
              <p className={styles.subtitle}>
                Забравете за скъпия роуминг. Инсталирайте eSIM за минути и сърфирайте като местен жител в 190+ държави.
              </p>
            </div>

            <div className={styles.searchBlock}>
              <label className={styles.searchLabel}>Къде ще пътувате?</label>
              <div className={styles.searchWrapper}>
                <CountrySearch />
              </div>
              <div className={styles.popularTags}>
                <span>Популярни:</span>
                <Link href="/turcia/">Турция</Link>
                <Link href="/esim-velikobritania/">Англия</Link>
                <Link href="/esim-za-usa/">САЩ</Link>
              </div>
            </div>

            <div className={styles.trustRow}>
              <div className={styles.avatarStack}>
                {activeUsers.map((user, i) => (
                  <div 
                    key={user.id} 
                    className={styles.avatar}
                    style={{ backgroundColor: user.bg, zIndex: 5 - i }}
                  />
                ))}
                <div className={styles.avatarCount}>+2k</div>
              </div>
              <div className={styles.trustText}>
                <strong>4.9/5 рейтинг</strong>
                <span>от доволни пътешественици</span>
              </div>
            </div>
          </div>

          <div className={styles.visualColumn}>
            <div className={styles.heroVisual}>
              <div className={styles.floatingCard} data-type="plan">
                <div className={styles.cardIcon}>🇹🇷</div>
                <div className={styles.cardInfo}>
                  <strong>Турция</strong>
                  <span>10 GB • 30 Дни</span>
                </div>
                <div className={styles.cardPrice}>18лв</div>
              </div>

              <div className={styles.floatingCard} data-type="status">
                <div className={styles.statusIcon}>✓</div>
                <div className={styles.statusText}>
                  <strong>eSIM Активна</strong>
                  <span>Свързан към 5G</span>
                </div>
              </div>

              <div className={styles.floatingCard} data-type="support">
                <div className={styles.supportAvatars}>
                  <div style={{ background: '#E5E900' }} />
                  <div style={{ background: '#F878CD' }} />
                </div>
                <div className={styles.supportText}>
                  <strong>24/7 Поддръжка</strong>
                  <span>Отговаряме до 2 мин</span>
                </div>
              </div>

              <div className={styles.visualCircleMain} />
              <div className={styles.visualCircleSecondary} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
