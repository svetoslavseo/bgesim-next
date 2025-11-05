'use client';

import React, { useState, useEffect } from 'react';
import CompactPlansSection from './CompactPlansSection';
import { FALLBACK_PLANS } from '@/lib/sailyApi';

/**
 * CompactPlansSectionWrapper Component
 * 
 * Fetches plans from API and applies the same deduplication logic as HeroSectionWrapper
 * to ensure both sections show the same plans.
 */

interface CompactPlansSectionWrapperProps {
  title: string;
  countryName: string;
  countryCode: string;
}

// Helper function to deduplicate plans by type
// Keeps the best (lowest price) plan for each (data, validity) combination per plan type
const deduplicateByType = (plans: any[], planType: string) => {
  const filtered = plans.filter((p: any) => p.planType === planType);
  const bestBySignature = new Map<string, any>();
  
  filtered.forEach((plan: any) => {
    const priceUSD = (plan.priceUSD ?? plan.price) || 0;
    const key = `${plan.data}|${plan.validity}`;
    const existing = bestBySignature.get(key);
    if (!existing) {
      bestBySignature.set(key, plan);
    } else {
      const existingPrice = (existing.priceUSD ?? existing.price) || 0;
      if (priceUSD < existingPrice) {
        bestBySignature.set(key, plan);
      }
    }
  });
  
  return Array.from(bestBySignature.values());
};

// Helper function to process plans (deduplicate and combine all types)
const processPlans = (sailyPlans: any[]) => {
  const dedupedCountryPlans = deduplicateByType(sailyPlans, 'country');
  const dedupedRegionalPlans = deduplicateByType(sailyPlans, 'regional');
  const dedupedGlobalPlans = deduplicateByType(sailyPlans, 'global');
  
  return {
    country: dedupedCountryPlans,
    regional: dedupedRegionalPlans,
    global: dedupedGlobalPlans,
    all: [...dedupedCountryPlans, ...dedupedRegionalPlans, ...dedupedGlobalPlans]
  };
};

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
        console.log('Fetching real Saily plans for', countryCode, '(CompactPlansSection)');
        
        // Fetch real plans from server-side API route (same as HeroSectionWrapper)
        const response = await fetch(`/api/saily-plans?countryCode=${countryCode}`);
        const apiData = await response.json();
        console.log('Server-side API response for', countryCode, '(CompactPlansSection):', apiData);
        
        const sailyPlans = apiData.success ? apiData.plans : [];
        
        if (sailyPlans && sailyPlans.length > 0) {
          const processed = processPlans(sailyPlans);
          
          if (processed.all.length > 0) {
            console.log('Using real Saily plans (deduplicated):', {
              country: processed.country.length,
              regional: processed.regional.length,
              global: processed.global.length,
              total: processed.all.length
            });
            setPlans(processed.all);
            setLastUpdated(apiData.lastUpdated);
          } else {
            console.log('No deduplicated plans, using all returned plans');
            setPlans(sailyPlans);
            setLastUpdated(apiData.lastUpdated);
          }
        } else {
          console.log('No Saily plans found, using fallback');
          const fallbackPlans = FALLBACK_PLANS[countryCode] || [];
          const processed = processPlans(fallbackPlans);
          console.log('Fallback plans (deduplicated) for', countryCode, ':', {
            country: processed.country.length,
            regional: processed.regional.length,
            global: processed.global.length,
            total: processed.all.length
          });
          setPlans(processed.all);
          setLastUpdated(undefined);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading plans:', error);
        console.log('Falling back to static plans');
        const fallbackPlans = FALLBACK_PLANS[countryCode] || [];
        const processed = processPlans(fallbackPlans);
        setPlans(processed.all);
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
