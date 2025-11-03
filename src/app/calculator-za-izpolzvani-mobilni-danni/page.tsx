import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { getPageBySlug } from '@/lib/content';
import HeroSection from '@/components/calculator/HeroSection';
import DataCalculator from '@/components/calculator/DataCalculator';
import DynamicCTASection from '@/components/common/DynamicCTASection';

/**
 * Generate metadata for calculator page
 */
export async function generateMetadata(): Promise<Metadata> {
  const page = getPageBySlug('calculator-za-izpolzvani-mobilni-danni');
  
  if (!page) {
    return {
      title: 'Калкулатор за използван мобилен интернет при пътуване',
      description: 'Калкулатор за използвани мобилни данни при пътуване - Travel eSIM BG',
    };
  }
  
  return generateSEOMetadata(page.seo);
}

/**
 * Calculator page component
 */
export default function CalculatorPage() {
  return (
    <main>
      <HeroSection />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <DataCalculator />
      </div>
      <DynamicCTASection />
    </main>
  );
}
