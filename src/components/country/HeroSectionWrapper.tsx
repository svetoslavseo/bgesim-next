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
        
        // Try to fetch real plans from server-side API route (bypasses CORS)
        const response = await fetch(`/api/saily-plans?countryCode=${countryCode}`);
        const apiData = await response.json();
        console.log('Server-side API response for', countryCode, ':', apiData);
        
        const sailyPlans = apiData.success ? apiData.plans : [];

        // Keep only country-specific plans for the hero selector
        const countryOnly = Array.isArray(sailyPlans)
          ? sailyPlans.filter((p: any) => p.planType === 'country')
          : [];
        
        if (countryOnly && countryOnly.length > 0) {
          console.log('Using real Saily country plans:', countryOnly.length);
          setPlans(countryOnly);
        } else if (sailyPlans && sailyPlans.length > 0) {
          console.log('No explicit country-only plans found, falling back to all returned plans');
          setPlans(sailyPlans);
        } else {
          console.log('No Saily plans found, using fallback');
          const fallbackPlans = (FALLBACK_PLANS[countryCode] || []).filter(p => (p as any).planType === 'country');
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

  // Show skeleton loading to prevent CLS
  if (isLoading) {
    return (
      <HeroSection
        breadcrumb={breadcrumb}
        title={title}
        subtitle={subtitle}
        features={features}
        plans={[]}
        countryName={countryName}
        countryCode={countryCode}
        isLoading={true}
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
      countryCode={countryCode}
    />
  );
}

