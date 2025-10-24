'use client';

import React, { useState, useEffect } from 'react';
import HeroSection from './HeroSection';
import { fetchSailyPlans, FALLBACK_PLANS } from '@/lib/sailyApi';

interface HeroSectionWrapperProps {
  breadcrumb: string;
  title: string;
  subtitle?: string;
  features: string[];
  countryName: string;
  countryCode: string;
}

export default function HeroSectionWrapper({ 
  breadcrumb,
  title,
  subtitle,
  features,
  countryName,
  countryCode
}: HeroSectionWrapperProps) {
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        console.log('Fetching real Saily plans for', countryCode);
        
        // Try to fetch real plans from Saily API for this specific country
        const sailyPlans = await fetchSailyPlans(countryCode);
        console.log('Saily API response for', countryCode, ':', sailyPlans);
        
        if (sailyPlans && sailyPlans.length > 0) {
          console.log('Using real Saily plans:', sailyPlans);
          setPlans(sailyPlans);
        } else {
          console.log('No Saily plans found, using fallback');
          const fallbackPlans = FALLBACK_PLANS[countryCode] || [];
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

  // Only show loading during initial load
  if (isLoading) {
    return (
      <HeroSection
        breadcrumb={breadcrumb}
        title={title}
        subtitle={subtitle}
        features={features}
        plans={[]}
        countryName={countryName}
      />
    );
  }

  return (
    <HeroSection
      breadcrumb={breadcrumb}
      title={title}
      subtitle={subtitle}
      features={features}
      plans={plans}
      countryName={countryName}
    />
  );
}

