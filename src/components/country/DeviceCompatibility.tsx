import styles from './DeviceCompatibility.module.css';

interface DeviceCompatibilityProps {
  title: string;
  description: string;
  devices: string[];
}

export default function DeviceCompatibility({ title, description, devices }: DeviceCompatibilityProps) {
  return (
    <section className={styles.compatibilitySection}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        
        <div className={styles.content}>
          <p className={styles.description}>{description}</p>
          
          <div className={styles.deviceList}>
            {devices.map((device, index) => (
              <div key={index} className={styles.deviceItem}>
                <span className={styles.checkmark}>✅</span>
                <span>{device}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

