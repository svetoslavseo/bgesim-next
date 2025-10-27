import CTASection from '@/components/country/CTASection';
import { getLowestPricePerGB } from '@/lib/sailyApi';
import { cache } from 'react';

// Cache the price calculation to avoid re-computing on every render
const getCachedLowestPrice = cache(async () => {
  return await getLowestPricePerGB();
});

export default async function DynamicCTASection() {
  const { priceInBGN } = await getCachedLowestPrice();
  
  const description = `Бързо и сигурно свързване, без нуждата да вадите сегашната SIM карта от телефона. Гарантирано ниски цени от ${priceInBGN}лв за GB`;
  
  return (
    <CTASection
      title="Купи своята eSIM карта сега и спести пари от роуминг."
      description={description}
      ctaText="Дестинации"
      ctaUrl="/durjavi/"
      variant="purple"
    />
  );
}

