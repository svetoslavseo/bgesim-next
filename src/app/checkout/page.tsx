'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCurrency } from '@/contexts/CurrencyContext';
import { convertPrice, CURRENCY_SYMBOLS } from '@/lib/currency';
import styles from './page.module.css';

interface Plan {
  id: string;
  name: string;
  data: string;
  validity: string;
  priceUSD?: number; // Original USD price
  price: number;
  currency: string;
  country: string;
  identifier?: string;
  priceIdentifier?: string; // Price identifier for Saily checkout
}

const CheckoutPage = () => {
  const { currency, exchangeRates } = useCurrency();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPackageDetailsOpen, setIsPackageDetailsOpen] = useState(false);

  // Map country names to flag file codes
  const getCountryFlagCode = (country: string): string => {
    const flagMap: Record<string, string> = {
      // English names
      'Thailand': 'th',
      'Serbia': 'rs',
      'Dubai': 'ae',
      'Egypt': 'eg',
      'USA': 'us',
      'UK': 'gb',
      'Turkey': 'tr',
      // Bulgarian names
      'Тайланд': 'th',
      'Сърбия': 'rs',
      'Дубай': 'ae',
      'Египет': 'eg',
      'САЩ': 'us',
      'Великобритания': 'gb',
      'Турция': 'tr'
    };
    return flagMap[country] || 'th';
  };

  useEffect(() => {
    // Get plan data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const planData = urlParams.get('plan');
    
    console.log('Checkout - URL params:', window.location.search);
    console.log('Checkout - Plan data from URL:', planData);
    
    if (planData) {
      try {
        const decodedPlan = JSON.parse(decodeURIComponent(planData));
        console.log('Checkout - Decoded plan:', decodedPlan);
        
        // Validate the plan data
        if (decodedPlan && typeof decodedPlan === 'object') {
          setPlan(decodedPlan);
          console.log('Checkout - Plan set successfully:', decodedPlan);
        } else {
          console.error('Checkout - Invalid plan data type');
          setError('Невалидни данни за плана');
        }
      } catch (error) {
        console.error('Checkout - Error parsing plan data:', error);
        setError('Не може да се зареди планът');
      }
    } else {
      console.error('Checkout - No plan data in URL');
      setError('Не е предоставен план');
    }
    
    setIsLoading(false);
  }, []);

  const handleProceedToPayment = () => {
    if (!plan) {
      setError('Липсва информация за плана');
      return;
    }

    try {
      // Generate Saily affiliate link using the price identifier (preferred) or plan identifier
      const identifierToUse = plan.priceIdentifier || plan.identifier;
      
      if (identifierToUse) {
        // Use the Saily affiliate link format
        const sailyCheckoutUrl = `https://saily.com/checkout/?planId=${identifierToUse}&aff_transaction_id={transaction_id}&aff_offer_id={offer_id}&aff_id={aff_id}`;
        const finalUrl = `https://go.saily.site/aff_c?offer_id=101&aff_id=8080&url=${encodeURIComponent(sailyCheckoutUrl)}`;
        
        console.log('Redirecting to Saily:', finalUrl);
        console.log('Using identifier:', identifierToUse, plan.priceIdentifier ? '(price identifier)' : '(plan identifier)');
        window.location.href = finalUrl;
      } else {
        // Fallback to Breeze if no Saily identifier
        const countryProductMap: Record<string, string> = {
          // English names
          'Thailand': 'esimg_th_v2',
          'Serbia': 'esimg_rs_v2',
          'Dubai': 'esimg_ae_v2',
          'Egypt': 'esimg_eg_v2',
          'USA': 'esimg_us_v2',
          'UK': 'esimg_gb_v2',
          'Turkey': 'esimg_tr_v2',
          // Bulgarian names
          'Тайланд': 'esimg_th_v2',
          'Сърбия': 'esimg_rs_v2',
          'Дубай': 'esimg_ae_v2',
          'Египет': 'esimg_eg_v2',
          'САЩ': 'esimg_us_v2',
          'Великобритания': 'esimg_gb_v2',
          'Турция': 'esimg_tr_v2'
        };

        const productCode = countryProductMap[plan.country] || 'esimg_th_v2';
        const finalUrl = `https://breezesim.com/products/${productCode}?sca_ref=8208552.WYX2DxgbRN&sca_source=tesim_bg`;
        
        console.log('Redirecting to Breeze (fallback):', finalUrl);
        window.location.href = finalUrl;
      }
    } catch (error) {
      console.error('Error redirecting to payment:', error);
      setError('Не може да се продължи към плащането');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingCard}>
          <div className={styles.loadingContent}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Зареждане...</p>
          </div>
        </div>
      </div>
    );
  }

  // Convert plan price to current currency
  const convertedPlan = plan ? {
    ...plan,
    price: convertPrice(plan.priceUSD || plan.price, currency, exchangeRates || undefined),
    currency: CURRENCY_SYMBOLS[currency],
  } : null;

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorCard}>
          <Link href="/" className={styles.backLink}>
            <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад
          </Link>
          <div className={styles.errorContent}>
            <div className={styles.errorIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.errorIconSvg}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className={styles.errorTitle}>Грешка</h2>
            <p className={styles.errorMessage}>{error}</p>
            <Link href="/" className={styles.errorButton}>
              Върни се в началото
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link href="/" className={styles.backLink}>
          <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Назад
        </Link>
        
        <div className={styles.card}>
          <h1 className={styles.title}>Данни за Поръчка</h1>
          
          {/* Plan Summary */}
          <div className={styles.planSummary}>
            <div className={styles.planHeader}>
              <div className={styles.planIcon}>
                <Image
                  src={`/media/flags/${getCountryFlagCode(convertedPlan?.country || '')}.svg`}
                  alt={`${convertedPlan?.country} flag`}
                  width={48}
                  height={48}
                  className={styles.flagImage}
                />
              </div>
              <h2 className={styles.planTitle}>
                eSIM за {convertedPlan?.country}
              </h2>
            </div>
            
            <div className={styles.planDetailsTable}>
              <table className={styles.esimTable}>
                <tbody>
                  <tr>
                    <td className={styles.tableLabel}>
                      <svg className={styles.tableIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Тип eSIM:
                    </td>
                    <td className={styles.tableValue}>Мобилни Данни</td>
                  </tr>
                  <tr>
                    <td className={styles.tableLabel}>
                      <svg className={styles.tableIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                      Размер Мобилни Данни:
                    </td>
                    <td className={styles.tableValue}>{convertedPlan?.data}</td>
                  </tr>
                  <tr>
                    <td className={styles.tableLabel}>
                      <svg className={styles.tableIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Валидност:
                    </td>
                    <td className={styles.tableValue}>{convertedPlan?.validity}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
          </div>

          {/* Payment Methods */}
          <div className={styles.paymentSection}>
            <div className={styles.paymentHeader}>
              <svg className={styles.paymentIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <h3 className={styles.paymentTitle}>Методи на плащане</h3>
            </div>
            <div className={styles.paymentMethods}>
              <Image src="/media/logos/apple-pay.png" alt="Apple Pay" width={24} height={15} className={styles.paymentLogo} />
              <Image src="/media/logos/google-pay.png" alt="Google Pay" width={24} height={15} className={styles.paymentLogo} />
              <Image src="/media/logos/visa.png" alt="Visa" width={24} height={15} className={styles.paymentLogo} />
              <Image src="/media/logos/mastercard.png" alt="Mastercard" width={24} height={15} className={styles.paymentLogo} />
              <Image src="/media/logos/amex.png" alt="Amex" width={24} height={15} className={styles.paymentLogo} />
            </div>
          </div>

          {/* Security Notice */}
          <div className={styles.securityNotice}>
            <div className={styles.securityContent}>
              <div className={styles.securityIconContainer}>
                <svg className={styles.securityIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className={styles.securityTextContainer}>
                <span className={styles.securityText}>SSL шифроване за сигурност</span>
                <span className={styles.securitySubtext}>Вашите данни са защитени</span>
              </div>
            </div>
          </div>

          {/* Package Details Button - Desktop */}
          <div className={styles.packageDetailsSection}>
            <button
              onClick={() => setIsPackageDetailsOpen(true)}
              className={styles.packageDetailsButton}
            >
              <svg className={styles.packageDetailsIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={styles.packageDetailsText}>Информация за плана</span>
            </button>
          </div>

          {/* Desktop CTA Button */}
          <div className={styles.desktopCta}>
            <div className={styles.desktopCtaTotal}>
              <span className={styles.desktopCtaTotalLabel}>Общо:</span>
              <span className={styles.desktopCtaTotalPrice}>{convertedPlan?.price?.toFixed(2)}{convertedPlan?.currency}</span>
            </div>
            <button
              onClick={handleProceedToPayment}
              className={styles.desktopCtaButton}
            >
              <span className={styles.checkoutButtonText}>Продължи</span>
              <svg className={styles.checkoutButtonArrow} width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky checkout bar */}
      <div className={styles.stickyBar}>
        <div className={styles.stickyBarContent}>
          <button
            onClick={() => setIsPackageDetailsOpen(true)}
            className={styles.stickyPackageDetailsButton}
          >
            <svg className={styles.packageDetailsIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={styles.packageDetailsText}>Информация за плана</span>
          </button>
          <div className={styles.stickyBarTotal}>
            <span className={styles.stickyBarTotalLabel}>Общо:</span>
            <span className={styles.stickyBarTotalPrice}>{convertedPlan?.price?.toFixed(2)}{convertedPlan?.currency}</span>
          </div>
          <button
            onClick={handleProceedToPayment}
            className={styles.checkoutButton}
          >
            <span className={styles.checkoutButtonText}>Продължи</span>
            <svg className={styles.checkoutButtonArrow} width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Package Details Modal */}
      {isPackageDetailsOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsPackageDetailsOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Информация за плана</h2>
              <button
                onClick={() => setIsPackageDetailsOpen(false)}
                className={styles.modalCloseButton}
              >
                <svg className={styles.modalCloseIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailSection}>
                <div className={styles.detailHeader}>
                  <span className={styles.detailIcon}>🗓️</span>
                  <h3 className={styles.detailTitle}>Валидност</h3>
                </div>
                <div className={styles.detailContent}>
                  <p className={styles.detailText}>
                    Валидността започва, когато eSIM картата се свърже с мрежа в зоната на покритие. Ако я инсталирате извън зоната, ще се активира при пристигане.
                  </p>
                  <p className={styles.detailSource}>
                    (Източник: Saily Help Center)
                  </p>
                </div>
              </div>

              <div className={styles.detailSection}>
                <div className={styles.detailHeader}>
                  <span className={styles.detailIcon}>🔄</span>
                  <h3 className={styles.detailTitle}>Презареждане</h3>
                </div>
                <div className={styles.detailContent}>
                  <p className={styles.detailText}>
                    Можете да презаредите Saily eSIM през приложението Saily, след като изтече трафикът или валидността.
                  </p>
                  <p className={styles.detailSource}>
                    (Източник: Saily Support)
                  </p>
                </div>
              </div>

              <div className={styles.detailSection}>
                <div className={styles.detailHeader}>
                  <span className={styles.detailIcon}>💬</span>
                  <h3 className={styles.detailTitle}>Бележка</h3>
                </div>
                <div className={styles.detailContent}>
                  <p className={styles.detailText}>
                    Travel eSIM BG работи с афилиейт програма на Saily. При плащане ще бъдете пренасочени към страницата на Saily, за да завършите покупката си.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
