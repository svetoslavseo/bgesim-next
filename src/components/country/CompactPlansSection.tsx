'use client';

import React, { useState, useEffect } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { convertPrice, CURRENCY_SYMBOLS } from '@/lib/currency';
import styles from './CompactPlansSection.module.css';

interface Plan {
  id: string;
  name: string;
  data: string;
  validity: string;
  priceUSD?: number;
  price: number;
  currency: string;
  identifier?: string;
  planType?: 'global' | 'regional' | 'country';
  ctaUrl?: string;
}

interface CompactPlansSectionProps {
  title: string;
  plans: Plan[];
  countryName?: string;
  onPlanSelect?: (plan: Plan) => void;
}

export default function CompactPlansSection({ 
  title, 
  plans, 
  countryName = 'USA',
  onPlanSelect
}: CompactPlansSectionProps) {
  const { currency, exchangeRates } = useCurrency();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedPlanType, setSelectedPlanType] = useState<'country' | 'regional' | 'global'>('country');

  // Filter and convert plans to current currency
  const convertedPlans = plans.map(plan => {
    const priceUSD = plan.priceUSD || plan.price;
    const convertedPrice = convertPrice(priceUSD, currency, exchangeRates || undefined);
    
    return {
      ...plan,
      price: convertedPrice,
      currency: CURRENCY_SYMBOLS[currency],
    };
  });

  // Check which plan types are available
  const availablePlanTypes = Array.from(new Set(convertedPlans.map(plan => plan.planType || 'country')));
  const hasRegionalPlans = availablePlanTypes.includes('regional');
  const hasGlobalPlans = availablePlanTypes.includes('global');

  // If selected plan type is not available, switch to country
  useEffect(() => {
    if (selectedPlanType === 'regional' && !hasRegionalPlans) {
      setSelectedPlanType('country');
    } else if (selectedPlanType === 'global' && !hasGlobalPlans) {
      setSelectedPlanType('country');
    }
  }, [selectedPlanType, hasRegionalPlans, hasGlobalPlans]);

  // Filter plans by selected type
  const filteredPlansByType = convertedPlans.filter(plan => {
    if (selectedPlanType === 'country') {
      return plan.planType === 'country' || !plan.planType;
    } else if (selectedPlanType === 'regional') {
      return plan.planType === 'regional';
    } else if (selectedPlanType === 'global') {
      return plan.planType === 'global';
    }
    return true;
  });

  // Get unique durations for the filtered plans
  const getDurationLabel = (plan: Plan) => {
    const days = plan.validity.split(' ')[0];
    return `${days} дни`;
  };

  const uniqueDurations = Array.from(new Set(filteredPlansByType.map(getDurationLabel)));
  const sortedDurations = uniqueDurations.sort((a, b) => {
    const daysA = parseInt(a?.split(' ')[0] || '0');
    const daysB = parseInt(b?.split(' ')[0] || '0');
    return daysA - daysB;
  });

  // Group plans by duration
  const plansByDuration = sortedDurations.reduce((acc, duration) => {
    const plansForDuration = filteredPlansByType.filter(plan => getDurationLabel(plan) === duration);
    acc[duration] = plansForDuration.sort((a, b) => a.price - b.price);
    return acc;
  }, {} as Record<string, Plan[]>);

  // Calculate price per GB
  const calculatePricePerGB = (plan: Plan) => {
    if (plan.data === 'Unlimited' || !plan.data) return plan.price;
    
    const dataMatch = plan.data.match(/(\d+(?:\.\d+)?)/);
    if (!dataMatch || !dataMatch[1]) return plan.price;
    
    const dataAmount = parseFloat(dataMatch[1]);
    if (dataAmount === 0) return plan.price;
    
    return plan.price / dataAmount;
  };

  // Get plan type title in Bulgarian
  const getPlanTypeTitle = (planType: string) => {
    switch (planType) {
      case 'country':
        return 'Държавен план';
      case 'regional':
        return 'Регионален план';
      case 'global':
        return 'Глобален план';
      default:
        return 'План';
    }
  };

  // Get country name in Bulgarian
  const getCountryNameInBulgarian = (countryName: string) => {
    const countryMap: Record<string, string> = {
      'Serbia': 'Сърбия',
      'Thailand': 'Тайланд',
      'UK': 'Великобритания',
      'Egypt': 'Египет',
      'Dubai': 'Дубай',
      'USA': 'САЩ',
      'Turkey': 'Турция'
    };
    return countryMap[countryName] || countryName;
  };

  // Get region name from plan name
  const getRegionNameFromPlan = (planName: string): string | null => {
    const knownRegions = ['North America', 'Balkans', 'Southeast Asia', 'Europe', 'Middle East'];
    for (const region of knownRegions) {
      if (planName.startsWith(region)) {
        return region;
      }
    }
    return null;
  };

  // Get region name in Bulgarian
  const getRegionNameInBulgarian = (englishName: string): string => {
    const regionMap: Record<string, string> = {
      'North America': 'Северна Америка',
      'Balkans': 'Балкани',
      'Southeast Asia': 'Югоизточна Азия',
      'Europe': 'Европа',
      'Middle East': 'Близък изток'
    };
    return regionMap[englishName] || englishName;
  };

  // Get the regional plan to determine the region name
  const regionalPlan = convertedPlans.find(plan => plan.planType === 'regional');
  const englishRegionName = regionalPlan ? getRegionNameFromPlan(regionalPlan.name) : null;

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    if (onPlanSelect) {
      onPlanSelect(plan);
    }
  };

  const handleBuyNow = (plan: Plan) => {
    if (plan.ctaUrl) {
      window.open(plan.ctaUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback to checkout page
      const planData = encodeURIComponent(JSON.stringify({
        ...plan,
        country: countryName
      }));
      window.location.href = `/checkout?plan=${planData}`;
    }
  };

  if (!convertedPlans || convertedPlans.length === 0) {
    return null;
  }

  return (
    <section className={styles.plans}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        
        <div className={styles.planSelector}>
          {/* Plan Type Switcher */}
          <div className={styles.planTypeSwitcher}>
            <button
              className={`${styles.switcherButton} ${selectedPlanType === 'country' ? styles.switcherButtonActive : ''}`}
              onClick={() => setSelectedPlanType('country')}
            >
              eSIM планове за {getCountryNameInBulgarian(countryName)}
            </button>
            {hasRegionalPlans && englishRegionName && (
              <button
                className={`${styles.switcherButton} ${selectedPlanType === 'regional' ? styles.switcherButtonActive : ''}`}
                onClick={() => setSelectedPlanType('regional')}
              >
                eSIM планове за {getRegionNameInBulgarian(englishRegionName)}
              </button>
            )}
            {hasGlobalPlans && (
              <button
                className={`${styles.switcherButton} ${selectedPlanType === 'global' ? styles.switcherButtonActive : ''}`}
                onClick={() => setSelectedPlanType('global')}
              >
                Глобални
              </button>
            )}
          </div>
          
          {/* Plans List by Duration */}
          <div className={styles.plansList}>
            {sortedDurations.map((duration) => (
              <div key={duration} className={styles.durationSection}>
                <h3 className={styles.durationTitle}>{duration}</h3>
                <div className={styles.plansForDuration}>
                  {plansByDuration[duration]?.map((plan) => {
                    const isSelected = selectedPlan && selectedPlan.id === plan.id;
                    
                    return (
                      <div
                        key={plan.id}
                        className={`${styles.planItem} ${isSelected ? styles.planItemSelected : ''}`}
                        onClick={() => handlePlanSelect(plan)}
                      >
                        {/* Selection Indicator */}
                        <div className={`${styles.radioButton} ${isSelected ? styles.radioButtonSelected : ''}`}>
                          {isSelected && (
                            <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20,6 9,17 4,12"></polyline>
                            </svg>
                          )}
                        </div>
                        
                        {/* Plan Type Title */}
                        {plan.planType && (
                          <div className={styles.planTypeTitle}>
                            {getPlanTypeTitle(plan.planType)}
                          </div>
                        )}
                        
                        {/* Plan Details */}
                        <div className={styles.planDetails}>
                          <div className={styles.planInfo}>
                            <div className={styles.dataAmount}>{plan.data}</div>
                            <div className={styles.validity}>{plan.validity}</div>
                          </div>
                          
                          <div className={styles.planPricing}>
                            <div className={styles.price}>
                              {plan.price.toFixed(2)}{plan.currency}
                            </div>
                            {plan.data !== 'Unlimited' && (
                              <div className={styles.pricePerGB}>
                                {calculatePricePerGB(plan).toFixed(2)}{plan.currency}/GB
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Buy Button */}
                        <button
                          className={`${styles.buyButton} ${isSelected ? styles.buyButtonActive : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBuyNow(plan);
                          }}
                        >
                          Купи
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Trust Indicators */}
          <div className={styles.trustIndicators}>
            <div className={styles.trustItem}>
              <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
              <span>Моментална активация</span>
            </div>
            <div className={styles.trustItem}>
              <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
              <span>Гарантирано сигурно</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
