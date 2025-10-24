import Link from 'next/link';
import Image from 'next/image';
import styles from './PopularDestinations.module.css';

interface Destination {
  name: string;
  href: string;
  flag?: string;
}

interface PopularDestinationsProps {
  destinations: Destination[];
}

export default function PopularDestinations({ destinations }: PopularDestinationsProps) {
  return (
    <section className={`${styles.section} content-visibility-auto`}>
      <div className={styles.container}>
        <h2 className={styles.title}>Популярни дестинации</h2>
        <div className={styles.grid}>
          {destinations.map((destination) => (
            <Link
              key={destination.href}
              href={destination.href}
              className={styles.card}
            >
              {destination.flag && (
                <Image
                  src={destination.flag}
                  alt={`${destination.name} flag`}
                  width={24}
                  height={24}
                  className={styles.flag}
                  loading="lazy"
                  quality={85}
                  sizes="24px"
                />
              )}
              <span className={styles.name}>{destination.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

