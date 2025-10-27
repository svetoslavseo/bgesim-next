'use client';

import React, { useState, useEffect } from 'react';
import CompactPlansSection from './CompactPlansSection';
import { FALLBACK_PLANS } from '@/lib/sailyApi';

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
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching real Saily plans for', countryCode);
        
        // Try to fetch real plans from server-side API route (bypasses CORS)
        const response = await fetch(`/api/saily-plans?countryCode=${countryCode}`);
        const apiData = await response.json();
        console.log('Server-side API response for', countryCode, ':', apiData);
        
        const sailyPlans = apiData.success ? apiData.plans : [];
        
        if (sailyPlans && sailyPlans.length > 0) {
          console.log('Using real Saily plans:', sailyPlans);
          setPlans(sailyPlans);
          setLastUpdated(apiData.lastUpdated);
        } else {
          console.log('No Saily plans found, using fallback');
          const fallbackPlans = FALLBACK_PLANS[countryCode] || [];
          console.log('Fallback plans for', countryCode, ':', fallbackPlans);
          setPlans(fallbackPlans);
          setLastUpdated(undefined);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading plans:', error);
        console.log('Falling back to static plans');
        const fallbackPlans = FALLBACK_PLANS[countryCode] || [];
        setPlans(fallbackPlans);
        setLastUpdated(undefined);
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
