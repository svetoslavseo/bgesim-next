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
        } else {
          console.log('No Saily plans found, using fallback');
          const fallbackPlans = FALLBACK_PLANS[countryCode] || [];
          console.log('Fallback plans for', countryCode, ':', fallbackPlans);
          setPlans(fallbackPlans);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading plans:', error);
        console.log('Falling back to static plans');
        const fallbackPlans = FALLBACK_PLANS[countryCode] || [];
        setPlans(fallbackPlans);
        setIsLoading(false);
      }
    };

    loadPlans();
  }, [countryCode]);

  const handlePlanSelect = (plan: any) => {
    console.log('Selected plan:', plan);
  };

  // Don't render if loading or no plans
  if (isLoading || plans.length === 0) {
    return null;
  }

  return (
    <CompactPlansSection
      title={title}
      plans={plans}
      countryName={countryName}
      onPlanSelect={handlePlanSelect}
    />
  );
}
