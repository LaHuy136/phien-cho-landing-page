export interface FontConfig {
  serifFont: string;
  sansFont: string;
  fontSizeScale: number; // 0.9, 1.0, 1.1
  headingLetterSpacing: string; // normal, tight, wide
  headingWeight: string; // 400, 600, 700
}

export interface StallItem {
  id: string;
  name: string;
  desc: string;
  sub: string;
  color: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface TimelineEventItem {
  time: string;
  title: string;
  desc: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface LandingConfig {
  fonts: FontConfig;
  hero: {
    title?: string;
    description?: string;
    visualType: 'background' | 'image' | 'split' | 'coin';
    customImageUrl?: string;
    keyVisualUrl?: string;
    showCountdown: boolean;
    customTagline?: string;
    eventDate: string; // e.g. "2026-11-24T17:30:00+07:00"
    eventDateFormatted: string;
    eventTimeFormatted: string;
    locationName: string;
    locationAddress: string;
    priceAdult: number;
    priceChildRatio: number;
    totalTickets: number;
  };
  story?: {
    quote: string;
    paragraph1: string;
    paragraph2: string;
  };
  timeline?: {
    title: string;
    subtitle: string;
    events: TimelineEventItem[];
  };
  stallsSection?: {
    title: string;
    subtitle: string;
  };
  stallsStyle: 'card-image' | 'minimal-classic' | 'floating-badge';
  stalls: StallItem[];
  faqs?: FaqItem[];
  gallery: {
    enabled: boolean;
    title: string;
    subtitle: string;
    images: { url: string; caption: string }[];
  };
  themePalette: {
    bg: string;
    card: string;
    ink: string;
    muted: string;
    line: string;
    accent: string;
    deep: string;
    gold: string;
    teal: string;
  };
}

export type PresetKey = 'original' | 'ancientHoiAn' | 'hueImperial' | 'modernRiverside';
