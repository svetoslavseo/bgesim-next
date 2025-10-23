import type { ReactNode } from 'react';
import styles from './Section.module.css';
import { classNames } from '@/lib/utils';

interface SectionProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  background?: 'white' | 'gray' | 'primary' | 'dark';
}

export default function Section({ 
  children, 
  className,
  padding = 'md',
  background = 'white'
}: SectionProps) {
  return (
    <section className={classNames(
      styles.section,
      styles[`padding-${padding}`],
      styles[`background-${background}`],
      className
    )}>
      {children}
    </section>
  );
}



