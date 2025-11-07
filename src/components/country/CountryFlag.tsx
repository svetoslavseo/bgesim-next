'use client';

import Image from 'next/image';
import styles from './HeroSection.module.css';

interface CountryFlagProps {
  countryCode: string;
  countryName: string;
}

export default function CountryFlag({ countryCode, countryName }: CountryFlagProps) {
  const flagSrc = `/media/flags/${countryCode.toLowerCase()}.svg`;
  
  return (
    <Image
      src={flagSrc}
      alt={`${countryName} flag`}
      width={48}
      height={48}
      className={styles.countryFlag}
      priority
    />
  );
}

