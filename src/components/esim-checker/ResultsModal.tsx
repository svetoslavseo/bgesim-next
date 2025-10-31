'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ResultsModal.module.css';

interface Device {
  model: string;
  notes: string | null;
}

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device | null;
  brand: string;
  searchedModel: string;
  disclaimer: string;
}

export default function ResultsModal({ 
  isOpen, 
  onClose, 
  device, 
  brand, 
  searchedModel,
  disclaimer 
}: ResultsModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Focus trap - focus first interactive element
      const modal = document.querySelector('[role="dialog"]');
      if (modal) {
        const firstButton = modal.querySelector('button');
        firstButton?.focus();
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleBuyESIM = () => {
    router.push('/durjavi');
  };

  return (
    <div 
      className={styles.backdrop} 
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div 
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {device ? (
          // Success State
          <>
            <div className={styles.successIcon}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="32" fill="#10B981"/>
                <path 
                  d="M20 32L28 40L44 24" 
                  stroke="white" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            
            <h2 id="modal-title" className={styles.title}>
              Съвместим с eSIM!
            </h2>
            
            <div className={styles.deviceInfo}>
              <p className={styles.brand}>{brand}</p>
              <p className={styles.model}>{device.model}</p>
            </div>
            
            {device.notes && (
              <div className={styles.notes}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="#F59E0B" strokeWidth="2"/>
                  <path d="M10 6V11M10 14V14.5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <p>{device.notes}</p>
              </div>
            )}
            
            <div className={styles.disclaimer}>
              <p>{disclaimer}</p>
            </div>
            
            <div className={styles.actions}>
              <button 
                onClick={handleBuyESIM}
                className={styles.primaryButton}
              >
                Купи eSIM сега
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{ marginLeft: '8px' }}
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
              <button 
                onClick={onClose}
                className={styles.secondaryButton}
              >
                Провери друго устройство
              </button>
            </div>
          </>
        ) : (
          // Not Found State
          <>
            <div className={styles.notFoundIcon}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="32" fill="#EF4444"/>
                <path 
                  d="M24 24L40 40M40 24L24 40" 
                  stroke="white" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                />
              </svg>
            </div>
            
            <h2 id="modal-title" className={styles.title}>
              Не намерихме {searchedModel}
            </h2>
            
            <div className={styles.notFoundContent}>
              <p className={styles.instruction}>
                Моля, проверете ръчно дали вашето устройство поддържа eSIM:
              </p>
              
              <div className={styles.steps}>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>1</span>
                  <p>Отворете <strong>Настройки</strong></p>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>2</span>
                  <p>Изберете <strong>За телефона</strong> или <strong>About Phone</strong></p>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>3</span>
                  <p>Потърсете <strong>EID номер</strong> в секция Status или IMEI</p>
                </div>
              </div>
              
              <div className={styles.tipBox}>
                <p>
                  <strong>💡 Съвет:</strong> Ако видите EID номер (обикновено 32-цифрен), 
                  вашето устройство поддържа eSIM технология!
                </p>
              </div>
            </div>
            
            <div className={styles.actions}>
              <button 
                onClick={onClose}
                className={styles.primaryButton}
              >
                Провери друго устройство
              </button>
            </div>
          </>
        )}
        
        <button 
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Затвори"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M6 6L18 18M18 6L6 18" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

