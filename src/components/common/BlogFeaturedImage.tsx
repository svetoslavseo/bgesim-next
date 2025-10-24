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
        style={{
          borderRadius: '30px',
          width: '100%',
          height: 'auto',
          objectFit: 'cover'
        }}
      />
    </div>
  );
}

