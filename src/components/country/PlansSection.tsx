'use client';

import React, { useState, useEffect } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { convertPrice, CURRENCY_SYMBOLS } from '@/lib/currency';
import styles from './PlansSection.module.css';

interface Plan {
  id: string;
  name: string;
  data: string;
  validity: string;
  priceUSD?: number; // Original USD price
  price: number;
  currency: string;
  identifier?: string;
  planType?: 'global' | 'regional' | 'country';
  ctaUrl?: string;
}

interface PlansSectionProps {
  title: string;
  lastUpdated?: string;
  plans: Plan[];
  countryName?: string;
  onPlanSelect?: (plan: Plan) => void;
  onCheckCompatibility?: () => void;
}

export default function PlansSection({ 
  title, 
  lastUpdated, 
  plans, 
  countryName = 'Bulgaria',
  onPlanSelect,
  onCheckCompatibility 
}: PlansSectionProps) {
  const { currency, exchangeRates } = useCurrency();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('');
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);

  // Filter only country plans and convert to current currency
  const countryPlans = plans.filter(plan => plan.planType === 'country');
  const convertedPlans = countryPlans.map(plan => {
    const priceUSD = plan.priceUSD || plan.price; // Use priceUSD if available, fallback to price
    const convertedPrice = convertPrice(priceUSD, currency, exchangeRates || undefined);
    
    return {
      ...plan,
      price: convertedPrice,
      currency: CURRENCY_SYMBOLS[currency],
    };
  });

  // Helper to get duration label (e.g. "7 Days", "15 Days", etc.)
  const getDurationLabel = (plan: Plan) => {
    const days = plan.validity.split(' ')[0];
    return `${days} дни`;
  };

  // Build durations from converted plans
  const uniqueDurations = Array.from(new Set(convertedPlans.map(getDurationLabel)));
  const sortedDurations = uniqueDurations.sort((a, b) => {
    const daysA = parseInt(a?.split(' ')[0] || '0');
    const daysB = parseInt(b?.split(' ')[0] || '0');
    return daysA - daysB;
  });

  // Map duration label -> number of available plans for that duration
  const durationCounts = convertedPlans.reduce((acc: Record<string, number>, plan) => {
    const label = getDurationLabel(plan);
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Set initial tab
  useEffect(() => {
    if (sortedDurations.length > 0 && !selectedTab) {
      setSelectedTab(sortedDurations[0] || '');
    }
  }, [sortedDurations, selectedTab]);

  const filteredPlans = convertedPlans.filter(plan => getDurationLabel(plan) === selectedTab);

  // Sort plans by price from low to high
  const sortedPlans = [...filteredPlans].sort((a, b) => a.price - b.price);

  // Calculate price per GB
  const calculatePricePerGB = (plan: Plan) => {
    if (plan.data === 'Unlimited' || !plan.data) return plan.price;
    
    const dataMatch = plan.data.match(/(\d+(?:\.\d+)?)/);
    if (!dataMatch || !dataMatch[1]) return plan.price;
    
    const dataAmount = parseFloat(dataMatch[1]);
    if (dataAmount === 0) return plan.price;
    
    return plan.price / dataAmount;
  };

  // Format price display
  const formatPriceDisplay = (plan: Plan): string => {
    return plan.price.toFixed(2);
  };

  // Format price per GB display
  const formatPricePerGBDisplay = (plan: Plan): string => {
    const pricePerGB = calculatePricePerGB(plan);
    return pricePerGB.toFixed(2);
  };

  // Get plan type tooltip text
  const getPlanTypeTooltip = (planType: string) => {
    switch (planType) {
      case 'global':
        return 'Глобални планове работят в 50+ държави по света';
      case 'regional':
        return 'Регионални планове работят в множество държави в определен регион';
      case 'country':
        return 'Държавни планове работят специфично в тази дестинация';
      default:
        return 'Информация за покритие на плана';
    }
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    if (onPlanSelect) {
      onPlanSelect(plan);
    }
  };

  const handleBuyNow = () => {
    if (selectedPlan) {
      // Create checkout URL with plan data
      const planData = encodeURIComponent(JSON.stringify({
        ...selectedPlan,
        country: countryName
      }));
      
      // Redirect to checkout page
      window.location.href = `/checkout?plan=${planData}`;
    }
  };

  if (!convertedPlans || convertedPlans.length === 0) {
    return (
      <section className={styles.plans}>
        <div className={styles.container}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.noPlans}>Няма налични планове в момента</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.plans}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        {lastUpdated && (
          <p className={styles.lastUpdated}>Последно обновяване: {lastUpdated}</p>
        )}
        
        <div className={styles.planSelector}>
          {/* Enhanced Header Section */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <h3 className={styles.planTitle}>Избери своя план</h3>
              <p className={styles.planSubtitle}>Избери перфектния план за данни за твоето пътуване</p>
            </div>
            
            {/* Instant Activation Badge */}
            <div className={styles.instantActivation}>
              <div className={styles.pulseDot}></div>
              <span>Моментална активация</span>
            </div>
          </div>
          
          {/* Duration Tabs */}
          <div className={styles.durationTabs}>
            {sortedDurations.map((duration) => (
              <button
                key={duration}
                className={`${styles.durationTab} ${selectedTab === duration ? styles.durationTabActive : ''}`}
                onClick={() => setSelectedTab(duration)}
              >
                <span className={styles.durationLabel}>{duration}</span>
                <div className={styles.durationCount}>
                  <span className={styles.countNumber}>{durationCounts[duration] || 0}</span>
                  <span className={styles.countLabel}>
                    {(durationCounts[duration] || 0) === 1 ? 'план' : 'плана'}
                  </span>
                </div>
              </button>
            ))}
          </div>
          
          {/* Plans List */}
          <div className={styles.plansList}>
            {sortedPlans.map((plan) => {
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
                  
                  {/* Plan Details */}
                  <div className={styles.planDetails}>
                    <div className={styles.planInfo}>
                      <div className={styles.dataAmount}>{plan.data}</div>
                      <div className={styles.validity}>{plan.validity} валидност</div>
                    </div>
                    
                    {/* Pricing Section */}
                    <div className={styles.pricing}>
                      <div className={styles.price}>
                        {formatPriceDisplay(plan)}{plan.currency}
                      </div>
                      <div className={styles.pricePerGB}>
                        {plan.data === 'Unlimited' ? (
                          <span className={styles.unlimitedBadge}>Неограничени данни</span>
                        ) : (
                          <span className={styles.perGBBadge}>
                            {formatPricePerGBDisplay(plan)}{plan.currency}/GB
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Action Button */}
          {selectedPlan ? (
            <button
              className={styles.buyButton}
              onClick={handleBuyNow}
            >
              Купи сега - {formatPriceDisplay(selectedPlan)}{selectedPlan.currency}
            </button>
          ) : (
            <button className={styles.selectButton} disabled>
              Избери план
            </button>
          )}
          
          {/* Check Compatibility Link */}
          <div className={styles.compatibilityLink}>
            <button
              onClick={() => {
                if (onCheckCompatibility) onCheckCompatibility();
              }}
              className={styles.compatibilityButton}
            >
              <svg className={styles.compatibilityIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12" y2="18"></line>
              </svg>
              Проверка на съвместимостта
            </button>
          </div>
          
          {/* Trust Indicators */}
          <div className={styles.trustIndicators}>
            <div className={styles.trustItem}>
              <div className={styles.stars}>★★★★★</div>
              <span>4.6</span>
            </div>
            <div className={styles.trustItem}>
              <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
              <span>Гарантирано сигурно плащане</span>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className={styles.paymentMethods}>
            <div className={styles.paymentMethod}>Apple Pay</div>
            <div className={styles.paymentMethod}>Google Pay</div>
            <div className={styles.paymentMethod}>Visa</div>
            <div className={styles.paymentMethod}>Mastercard</div>
            <div className={styles.paymentMethod}>Amex</div>
          </div>
        </div>
      </div>
    </section>
  );
}

