'use client';

import React, { useState, useEffect, useRef } from 'react';
import HeroSection from './HeroSection';
import { fetchSailyPlans, FALLBACK_PLANS } from '@/lib/sailyApi';

interface HeroSectionWrapperProps {
  breadcrumb: string;
  title: string;
  subtitle?: string;
  features: string[];
  countryName: string;
  countryCode: string;
  titleElement?: React.ReactNode;
}

export default function HeroSectionWrapper({ 
  breadcrumb,
  title,
  subtitle,
  features,
  countryName,
  countryCode,
  titleElement
}: HeroSectionWrapperProps) {
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const loadPlansRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        // Clean country code - ensure it's just the 2-letter code (e.g., "ID" not "ID:1")
        const cleanCountryCode: string = countryCode && countryCode.includes(':') 
          ? countryCode.split(':')[0] as string
          : (countryCode || '');
        
        console.log('Fetching real Saily plans for', cleanCountryCode);
        
        // Try to fetch real plans from server-side API route (bypasses CORS)
        const response = await fetch(`/api/saily-plans?countryCode=${cleanCountryCode}`);
        const apiData = await response.json();
        console.log('Server-side API response for', cleanCountryCode, ':', apiData);
        
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
          const fallbackPlans = cleanCountryCode ? ((FALLBACK_PLANS[cleanCountryCode] || []).filter(p => (p as any).planType === 'country')) : [];
          console.log('Fallback plans for', cleanCountryCode, ':', fallbackPlans);
          setPlans(fallbackPlans);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading plans:', error);
        console.log('Falling back to static plans');
        const cleanCountryCode: string = countryCode && countryCode.includes(':') 
          ? countryCode.split(':')[0] as string
          : (countryCode || '');
        const fallbackPlans = cleanCountryCode ? (FALLBACK_PLANS[cleanCountryCode] || []) : [];
        setPlans(fallbackPlans);
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
              console.log('Page became visible and plans are empty, reloading... (HeroSection)');
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
        titleElement={titleElement}
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
      titleElement={titleElement}
    />
  );
}

