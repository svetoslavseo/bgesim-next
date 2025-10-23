/**
 * TypeScript types for processed/transformed content
 */

export interface ProcessedPage {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  seo: SEOData;
  url: string;
  modifiedDate: string;
  publishedDate: string;
}

export interface ProcessedPost extends ProcessedPage {
  author: string;
  categories: string[];
  tags: string[];
}

export interface SEOData {
  title: string;
  description: string;
  canonical: string;
  robots: {
    index: string;
    follow: string;
  };
  openGraph: OpenGraphData;
  twitter: TwitterCardData;
  schema: any | null;
}

export interface OpenGraphData {
  type: string;
  title: string;
  description: string;
  url: string;
  siteName: string;
  images: OpenGraphImage[];
  locale: string;
  modifiedTime?: string;
}

export interface OpenGraphImage {
  url: string;
  width: number;
  height: number;
  type: string;
}

export interface TwitterCardData {
  card: string;
  misc: {
    [key: string]: string;
  };
}

export interface PageIndex {
  slug: string;
  title: string;
  url: string;
}

export interface PostIndex extends PageIndex {
  publishedDate: string;
  categories: string[];
}

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  locale: string;
  defaultMetadata: {
    title: string;
    description: string;
    keywords: string[];
  };
}



