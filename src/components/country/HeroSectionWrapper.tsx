'use client';

import React, { useState, useEffect } from 'react';
import HeroSection from './HeroSection';
import { FALLBACK_PLANS } from '@/lib/sailyApi';

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
        // Use fallback plans immediately
        const fallbackPlans = FALLBACK_PLANS[countryCode] || [];
        console.log('Loading plans for', countryCode, fallbackPlans);
        setPlans(fallbackPlans);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading plans:', error);
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

