'use client';

import React, { useState, useEffect, useRef } from 'react';
import PlansSection from './PlansSection';
import { fetchSailyPlans, getPlansForCountry, FALLBACK_PLANS } from '@/lib/sailyApi';
import styles from './PlansSection.module.css';

interface PlansSectionWrapperProps {
  title: string;
  lastUpdated?: string;
  countryName: string;
  countryCode: string;
}

/**
 * PlansSectionWrapper Component
 * 
 * Note: This component attempts to fetch plans from /api/saily-plans, but with
 * static export (output: 'export'), API routes don't work in production.
 * 
 * Fallback: If the API fails or doesn't exist, it uses FALLBACK_PLANS
 * from @/lib/sailyApi. This ensures users always see valid plans.
 * 
 * Current Status: ✅ WORKS - Uses fallback plans in production
 */
export default function PlansSectionWrapper({ 
  title, 
  countryName, 
  countryCode 
}: PlansSectionWrapperProps) {
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | undefined>(undefined);
  const loadPlansRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Clean country code - ensure it's just the 2-letter code (e.g., "ID" not "ID:1")
        const cleanCountryCode: string = countryCode && countryCode.includes(':') 
          ? countryCode.split(':')[0] as string
          : (countryCode || '');
        
        // Fetch real plans from server-side API route
        // Note: With static export, this will fail in production and fall back to FALLBACK_PLANS
        try {
          const response = await fetch(`/api/saily-plans?countryCode=${cleanCountryCode}`);
          const apiData = await response.json();
          
          if (apiData.success && apiData.plans && apiData.plans.length > 0) {
            setPlans(apiData.plans);
            setLastUpdated(apiData.lastUpdated);
          } else {
            // Use fallback plans if API fails
            const fallbackPlans = cleanCountryCode ? (FALLBACK_PLANS[cleanCountryCode] || []) : [];
            setPlans(fallbackPlans);
            setLastUpdated(undefined);
          }
        } catch (apiError) {
          console.error('Error fetching from API:', apiError);
          // Use fallback plans
          const fallbackPlans = cleanCountryCode ? (FALLBACK_PLANS[cleanCountryCode] || []) : [];
          setPlans(fallbackPlans);
          setLastUpdated(undefined);
        }
      } catch (error) {
        console.error('Error loading plans:', error);
        setError('Не може да се заредят плановете от API');
        
        // Use fallback plans
        const cleanCountryCode: string = countryCode && countryCode.includes(':') 
          ? countryCode.split(':')[0] as string
          : (countryCode || '');
        const fallbackPlans = cleanCountryCode ? (FALLBACK_PLANS[cleanCountryCode] || []) : [];
        setPlans(fallbackPlans);
        setLastUpdated(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlans();
    loadPlansRef.current = loadPlans;

    // Reload plans when page becomes visible again (e.g., when navigating back from checkout)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Check if plans are empty after a short delay to allow state to update
        setTimeout(() => {
          setPlans(currentPlans => {
            if (currentPlans.length === 0 && loadPlansRef.current) {
              console.log('Page became visible and plans are empty, reloading...');
              loadPlansRef.current();
            }
            return currentPlans;
          });
        }, 100);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      loadPlansRef.current = null;
    };
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
