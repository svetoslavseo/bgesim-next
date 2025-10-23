import styles from './ComparisonTable.module.css';

interface ComparisonRow {
  feature: string;
  esim: string;
  roaming: string;
  localSim: string;
}

interface ComparisonTableProps {
  title: string;
  rows: ComparisonRow[];
  countryName: string;
}

export default function ComparisonTable({ title, rows, countryName }: ComparisonTableProps) {
  return (
    <section className={styles.comparisonSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Характеристика</th>
                <th>eSIM за {countryName}</th>
                <th>Международен роуминг</th>
                <th>Местна SIM</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td className={styles.featureCell}>{row.feature}</td>
                  <td>{row.esim}</td>
                  <td>{row.roaming}</td>
                  <td>{row.localSim}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

