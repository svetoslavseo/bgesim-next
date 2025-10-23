import type { ReactNode } from 'react';
import Container from '@/components/layout/Container';
import styles from './Hero.module.css';
import { classNames } from '@/lib/utils';

interface HeroProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  backgroundImage?: string;
  overlay?: boolean;
  align?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Hero({
  title,
  subtitle,
  children,
  backgroundImage,
  overlay = true,
  align = 'center',
  size = 'md',
  className
}: HeroProps) {
  return (
    <section 
      className={classNames(
        styles.hero,
        styles[`size-${size}`],
        styles[`align-${align}`],
        backgroundImage && styles.hasBackground,
        className
      )}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      {overlay && backgroundImage && <div className={styles.overlay} />}
      
      <Container>
        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {children && <div className={styles.actions}>{children}</div>}
        </div>
      </Container>
    </section>
  );
}



