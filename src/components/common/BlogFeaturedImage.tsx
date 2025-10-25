import Image from 'next/image';
import styles from './BlogFeaturedImage.module.css';

interface BlogFeaturedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

/**
 * Featured image component for blog posts with rounded corners
 * Optimized for CLS prevention with proper dimensions
 */
export default function BlogFeaturedImage({
  src,
  alt,
  width = 1200,
  height = 800,
}: BlogFeaturedImageProps) {
  return (
    <div className={styles.featuredImageContainer}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={styles.featuredImage}
        priority
        fetchPriority="high"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        style={{
          borderRadius: '30px',
          width: '100%',
          height: 'auto',
          objectFit: 'cover'
        }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}

