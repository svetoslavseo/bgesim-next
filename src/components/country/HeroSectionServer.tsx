import HeroSectionWrapper from './HeroSectionWrapper';
import CountryTitle from './CountryTitle';

interface HeroSectionServerProps {
  breadcrumb: string;
  title: string;
  subtitle?: string;
  features: string[];
  countryName: string;
  countryCode: string;
}

export default function HeroSectionServer({
  breadcrumb,
  title,
  subtitle,
  features,
  countryName,
  countryCode,
}: HeroSectionServerProps) {
  // Render the title with flag server-side
  const titleElement = (
    <CountryTitle 
      title={title} 
      countryCode={countryCode} 
      countryName={countryName} 
    />
  );

  return (
    <HeroSectionWrapper
      breadcrumb={breadcrumb}
      title={title}
      subtitle={subtitle}
      features={features}
      countryName={countryName}
      countryCode={countryCode}
      titleElement={titleElement}
    />
  );
}

