export type CategoryId =
  | 'all'
  | 'core'
  | 'network'
  | 'crm'
  | 'comms'
  | 'finance'
  | 'gov'
  | 'media'
  | 'platform'
  | 'operations';

export interface BillingModule {
  id: string;
  code: string;
  name: string;
  version: string;
  category: CategoryId;
  categoryName: string;
  isCore: boolean;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  howItWorks: string[];
  plans: string[];
  dependencies?: Array<{ code: string; name: string }>;
  icon: string;
  badge?: string;
  stats?: string;
  img?: string;
  video?: string;
  vposter?: string;
  doc?: string;
  dev?: string;
  shots?: Array<{ src: string; cap: string }>;
  history?: Array<{
    version: string;
    date: string;
    isCurrent: boolean;
    changelog: string;
  }>;
}

export interface ScreenshotItem {
  src: string;
  label: string;
  cat: 'admin' | 'reports' | 'settings';
}

export interface WidgetItem {
  id: string;
  name: string;
  title?: string;
  cat: 'crm' | 'support' | 'analytics' | 'abonents' | 'ai' | 'other';
  catName: string;
  version: string;
  icon: string;
  desc: string;
  shortDesc?: string;
  fullDesc?: string;
  image?: string;
  cover?: string;
  developer?: string;
  features: string[];
  how: string[];
  howItWorks?: string | string[];
  shots: string[];
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
  category?: string;
  date: string;
  dateIso: string;
  readTime?: string;
  tags?: string[];
  cover: string;
  coverLight: string;
  href: string;
}

export interface IntegrationGroup {
  id?: string;
  title: string;
  description: string;
  desc?: string;
  items: Array<{
    name: string;
    description: string;
    iconType: string;
  }>;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  modulesIncluded: number;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  targetAudience: string;
  subscribersCapacity: string;
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  label: string;
  description: string;
  requestHeaders?: Record<string, string>;
  requestPayload?: string;
  responsePayload: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface DemoFormData {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  inn: string;
  subscribersCount: string;
  selectedPlan: string;
  comment: string;
}
