'use client';

import { useState } from 'react';
import styles from './FAQSection.module.css';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  faqs: FAQ[];
}

export default function FAQSection({ title, faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.faq}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <button
                className={styles.question}
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <h3>{faq.question}</h3>
                <span className={`${styles.arrow} ${openIndex === index ? styles.arrowOpen : ''}`}>
                  ▼
                </span>
              </button>
              {openIndex === index && (
                <div className={styles.answer}>
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

