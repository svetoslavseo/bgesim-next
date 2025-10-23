import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { getPageBySlug } from '@/lib/content';
import DataCalculator from '@/components/calculator/DataCalculator';

/**
 * Generate metadata for calculator page
 */
export async function generateMetadata(): Promise<Metadata> {
  const page = getPageBySlug('calculator-za-izpolzvani-mobilni-danni');
  
  if (!page) {
    return {
      title: 'Калкулатор за използван мобилен интернет при пътуване - Travel eSIM',
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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" style={{ marginTop: '30px' }}>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#404040',
              margin: '0 0 38px',
              padding: '0'
            }}>
              Колко мобилни данни(мобилен интернет) са ми нужни, когато пътувам?
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
              Този калкулатор ще Ви помогне да изчислите, колко мобилни данни изразходвате на дневна, седмична и месечна база. На база данните от калкулатора ще може да избере по-добре вашия eSIM план.
            </p>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <DataCalculator />
          </div>
        </div>
      </div>
    </main>
  );
}
