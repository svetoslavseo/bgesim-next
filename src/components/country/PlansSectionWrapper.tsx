'use client';

import React, { useState, useEffect } from 'react';
import PlansSection from './PlansSection';
import { fetchSailyPlans, getPlansForCountry, FALLBACK_PLANS } from '@/lib/sailyApi';
import styles from './PlansSection.module.css';

interface PlansSectionWrapperProps {
  title: string;
  lastUpdated?: string;
  countryName: string;
  countryCode: string;
}

export default function PlansSectionWrapper({ 
  title, 
  lastUpdated, 
  countryName, 
  countryCode 
}: PlansSectionWrapperProps) {
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // For now, use fallback plans to avoid API issues during development
        const fallbackPlans = FALLBACK_PLANS[countryCode] || [];
        setPlans(fallbackPlans);
        
        // TODO: Uncomment when ready to test API
        // const allPlans = await fetchSailyPlans();
        // const countryPlans = getPlansForCountry(allPlans, countryCode);
        // 
        // if (countryPlans.length > 0) {
        //   setPlans(countryPlans);
        // } else {
        //   setPlans(fallbackPlans);
        // }
      } catch (error) {
        console.error('Error loading plans:', error);
        setError('Не може да се заредят плановете от API');
        
        // Use fallback plans
        const fallbackPlans = FALLBACK_PLANS[countryCode] || [];
        setPlans(fallbackPlans);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlans();
  }, [countryCode]);

  const handlePlanSelect = (plan: any) => {
    console.log('Selected plan:', plan);
  };

  const handleCheckCompatibility = () => {
    window.open('/proverka-na-syvmestimost-s-esim', '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <section className={styles.plans}>
        <div className={styles.container}>
          <div className={styles.planSelector}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                border: '4px solid #e5e7eb', 
                borderTop: '4px solid #3b82f6', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }}></div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#111827' }}>{title}</h2>
              <p style={{ color: '#6b7280', margin: '0' }}>Зареждане на планове...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error && plans.length === 0) {
    return (
      <section className={styles.plans}>
        <div className={styles.container}>
          <div className={styles.planSelector}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#111827' }}>{title}</h2>
              <p style={{ color: '#dc2626', margin: '0 0 1rem 0' }}>{error}</p>
              <p style={{ color: '#6b7280', margin: '0' }}>Моля, опитайте отново по-късно.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <PlansSection
      title={title}
      lastUpdated={lastUpdated}
      plans={plans}
      countryName={countryName}
      onPlanSelect={handlePlanSelect}
      onCheckCompatibility={handleCheckCompatibility}
    />
  );
}
