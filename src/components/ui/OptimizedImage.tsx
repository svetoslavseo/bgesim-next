import Image from 'next/image';
import type { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

/**
 * Wrapper component for Next.js Image
 * Handles local and external images with optimization
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  ...props
}: OptimizedImageProps) {
  // For static export, we need to handle images differently
  // If width and height are provided, use Next.js Image component
  // Otherwise, use standard img tag
  
  if (width && height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        {...props}
      />
    );
  }
  
  // Fallback to regular img for dynamic images
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      {...(props as any)}
    />
  );
}



