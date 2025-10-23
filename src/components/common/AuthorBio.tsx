import styles from './AuthorBio.module.css';

interface AuthorBioProps {
  name: string;
  bio?: string;
  avatar?: string;
  url?: string;
}

/**
 * Author bio section component
 */
export default function AuthorBio({ name, bio, avatar, url }: AuthorBioProps) {
  const defaultBio = `${name} е автор на Travel eSIM BG, специализиран в технологии за мобилна свързаност и eSIM решения за пътуващи.`;
  
  // Use the Vasil Andreev image as default avatar
  const authorAvatar = avatar || '/media/images/vasil-andreev-150x150.jpeg';
  
  return (
    <div className={styles.authorBio}>
      <div className={styles.header}>
        <h3 className={styles.title}>За автора</h3>
      </div>
      
      <div className={styles.content}>
        <div className={styles.avatarWrapper}>
          <img 
            src={authorAvatar} 
            alt={name}
            className={styles.avatar}
          />
        </div>
        
        <div className={styles.info}>
          {url ? (
            <a href={url} className={styles.name}>
              {name}
            </a>
          ) : (
            <div className={styles.name}>{name}</div>
          )}
          
          <p className={styles.bio}>
            {bio || defaultBio}
          </p>
        </div>
      </div>
    </div>
  );
}

