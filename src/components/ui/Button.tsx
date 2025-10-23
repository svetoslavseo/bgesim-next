import type { ReactNode, ButtonHTMLAttributes } from 'react';
import Link from 'next/link';
import styles from './Button.module.css';
import { classNames } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  const classes = classNames(
    styles.button,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    fullWidth && styles.fullWidth,
    className
  );
  
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}



