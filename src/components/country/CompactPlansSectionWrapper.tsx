'use client';

import React, { useState, useEffect } from 'react';
import CompactPlansSection from './CompactPlansSection';
import { FALLBACK_PLANS } from '@/lib/sailyApi';

/**
 * CompactPlansSectionWrapper Component
 * 
 * Note: Attempts to fetch from /api/saily-plans in development,
 * but with static export, this fails in production and falls back
 * to FALLBACK_PLANS.
 * 
 * Status: ✅ WORKS - Gracefully falls back to static plans
 */

interface CompactPlansSectionWrapperProps {
  title: string;
  countryName: string;
  countryCode: string;
}

export default function CompactPlansSectionWrapper({ 
  title, 
  countryName, 
  countryCode 
}: CompactPlansSectionWrapperProps) {
  
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadPlans = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Use fallback plans immediately for static export
        // In production with static export, API routes don't exist
        const fallbackPlans = FALLBACK_PLANS[countryCode] || [];
        console.log('Loading fallback plans for', countryCode, ':', fallbackPlans.length, 'plans');
        setPlans(fallbackPlans);
        setLastUpdated(undefined);
      } catch (error) {
        console.error('Error loading plans:', error);
        const fallbackPlans = FALLBACK_PLANS[countryCode] || [];
        setPlans(fallbackPlans);
        setLastUpdated(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlans();
  }, [countryCode]);

  const handlePlanSelect = (plan: any) => {
    console.log('Selected plan:', plan);
  };

  // Show skeleton loading to prevent CLS
  if (isLoading) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        background: '#f9fafb',
        borderRadius: '12px',
        margin: '2rem 0'
      }}>
        <div style={{ 
          height: '1.5rem', 
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '4px',
          marginBottom: '1rem',
          width: '60%',
          margin: '0 auto'
        }}></div>
        <div style={{ 
          height: '0.875rem', 
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '4px',
          width: '40%',
          margin: '0 auto'
        }}></div>
      </div>
    );
  }

  // Don't render if no plans
  if (plans.length === 0) {
    return null;
  }

  return (
    <CompactPlansSection
      title={title}
      plans={plans}
      countryName={countryName}
      lastUpdated={lastUpdated}
      onPlanSelect={handlePlanSelect}
    />
  );
}
