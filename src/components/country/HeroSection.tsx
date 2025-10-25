'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { convertPrice, CURRENCY_SYMBOLS } from '@/lib/currency';
import styles from './HeroSection.module.css';

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
}

interface HeroSectionProps {
  breadcrumb: string;
  title: string;
  subtitle?: string;
  features: string[];
  plans: Plan[];
  countryName: string;
  isLoading?: boolean;
}

export default function HeroSection({
  breadcrumb,
  title,
  subtitle,
  features,
  plans,
  countryName,
  isLoading = false
}: HeroSectionProps) {
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

  // Helper to get duration label
  const getDurationLabel = (plan: Plan) => {
    const days = plan.validity.split(' ')[0];
    return `${days} дни`;
  };

  // Build durations from converted plans - with safety check
  const uniqueDurations = Array.from(new Set((convertedPlans || []).map(getDurationLabel)));
  const sortedDurations = uniqueDurations.sort((a, b) => {
    const daysA = parseInt(a?.split(' ')[0] || '0');
    const daysB = parseInt(b?.split(' ')[0] || '0');
    return daysA - daysB;
  });

  // Map duration label -> number of available plans
  const durationCounts = (convertedPlans || []).reduce((acc: Record<string, number>, plan) => {
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

  const filteredPlans = (convertedPlans || []).filter(plan => getDurationLabel(plan) === selectedTab);
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

  const formatPriceDisplay = (plan: Plan): string => {
    return plan.price.toFixed(2);
  };

  const formatPricePerGBDisplay = (plan: Plan): string => {
    const pricePerGB = calculatePricePerGB(plan);
    return pricePerGB.toFixed(2);
  };

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
  };

  const handleBuyNow = () => {
    if (selectedPlan) {
      const planWithCountry = {
        ...selectedPlan,
        country: countryName
      };
      console.log('Hero - Selected plan:', selectedPlan);
      console.log('Hero - Plan with country:', planWithCountry);
      
      const planData = encodeURIComponent(JSON.stringify(planWithCountry));
      const checkoutUrl = `/checkout?plan=${planData}`;
      
      console.log('Hero - Checkout URL:', checkoutUrl);
      console.log('Hero - Redirecting to checkout...');
      
      window.location.href = checkoutUrl;
    } else {
      console.error('Hero - No plan selected!');
    }
  };

  const handleCheckCompatibility = () => {
    window.open('/proverka-na-syvmestimost-s-esim', '_blank', 'noopener,noreferrer');
  };

  // Check if plans are available
  if (!convertedPlans || convertedPlans.length === 0) {
    return (
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.content}>
            <nav className={styles.breadcrumb}>
              <Link href="/">Travel eSIM</Link>
              <span> » </span>
              <span>{breadcrumb}</span>
            </nav>
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            <ul className={styles.features}>
              {features.map((feature, index) => (
                <li key={index}>
                  <svg className={styles.checkmark} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.planSelector}>
            {isLoading ? (
              <div className={styles.skeletonLoader}>
                <div>
                  <div className={styles.skeletonHeader}>
                    <div className={styles.skeletonTitle}></div>
                    <div className={styles.skeletonSubtitle}></div>
                  </div>
                  <div className={styles.skeletonTabs}>
                    <div className={styles.skeletonTab}></div>
                    <div className={styles.skeletonTab}></div>
                    <div className={styles.skeletonTab}></div>
                  </div>
                  <div className={styles.skeletonPlans}>
                    <div className={styles.skeletonPlan}></div>
                    <div className={styles.skeletonPlan}></div>
                    <div className={styles.skeletonPlan}></div>
                  </div>
                </div>
                <div>
                  <div className={styles.skeletonButton}></div>
                  <div className={styles.skeletonTrust}></div>
                  <div className={styles.skeletonPayment}></div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: '#6b7280', margin: '0' }}>Зареждане на планове...</p>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb}>
            <Link href="/">Travel eSIM</Link>
            <span> » </span>
            <span>{breadcrumb}</span>
          </nav>

          {/* Title */}
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

          {/* Features List */}
          <ul className={styles.features}>
            {features.map((feature, index) => (
              <li key={index}>
                <svg className={styles.checkmark} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Interactive Plan Selector */}
        <div className={styles.planSelector}>
          {/* Header */}
          <div className={styles.planHeader}>
            <div className={styles.planHeaderContent}>
              <h2 className={styles.planTitle}>Избери своя план</h2>
              <p className={styles.planSubtitle}>Избери перфектния план за данни за твоето пътуване</p>
            </div>
            
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
                  <div className={`${styles.radioButton} ${isSelected ? styles.radioButtonSelected : ''}`}>
                    {isSelected && (
                      <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                    )}
                  </div>
                  
                  <div className={styles.planDetails}>
                    <div className={styles.planInfo}>
                      <div className={styles.dataAmount}>{plan.data}</div>
                      <div className={styles.validity}>{plan.validity} валидност</div>
                    </div>
                    
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
            <button onClick={handleCheckCompatibility} className={styles.compatibilityButton}>
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
            <Image src="/media/logos/apple-pay.png" alt="Apple Pay" width={28} height={18} className={styles.paymentLogo} />
            <Image src="/media/logos/google-pay.png" alt="Google Pay" width={28} height={18} className={styles.paymentLogo} />
            <Image src="/media/logos/visa.png" alt="Visa" width={28} height={18} className={styles.paymentLogo} />
            <Image src="/media/logos/mastercard.png" alt="Mastercard" width={28} height={18} className={styles.paymentLogo} />
            <Image src="/media/logos/amex.png" alt="Amex" width={28} height={18} className={styles.paymentLogo} />
          </div>
        </div>
      </div>
    </section>
  );
}

