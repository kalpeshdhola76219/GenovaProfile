/**
 * GenovaProfile Clean Path Routing & Canonical SEO Configuration
 * Replaces hash routing with standard HTML5 History API paths.
 */

export interface PageSeoConfig {
  title: string;
  description: string;
  canonicalPath: string;
}

export const SEO_CONFIG: Record<string, PageSeoConfig> = {
  home: {
    title: 'Genova Profile – Professional Resumes, Biodatas & Cover Letters',
    description: 'Craft outstanding professional resumes, traditional marriage biodatas, and executive cover letters in minutes. Clean A4 exports.',
    canonicalPath: '/',
  },
  'resume-templates': {
    title: 'Professional Resume Templates – Genova Profile',
    description: 'ATS-friendly single column, modern corporate, tech stack showcases, and executive leadership resume templates.',
    canonicalPath: '/resume-templates',
  },
  'biodata-templates': {
    title: 'Marriage Biodata Templates – Genova Profile',
    description: 'Culturally authentic Vedic formats, elegant gold crests, royal floral frames, and modern Indian matrimonial biodata designs.',
    canonicalPath: '/biodata-templates',
  },
  'cover-letter-templates': {
    title: 'Cover Letter Templates – Genova Profile',
    description: 'Pair your resume with beautifully formatted corporate, executive, tech, and creative cover letter templates.',
    canonicalPath: '/cover-letter-templates',
  },
  pricing: {
    title: 'Pricing – Genova Profile',
    description: 'Pay only when you export. Free templates forever or unlock premium designer templates with one-time payment of ₹29 to ₹99.',
    canonicalPath: '/pricing',
  },
  about: {
    title: 'About Us – Genova Profile',
    description: 'Learn about Genova Profile, our mission to simplify document design, and our commitment to privacy and craftsmanship.',
    canonicalPath: '/about',
  },
  contact: {
    title: 'Contact Support – Genova Profile',
    description: 'Get in touch with the Genova Profile support team. We reply to all customer inquiries and refund requests within 1-2 working days.',
    canonicalPath: '/contact',
  },
  'privacy-policy': {
    title: 'Privacy Policy – Genova Profile',
    description: 'Read our privacy policy. Learn how Genova Profile securely processes customer data, document sessions, and payment information.',
    canonicalPath: '/privacy-policy',
  },
  terms: {
    title: 'Terms & Conditions – Genova Profile',
    description: 'Review the terms and conditions for using the Genova Profile document creation and digital download services.',
    canonicalPath: '/terms',
  },
  'refund-policy': {
    title: 'Refund Policy – Genova Profile',
    description: 'Understand Genova Profile’s transparent refund policy for digital purchases and downloadable PDF files.',
    canonicalPath: '/refund-policy',
  },
  'shipping-policy': {
    title: 'Shipping & Delivery Policy – Genova Profile',
    description: 'Genova Profile delivers 100% digital products instantly upon successful payment completion. No physical shipping is required.',
    canonicalPath: '/shipping-policy',
  },
  restore: {
    title: 'Restore Purchases & Recovery – Genova Profile',
    description: 'Recover previously purchased documents using your order ID, mobile number, or secret recovery code.',
    canonicalPath: '/restore',
  },
  dashboard: {
    title: 'My Documents – Genova Profile',
    description: 'Manage your saved resumes, matrimonial biodatas, and cover letters.',
    canonicalPath: '/dashboard',
  },
  builder: {
    title: 'Document Builder – Genova Profile',
    description: 'Customize your document with live preview, typography selection, and instant high-resolution A4 export.',
    canonicalPath: '/builder',
  },
  'payment-result': {
    title: 'Payment Result – Genova Profile',
    description: 'Verify your payment status and download your unlocked high-resolution document PDF.',
    canonicalPath: '/payment-result',
  },
};

// Clean Path to Page Identifier Mapping
export const PATH_TO_PAGE_MAP: Record<string, string> = {
  '/': 'home',
  '/resume-templates': 'resume-templates',
  '/biodata-templates': 'biodata-templates',
  '/cover-letter-templates': 'cover-letter-templates',
  '/pricing': 'home',
  '/about': 'about',
  '/contact': 'contact',
  '/privacy-policy': 'privacy-policy',
  '/privacy': 'privacy-policy',
  '/terms': 'terms',
  '/refund-policy': 'refund-policy',
  '/shipping-policy': 'shipping-policy',
  '/restore': 'restore',
  '/recovery': 'restore',
  '/dashboard': 'dashboard',
  '/builder': 'builder',
  '/payment-result': 'payment-result',
};

// Page Identifier to Canonical Clean Path
export const PAGE_TO_PATH_MAP: Record<string, string> = {
  home: '/',
  'resume-templates': '/resume-templates',
  'biodata-templates': '/biodata-templates',
  'cover-letter-templates': '/cover-letter-templates',
  pricing: '/pricing',
  about: '/about',
  contact: '/contact',
  'privacy-policy': '/privacy-policy',
  privacy: '/privacy-policy',
  terms: '/terms',
  'refund-policy': '/refund-policy',
  'shipping-policy': '/shipping-policy',
  restore: '/restore',
  recovery: '/restore',
  dashboard: '/dashboard',
  builder: '/builder',
  'payment-result': '/payment-result',
};

/**
 * Resolves current URL pathname (or legacy hash) to page identifier.
 * Automatically performs backward compatibility redirect from legacy #hash URLs.
 */
export function resolveCurrentRoute(): string {
  if (typeof window === 'undefined') return 'home';

  // 1. Backward Compatibility: Redirect legacy #hash URLs to clean paths
  if (window.location.hash) {
    const rawHash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
    const targetPath = PAGE_TO_PATH_MAP[rawHash] || (rawHash ? `/${rawHash}` : '/');
    const search = window.location.search;
    window.history.replaceState({}, '', `${targetPath}${search}`);
    const resolvedPage = PATH_TO_PAGE_MAP[targetPath] || 'home';
    return resolvedPage;
  }

  // 2. Standard Pathname Resolution
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  return PATH_TO_PAGE_MAP[pathname] || 'home';
}

/**
 * Clean HTML5 History API Navigation
 */
export function navigateToPath(target: string, searchParams?: string): void {
  if (typeof window === 'undefined') return;

  // If passed a page ID, map to clean path; otherwise treat as path
  const cleanPath = PAGE_TO_PATH_MAP[target] || (target.startsWith('/') ? target : `/${target}`);
  const url = searchParams ? `${cleanPath}${searchParams.startsWith('?') ? searchParams : `?${searchParams}`}` : cleanPath;

  if (window.location.pathname !== cleanPath) {
    window.history.pushState({}, '', url);
  }

  // Dispatch custom popstate event so all listeners sync
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
