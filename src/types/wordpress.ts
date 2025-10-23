/**
 * TypeScript types for WordPress data structures
 */

export interface WordPressPage {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: {
    footnotes: string;
  };
  yoast_head_json?: YoastSEO;
  _embedded?: {
    author?: Array<{
      id: number;
      name: string;
      url: string;
      description: string;
      link: string;
      slug: string;
      avatar_urls: { [key: string]: string };
    }>;
    'wp:featuredmedia'?: Array<{
      id: number;
      source_url: string;
      alt_text: string;
      media_details: MediaDetails;
    }>;
  };
}

export interface WordPressPost extends WordPressPage {
  categories: number[];
  tags: number[];
  format: string;
  sticky: boolean;
}

export interface WordPressMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: MediaDetails;
  source_url: string;
}

export interface MediaDetails {
  width: number;
  height: number;
  file: string;
  filesize?: number;
  sizes?: {
    [key: string]: {
      file: string;
      width: number;
      height: number;
      mime_type: string;
      source_url: string;
    };
  };
  image_meta?: {
    aperture: string;
    credit: string;
    camera: string;
    caption: string;
    created_timestamp: string;
    copyright: string;
    focal_length: string;
    iso: string;
    shutter_speed: string;
    title: string;
    orientation: string;
    keywords: string[];
  };
}

export interface YoastSEO {
  title: string;
  description: string;
  robots: {
    index: string;
    follow: string;
    'max-snippet': string;
    'max-image-preview': string;
    'max-video-preview': string;
  };
  canonical: string;
  og_locale: string;
  og_type: string;
  og_title: string;
  og_description: string;
  og_url: string;
  og_site_name: string;
  article_modified_time?: string;
  og_image?: Array<{
    url: string;
    width: number;
    height: number;
    type: string;
  }>;
  twitter_card: string;
  twitter_misc?: {
    [key: string]: string;
  };
  schema: {
    '@context': string;
    '@graph': any[];
  };
}

export interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: any[];
}

export interface WordPressTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: any[];
}

export interface MediaMapping {
  [oldUrl: string]: string;
}

export interface FontInfo {
  family: string;
  weights: number[];
  styles: string[];
  source: string;
  files: FontFile[];
}

export interface FontFile {
  weight: number;
  style: string;
  format: string;
  url?: string;
  localPath: string;
}



