import type { ReactNode } from 'react';
import styles from './Container.module.css';
import { classNames } from '@/lib/utils';

interface ContainerProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export default function Container({ 
  children, 
  size = 'xl',
  className 
}: ContainerProps) {
  return (
    <div className={classNames(
      styles.container,
      styles[`container-${size}`],
      className
    )}>
      {children}
    </div>
  );
}



