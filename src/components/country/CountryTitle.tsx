import Image from 'next/image';
import styles from './HeroSection.module.css';

interface CountryTitleProps {
  title: string;
  countryCode: string;
  countryName: string;
}

export default function CountryTitle({ title, countryCode, countryName }: CountryTitleProps) {
  const flagSrc = `/media/flags/${countryCode.toLowerCase()}.svg`;
  
  return (
    <div className={styles.titleContainer}>
      <Image
        src={flagSrc}
        alt={`${countryName} flag`}
        width={48}
        height={48}
        className={styles.countryFlag}
        priority
      />
      <h1 className={styles.title}>{title}</h1>
    </div>
  );
}

