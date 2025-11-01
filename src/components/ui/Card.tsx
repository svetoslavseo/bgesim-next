import type { ReactNode } from 'react';
import Link from 'next/link';
import styles from './Card.module.css';
import { classNames } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  href?: string;
  className?: string;
}

export default function Card({
  children,
  title,
  description,
  image,
  imageAlt,
  href,
  className
}: CardProps) {
  const cardContent = (
    <>
      {image && (
        <div className={styles.imageWrapper}>
          <img src={image} alt={imageAlt || title || ''} className={styles.image} />
        </div>
      )}
      
      <div className={styles.content}>
        {title && <h3 className={styles.title}>{title}</h3>}
        {children}
      </div>
    </>
  );
  
  const cardClasses = classNames(
    styles.card,
    href && styles.cardInteractive,
    className
  );
  
  if (href) {
    return (
      <Link href={href} className={cardClasses}>
        {cardContent}
      </Link>
    );
  }
  
  return (
    <div className={cardClasses}>
      {cardContent}
    </div>
  );
}



