'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './DataCalculator.module.css';

interface DataCategory {
  id: string;
  name: string;
  unit: string;
  dailyUsage: number;
  dataPerUnit: number; // GB per unit
  dailyData: number;
  weeklyData: number;
}

const initialCategories: DataCategory[] = [
  {
    id: 'social',
    name: 'Социални медии',
    unit: 'Минути на ден',
    dailyUsage: 0,
    dataPerUnit: 0.025, // 2.50 GB / 100 minutes = 0.025 GB per minute
    dailyData: 0,
    weeklyData: 0,
  },
  {
    id: 'gps',
    name: 'GPS и навигиране',
    unit: 'Минути на ден',
    dailyUsage: 0,
    dataPerUnit: 0.005, // 0.50 GB / 100 minutes = 0.005 GB per minute
    dailyData: 0,
    weeklyData: 0,
  },
  {
    id: 'music',
    name: 'Streaming на музика',
    unit: 'Минути на ден',
    dailyUsage: 0,
    dataPerUnit: 0.015, // 1.50 GB / 100 minutes = 0.015 GB per minute
    dailyData: 0,
    weeklyData: 0,
  },
  {
    id: 'messages',
    name: 'Съобщения',
    unit: 'Брой съобщения на ден',
    dailyUsage: 0,
    dataPerUnit: 0.0001, // 0.01 GB / 100 messages = 0.0001 GB per message
    dailyData: 0,
    weeklyData: 0,
  },
  {
    id: 'browsing',
    name: 'Интернет сърфиране',
    unit: 'Минути на ден',
    dailyUsage: 0,
    dataPerUnit: 0.01, // 1.00 GB / 100 minutes = 0.01 GB per minute
    dailyData: 0,
    weeklyData: 0,
  },
  {
    id: 'email',
    name: 'Получаване и изпращане на имейли',
    unit: 'Брой имейли на ден',
    dailyUsage: 0,
    dataPerUnit: 0.0005, // 0.05 GB / 100 emails = 0.0005 GB per email
    dailyData: 0,
    weeklyData: 0,
  },
  {
    id: 'calls',
    name: 'Телефонни обаждания',
    unit: 'Минути на ден',
    dailyUsage: 0,
    dataPerUnit: 0.0035, // 0.35 GB / 100 minutes = 0.0035 GB per minute
    dailyData: 0,
    weeklyData: 0,
  },
];

export default function DataCalculator() {
  const router = useRouter();
  const [categories, setCategories] = useState<DataCategory[]>(initialCategories);
  const [totalDaily, setTotalDaily] = useState(0);
  const [totalWeekly, setTotalWeekly] = useState(0);
  const [totalMonthly, setTotalMonthly] = useState(0);

  const updateCategory = (id: string, dailyUsage: number) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === id) {
        const dailyData = dailyUsage * cat.dataPerUnit;
        const weeklyData = dailyData * 7;
        return {
          ...cat,
          dailyUsage,
          dailyData,
          weeklyData,
        };
      }
      return cat;
    }));
  };

  const resetCalculator = () => {
    setCategories(initialCategories);
  };

  const selectESIMPlan = () => {
    // Redirect to destinations page
    router.push('/durjavi');
  };

  useEffect(() => {
    const daily = categories.reduce((sum, cat) => sum + cat.dailyData, 0);
    const weekly = categories.reduce((sum, cat) => sum + cat.weeklyData, 0);
    const monthly = daily * 30;

    setTotalDaily(daily);
    setTotalWeekly(weekly);
    setTotalMonthly(monthly);
  }, [categories]);

  return (
    <div className={styles.calculator}>
      <div className={styles.calculatorContainer}>
        <section className={styles.inputSection}>
          <h2 className={styles.sectionTitle}>
            Избери мобилните данни, които смяташ, че ще са ти нужни в чужбина
          </h2>

          <div className={styles.tableHeaders}>
            <div className={styles.headerCategory}>Категория</div>
            <div className={styles.headerInput}>Въведи стойност</div>
            <div className={styles.headerSlider}>Регулирай</div>
            <div className={styles.headerDaily}>Дневно</div>
            <div className={styles.headerWeekly}>Седмично</div>
          </div>

          <div className={styles.categories}>
            {categories.map((category) => (
              <div key={category.id} className={styles.categoryRow}>
                <div className={styles.categoryName}>{category.name}</div>
                
                <div className={styles.inputGroup}>
                  <input
                    type="number"
                    value={category.dailyUsage}
                    onChange={(e) => updateCategory(category.id, Number(e.target.value))}
                    className={styles.input}
                    min="0"
                    placeholder="0"
                  />
                  <span className={styles.unit}>{category.unit}</span>
                </div>
                
                <div className={styles.sliderContainer}>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={category.dailyUsage}
                    onChange={(e) => updateCategory(category.id, Number(e.target.value))}
                    className={styles.slider}
                  />
                </div>
                
                <div className={styles.dailyData}>
                  {category.dailyData.toFixed(2)} GB
                </div>
                
                <div className={styles.weeklyData}>
                  {category.weeklyData.toFixed(2)} GB
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className={styles.summarySection}>
          <div className={styles.summaryContent}>
            <h2 className={styles.summaryTitle}>
              Средно потребление на мобилни данни
            </h2>
            
            <div className={styles.summaryData}>
              <div className={styles.summaryItem}>
                <div className={styles.summaryLabel}>Дневно</div>
                <div className={styles.summaryValue}>{totalDaily.toFixed(2)} GB</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryLabel}>Седмично</div>
                <div className={styles.summaryValue}>{totalWeekly.toFixed(2)} GB</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryLabel}>Месечно</div>
                <div className={styles.summaryValue}>{totalMonthly.toFixed(2)} GB</div>
              </div>
            </div>
            
            <div className={styles.actions}>
              <button 
                onClick={resetCalculator}
                className={styles.resetButton}
              >
                Рестартирай калкулатора
              </button>
              <button 
                onClick={selectESIMPlan}
                className={styles.selectButton}
              >
                Избери eSIM план
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
