import catalogJson from './templatesCatalog.json';

export interface AuthoritativeTemplate {
  id: string;
  name: string;
  documentType: 'biodata' | 'resume' | 'cover-letter';
  category?: string;
  priceINR: number;
  currency: 'INR';
  isActive: boolean;
}

export const TEMPLATE_PRICE_REGISTRY: Record<string, AuthoritativeTemplate> = catalogJson as Record<
  string,
  AuthoritativeTemplate
>;

/**
 * Returns the authoritative template configuration with fuzzy prefix support.
 */
export function getTemplatePriceInfo(templateId?: string): AuthoritativeTemplate | undefined {
  if (!templateId) return undefined;
  const trimmed = String(templateId).trim();
  if (!trimmed) return undefined;

  // 1. Exact match
  if (TEMPLATE_PRICE_REGISTRY[trimmed]) return TEMPLATE_PRICE_REGISTRY[trimmed];

  // 2. Common prefixes
  const prefixes = ['resume-', 'marriage-', 'biodata-', 'bio-'];
  for (const prefix of prefixes) {
    if (TEMPLATE_PRICE_REGISTRY[`${prefix}${trimmed}`]) {
      return TEMPLATE_PRICE_REGISTRY[`${prefix}${trimmed}`];
    }
  }

  // 3. Suffix or stripped prefix matching
  const stripped = trimmed.replace(/^(resume|marriage|biodata|bio)-/, '');
  for (const [key, item] of Object.entries(TEMPLATE_PRICE_REGISTRY)) {
    const keyStripped = key.replace(/^(resume|marriage|biodata|bio)-/, '');
    if (keyStripped === stripped || key.endsWith(`-${trimmed}`) || trimmed.endsWith(`-${key}`)) {
      return item;
    }
  }

  return undefined;
}

/**
 * Returns the authoritative price for a given template ID.
 * Returns 0 if not found or if the template is free.
 */
export function getTemplatePriceINR(templateId?: string): number {
  if (!templateId) return 0;
  const item = getTemplatePriceInfo(templateId);
  return item && typeof item.priceINR === 'number' ? item.priceINR : 0;
}

/**
 * Determines whether a template is free.
 */
export function isTemplateFree(templateId?: string): boolean {
  return getTemplatePriceINR(templateId) === 0;
}

/**
 * Returns all active templates with individual pricing.
 */
export function getAllTemplates(): AuthoritativeTemplate[] {
  return Object.values(TEMPLATE_PRICE_REGISTRY).filter((t) => t.isActive);
}
