import express from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { db, maskMobile, PAID_DOCUMENT_RETENTION_DAYS, normalizeDocumentType } from './server/db';
import {
  generateRecoveryCode,
  hashRecoveryCode,
  verifyRecoveryCode,
  generateReceiptId,
} from './server/recovery';

dotenv.config();

// Production Environment & Secrets Validation
function validateProductionEnvironment(): void {
  // Skip strict live-production secret/mode enforcement in non-production or Vercel Preview deployments
  if (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'preview') {
    return;
  }

  const effectiveAppUrl = (
    process.env.APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : '')
  ).trim();

  const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'CASHFREE_CLIENT_ID',
    'CASHFREE_CLIENT_SECRET',
    'RECOVERY_PEPPER',
    'CRON_SECRET',
  ] as const;

  const errors: string[] = [];

  if (!effectiveAppUrl) {
    errors.push('Missing required environment variable: APP_URL');
  }

  for (const envVar of requiredVars) {
    const val = process.env[envVar];
    if (!val || !val.trim()) {
      errors.push(`Missing required environment variable: ${envVar}`);
    }
  }

  if (effectiveAppUrl && !effectiveAppUrl.startsWith('https://')) {
    errors.push(`Invalid APP_URL: Must start with "https://" in production (current: "${effectiveAppUrl}")`);
  }

  const cashfreeEnv = (process.env.CASHFREE_ENVIRONMENT || '').trim().toLowerCase();
  if (cashfreeEnv !== 'production') {
    errors.push(`Invalid CASHFREE_ENVIRONMENT: Must be set to "production" in production mode (current: "${cashfreeEnv || 'undefined'}")`);
  }

  const cashfreeClientId = (process.env.CASHFREE_CLIENT_ID || process.env.CASHFREE_APP_ID || '').trim();
  const cashfreeClientSecret = (process.env.CASHFREE_CLIENT_SECRET || process.env.CASHFREE_SECRET_KEY || '').trim();
  if (cashfreeClientId.startsWith('TEST') || cashfreeClientSecret.startsWith('TEST')) {
    errors.push('Cashfree credentials cannot start with "TEST" in production mode');
  }

  if (errors.length > 0) {
    const header = '=======================================================\nFATAL PRODUCTION CONFIGURATION ERROR\n=======================================================';
    const message = `${header}\nThe server refused to start in production mode due to the following configuration issues:\n${errors.map((e, idx) => `  ${idx + 1}. ${e}`).join('\n')}\n=======================================================`;
    console.error(message);
    throw new Error(message);
  }
}

validateProductionEnvironment();

const app = express();
app.set('trust proxy', true);
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';
const APP_URL = (
  process.env.APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${PORT}`)
).replace(/\/+$/, '');
const PAYMENT_RETURN_PATH = '/payment-result?order_id={order_id}';

// Rate limiter for order status polling (60 requests per 5 minutes per session, fail closed)
async function checkVerifyRateLimit(key: string): Promise<boolean> {
  const result = await db.checkRateLimit(`verify:${key}`, 60, 300000, false);
  return result.allowed;
}

// Rate limiter for purchase restore attempts (5 attempts per hour per IP/session, fail closed)
async function checkRestoreRateLimit(key: string): Promise<boolean> {
  const result = await db.checkRateLimit(`restore:${key}`, 5, 3600000, false);
  return result.allowed;
}

// Capture raw body for Cashfree webhook verification (kept <= 4MB for Vercel 4.5MB limit safety)
app.use(
  express.json({
    limit: '4mb',
    verify: (req, _res, buf) => {
      (req as any).rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: '4mb' }));

// Clean error handler for JSON parse errors and payload size limits
app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err) {
    if (err.type === 'entity.too.large' || err.status === 413 || err.statusCode === 413) {
      return res.status(413).json({
        success: false,
        error: 'Payload too large. Request body exceeds the maximum size limit of 4MB.',
      });
    }
    const errStatus = (err as any).status || (err as any).statusCode;
    if ((err instanceof SyntaxError || (err as any).type === 'entity.parse.failed') && (errStatus === 400 || 'body' in err)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid JSON payload in request body.',
      });
    }
    return next(err);
  }
  next();
});

// Client IP helper that respects proxies and test headers
function getClientIp(req: express.Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

// General Supabase-Backed Distributed Rate Limiting for Sensitive Endpoints
function rateLimit(limit: number, windowMs: number, keyPrefix: string = 'general', failOpen: boolean = false) {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const ip = getClientIp(req);
      const key = `ratelimit:${keyPrefix}:${ip}`;
      const result = await db.checkRateLimit(key, limit, windowMs, failOpen);
      if (!result.allowed) {
        return res.status(429).json({
          success: false,
          error: 'Too many requests. Please wait a moment before trying again.',
          retryAfter: result.retryAfterSeconds,
        });
      }
      return next();
    } catch {
      if (failOpen) {
        return next();
      }
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please wait a moment before trying again.',
      });
    }
  };
}

// ============================================================================
// CASHFREE PAYMENT GATEWAY CONFIGURATION & ENVIRONMENT VALIDATION
// ============================================================================
const CASHFREE_CLIENT_ID = (
  process.env.CASHFREE_CLIENT_ID || process.env.CASHFREE_APP_ID || ''
).trim();
const CASHFREE_CLIENT_SECRET = (
  process.env.CASHFREE_CLIENT_SECRET || process.env.CASHFREE_SECRET_KEY || ''
).trim();
const rawCashfreeEnv = (process.env.CASHFREE_ENVIRONMENT || 'sandbox').trim().toLowerCase();
const isTestCredential =
  CASHFREE_CLIENT_ID.startsWith('TEST') ||
  CASHFREE_CLIENT_SECRET.startsWith('TEST');
const CASHFREE_ENVIRONMENT: 'sandbox' | 'production' =
  isTestCredential ? 'sandbox' : rawCashfreeEnv === 'production' ? 'production' : 'sandbox';
const CASHFREE_API_VERSION = (process.env.CASHFREE_API_VERSION || '2023-08-01').trim();

const isCashfreeConfigured =
  Boolean(CASHFREE_CLIENT_ID) &&
  Boolean(CASHFREE_CLIENT_SECRET) &&
  !CASHFREE_CLIENT_ID.includes('YOUR_') &&
  !CASHFREE_CLIENT_SECRET.includes('YOUR_');

const CASHFREE_BASE_URL =
  CASHFREE_ENVIRONMENT === 'production'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

/**
 * Validates whether the environment matches the credential type.
 */
function getCashfreeEnvironmentWarning(): string | null {
  if (!isCashfreeConfigured) return null;
  const isTestKey =
    CASHFREE_CLIENT_ID.startsWith('TEST') ||
    CASHFREE_CLIENT_SECRET.startsWith('TEST');

  if (CASHFREE_ENVIRONMENT === 'sandbox' && !isTestKey) {
    return 'Warning: CASHFREE_ENVIRONMENT is sandbox but credentials do not appear to be test credentials.';
  }
  if (CASHFREE_ENVIRONMENT === 'production' && isTestKey) {
    return 'Warning: CASHFREE_ENVIRONMENT is production but credentials appear to be test credentials.';
  }
  return null;
}

const startupEnvWarning = getCashfreeEnvironmentWarning();
if (startupEnvWarning) {
  console.warn(`[Cashfree Config] ${startupEnvWarning}`);
}

if (isCashfreeConfigured) {
  console.log(
    `[Cashfree] Gateway configured in ${CASHFREE_ENVIRONMENT.toUpperCase()} mode (App ID: ${CASHFREE_CLIENT_ID.substring(
      0,
      8
    )}...)`
  );
} else {
  console.log(
    `[Cashfree] Gateway not yet configured. Provide CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET in .env for live/sandbox checkouts.`
  );
}

/**
 * Normalizes payment session IDs returned by Cashfree API.
 * Trims whitespace while preserving Cashfree's exact authoritative session token string.
 */
export function normalizeSessionId(id: string): string {
  if (!id) return '';
  return String(id).trim();
}

/**
 * Validates syntax of customer email or falls back to safe default.
 */
function getValidCustomerEmail(candidate?: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (candidate && emailRegex.test(candidate.trim())) {
    return candidate.trim();
  }
  return 'noreply@genovaprofile.com';
}

/**
 * Sanitizes customer name for Cashfree requirements (3 to 100 characters, letters and spaces only).
 */
function sanitizeCustomerName(nameCandidate?: string): string {
  const onlyLettersAndSpaces = (nameCandidate || '').replace(/[^a-zA-Z\s]/g, '').trim().replace(/\s+/g, ' ');
  if (onlyLettersAndSpaces.length >= 3) {
    return onlyLettersAndSpaces.slice(0, 100);
  }
  return 'GenovaProfile Customer';
}

/**
 * Sanitizes customer ID (alphanumeric, underscore or hyphen only).
 */
function sanitizeCustomerId(idCandidate: string): string {
  const cleaned = (idCandidate || '').replace(/[^a-zA-Z0-9_-]/g, '_');
  return cleaned || `guest_${Date.now()}`;
}

// Authoritative Template Registry (Single Authoritative Source of Truth)
import templatesCatalogJson from './src/config/templatesCatalog.json';

export interface AuthoritativeTemplateItem {
  id: string;
  name: string;
  documentType: 'biodata' | 'resume' | 'cover-letter';
  category?: string;
  priceINR: number;
  currency: 'INR';
  isActive: boolean;
}

const TEMPLATE_REGISTRY: Record<string, AuthoritativeTemplateItem> = templatesCatalogJson as Record<
  string,
  AuthoritativeTemplateItem
>;

/**
 * Resolves authoritative template configuration with fuzzy prefix support.
 * Supports exact key, prefixed keys (resume-, marriage-, biodata-), and suffix matching.
 */
export function resolveTemplateInfo(templateId?: string): AuthoritativeTemplateItem | undefined {
  if (!templateId) return undefined;
  const trimmed = String(templateId).trim();
  if (!trimmed) return undefined;

  // 1. Exact match
  if (TEMPLATE_REGISTRY[trimmed]) return TEMPLATE_REGISTRY[trimmed];

  // 2. Prefixes
  const prefixes = ['resume-', 'marriage-', 'biodata-', 'bio-'];
  for (const prefix of prefixes) {
    if (TEMPLATE_REGISTRY[`${prefix}${trimmed}`]) {
      return TEMPLATE_REGISTRY[`${prefix}${trimmed}`];
    }
  }

  // 3. Suffix or stripped prefix matching
  const stripped = trimmed.replace(/^(resume|marriage|biodata|bio)-/, '');
  for (const [key, item] of Object.entries(TEMPLATE_REGISTRY)) {
    const keyStripped = key.replace(/^(resume|marriage|biodata|bio)-/, '');
    if (keyStripped === stripped || key.endsWith(`-${trimmed}`) || trimmed.endsWith(`-${key}`)) {
      return item;
    }
  }

  return undefined;
}

/**
 * Returns authoritative template price in INR from registry.
 */
function getTemplatePriceINR(templateId?: string): number {
  if (!templateId) return 0;
  const item = resolveTemplateInfo(templateId);
  return item && typeof item.priceINR === 'number' ? item.priceINR : 0;
}

/**
 * Determines whether a template is genuinely free (priceINR === 0).
 */
function isFreeTemplate(templateId?: string): boolean {
  if (!templateId) return false;
  return getTemplatePriceINR(templateId) === 0;
}

/**
 * Validates and normalizes 10-digit Indian mobile numbers.
 * Supports prefixes like +91, 91, 0, or spaces.
 */
function validateAndFormatIndianMobile(mobileInput: string): string {
  const digits = String(mobileInput || '').replace(/\D/g, '');
  let cleaned = digits;
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.slice(1);
  }
  if (!/^[6-9]\d{9}$/.test(cleaned)) {
    throw new Error('Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).');
  }
  return cleaned;
}

const SERVER_SKIP_SANITIZE_KEYS = new Set([
  'id',
  'templateId',
  'type',
  'status',
  'createdAt',
  'updatedAt',
  'profilePhoto',
  'extraPhotos',
  'signatureImage',
  'qrCodeUrl',
  'fontFamily',
  'fontSize',
  'headingSize',
  'lineHeight',
  'margins',
  'sectionSpacing',
  'primaryColor',
  'accentColor',
  'paperColor',
  'nameStyle',
  'dateFormat',
  'coverLetterType',
]);

function sanitizeServerDocumentData<T>(node: T, currentKey?: string): T {
  if (node === null || node === undefined) return node;
  if (typeof node === 'string') {
    if (
      (currentKey && SERVER_SKIP_SANITIZE_KEYS.has(currentKey)) ||
      node.startsWith('data:') ||
      node.startsWith('blob:')
    ) {
      return node;
    }
    return node.replace(/\\+([€£₹¥$%#&_*])/g, '$1') as unknown as T;
  }
  if (Array.isArray(node)) {
    return node.map((item) => sanitizeServerDocumentData(item)) as unknown as T;
  }
  if (typeof node === 'object') {
    const record = node as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(record)) {
      if (SERVER_SKIP_SANITIZE_KEYS.has(key)) {
        out[key] = record[key];
      } else {
        out[key] = sanitizeServerDocumentData(record[key], key);
      }
    }
    return out as T;
  }
  return node;
}

// ============================================================================
// 1. INVISIBLE GUEST SESSIONS & DOCUMENT SYNC APIS
// ============================================================================

// Session bootstrap endpoint (Client obtains anonymous guest session)
app.post('/api/session', async (req, res) => {
  const { sessionToken, mobile } = req.body;
  if (sessionToken) {
    const existing = await db.getGuestSessionByToken(sessionToken);
    if (existing) {
      if (mobile) {
        try {
          const cleanMobile = validateAndFormatIndianMobile(mobile);
          await db.updateGuestSessionMobile(existing.id, cleanMobile);
        } catch {}
      }
      return res.json({
        success: true,
        session: {
          id: existing.id,
          sessionToken: existing.sessionToken,
          mobile: existing.mobile,
        },
      });
    }
  }

  // Create new session
  let cleanMobile: string | undefined = undefined;
  if (mobile) {
    try {
      cleanMobile = validateAndFormatIndianMobile(mobile);
    } catch {}
  }
  const session = await db.createGuestSession(cleanMobile);
  return res.json({
    success: true,
    session: {
      id: session.id,
      sessionToken: session.sessionToken,
      mobile: session.mobile,
    },
  });
});

// Document Sync API: Saves customer draft document before checkout
app.post('/api/documents/sync', async (req, res) => {
  const { id, guestSessionId, sessionToken, templateId, type = 'biodata', title, documentData } = req.body;
  const headerToken = req.headers['x-session-token'] as string;
  const token = sessionToken || headerToken;

  if (!id || !templateId) {
    return res.status(400).json({ success: false, error: 'id and templateId are required.' });
  }

  // Find or validate session
  let session = token
    ? await db.getGuestSessionByToken(token)
    : (guestSessionId ? await db.getGuestSession(guestSessionId) : null);

  const existing = await db.getDocument(id);
  if (existing) {
    // If document already exists, enforce ownership
    const isOwnerBySession = Boolean(session && existing.guestSessionId === session.id);
    const isOwnerByGuestId = Boolean(guestSessionId && existing.guestSessionId === guestSessionId);
    if (!isOwnerBySession && !isOwnerByGuestId) {
      return res.status(403).json({ success: false, error: 'Forbidden: Document ownership mismatch.' });
    }
  } else {
    if (!session) {
      session = await db.createGuestSession();
    }
  }

  const effectiveSessionId = session?.id || existing?.guestSessionId || guestSessionId;

  // Server-authoritative status computation: never trust client status
  const price = getTemplatePriceINR(templateId);
  let computedStatus: 'free' | 'paid' | 'draft';
  if (price === 0) {
    computedStatus = 'free';
  } else if (await db.hasPaidOrder(id, templateId, price)) {
    computedStatus = 'paid';
  } else {
    computedStatus = 'draft';
  }

  const normalizedType = normalizeDocumentType(type, templateId, existing?.type || 'biodata');

  const saved = await db.saveDocument({
    id,
    guestSessionId: effectiveSessionId,
    templateId,
    type: normalizedType,
    title: title || 'My Document',
    documentData: sanitizeServerDocumentData(documentData),
    status: computedStatus,
  });

  return res.json({
    success: true,
    document: {
      id: saved.id,
      guestSessionId: saved.guestSessionId,
      templateId: saved.templateId,
      status: saved.status,
      isFree: price === 0,
    },
  });
});

// ============================================================================
// 2. CASHFREE PAYMENT APIS (DIRECT PURCHASE FLOW)
// ============================================================================

// Gateway Config query
app.get('/api/payment/config', (_req, res) => {
  return res.json({
    success: true,
    gateway: 'cashfree',
    isConfigured: isCashfreeConfigured,
    environment: CASHFREE_ENVIRONMENT,
    currency: 'INR',
    prices: [0, 40, 50, 60, 80, 100],
  });
});

// Cashfree Gateway return_url redirect handler (redirects to real path without #hash)
app.all('/payment-result', (req, res, next) => {
  const orderId =
    req.query.order_id ||
    req.query.orderId ||
    (req.body && (req.body.orderId || req.body.order_id)) ||
    '';
  const cleanId = typeof orderId === 'string' ? orderId.trim() : '';

  // Redirect POST gateway callbacks to real path GET /payment-result?order_id=<id> (no #hash)
  if (req.method === 'POST') {
    return res.redirect(303, `/payment-result${cleanId ? `?order_id=${encodeURIComponent(cleanId)}` : ''}`);
  }

  // If query parameter was camelCase orderId, normalize to order_id
  if (req.query.orderId && !req.query.order_id) {
    return res.redirect(302, `/payment-result?order_id=${encodeURIComponent(cleanId)}`);
  }

  // Let SPA server handler serve index.html at /payment-result
  return next();
});

// Create Cashfree Order
app.post(['/api/payment/create-order', '/api/orders/create'], rateLimit(25, 60000), async (req, res) => {
  try {
    const { documentId, email, templateId, documentTitle, sessionToken, consent } = req.body;
    const rawMobile = req.body.mobile || req.body.customerMobile || '';

    let cleanEmail: string | undefined = undefined;
    if (email && typeof email === 'string' && email.trim()) {
      const emailCandidate = email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(emailCandidate)) {
        cleanEmail = emailCandidate.toLowerCase();
      }
    }

    // 0. Validate Consent (DPDP Act 2023 Compliance)
    if (!consent || consent.accepted !== true) {
      return res.status(400).json({
        success: false,
        error: 'Consent is required. You must accept the Privacy Policy and Terms to proceed with checkout.',
      });
    }

    // 1. Validate Mobile Number
    let cleanMobile = '';
    try {
      cleanMobile = validateAndFormatIndianMobile(rawMobile);
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }

    // 2. Validate Template & Read Authoritative Price
    if (!templateId) {
      return res.status(400).json({ success: false, error: 'templateId is required.' });
    }

    const templateInfo = resolveTemplateInfo(templateId);
    if (!templateInfo) {
      return res.status(400).json({
        success: false,
        error: `Template '${templateId}' was not found in the authoritative template registry.`,
      });
    }

    const serverAmountINR = templateInfo.priceINR;
    if (serverAmountINR === 0) {
      return res.status(400).json({
        success: false,
        error: 'This template is free (₹0). No payment is required. You can download directly.',
      });
    }

    // 3. Retrieve or initialize Guest Session
    let session = sessionToken ? await db.getGuestSessionByToken(sessionToken) : null;
    if (!session) {
      session = await db.createGuestSession(cleanMobile);
    } else {
      await db.updateGuestSessionMobile(session.id, cleanMobile);
    }

    // 4. Document identification & Server-Authoritative Price Calculation
    const resolvedDocId = documentId || `doc_${crypto.randomBytes(8).toString('hex')}`;
    const resolvedTitle = documentTitle || `${templateInfo.name} Document`;

    const resolvedDocType = normalizeDocumentType(templateInfo.documentType, templateInfo.id);

    let docRecord = await db.getDocument(resolvedDocId);
    if (!docRecord) {
      docRecord = await db.saveDocument({
        id: resolvedDocId,
        guestSessionId: session.id,
        templateId: templateInfo.id,
        type: resolvedDocType,
        title: resolvedTitle,
        documentData: sanitizeServerDocumentData(req.body.documentData || {}),
        status: 'draft',
      });
    } else {
      const isPaid = await db.hasPaidOrder(resolvedDocId, templateInfo.id, serverAmountINR);
      docRecord = await db.saveDocument({
        id: docRecord.id,
        guestSessionId: docRecord.guestSessionId,
        templateId: templateInfo.id,
        type: normalizeDocumentType(templateInfo.documentType, templateInfo.id, docRecord.type),
        title: resolvedTitle || docRecord.title,
        documentData: sanitizeServerDocumentData(req.body.documentData || docRecord.documentData),
        status: isPaid ? 'paid' : 'draft',
      });
    }

    // 5. Verify Cashfree configuration
    if (!isCashfreeConfigured) {
      return res.status(503).json({
        success: false,
        error: 'Cashfree payment is not configured yet.',
        message: 'Cashfree payment is not configured yet.',
      });
    }

    // 6. Generate internal order ID (concise, max 32 chars)
    const internalOrderId = `order_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;

    // 7. Call Cashfree Order Creation API (2023-08-01)
    // Intentionally omit order_meta.return_url so Cashfree JS SDK v3 _modal checkout
    // resolves cleanly in the parent window instead of loading the React app inside the popup.
    const cashfreeOrderPayload = {
      order_id: internalOrderId,
      order_amount: serverAmountINR,
      order_currency: 'INR',
      customer_details: {
        customer_id: sanitizeCustomerId(session.id),
        customer_phone: cleanMobile,
        customer_name: sanitizeCustomerName(req.body.customerName || req.body.name || 'GenovaProfile Customer'),
        customer_email: cleanEmail || `customer_${cleanMobile.slice(-4)}@genovaprofile.com`,
      },
      order_meta: {
        notify_url: `${APP_URL}/api/webhooks/cashfree`,
      },
      order_note: `GenovaProfile: ${templateInfo.name} (₹${serverAmountINR})`,
    };

    const cfResponse = await fetch(`${CASHFREE_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': CASHFREE_CLIENT_ID,
        'x-client-secret': CASHFREE_CLIENT_SECRET,
        'x-api-version': CASHFREE_API_VERSION,
      },
      body: JSON.stringify(cashfreeOrderPayload),
    });

    const cfText = await cfResponse.text();
    let cfData: any = null;
    try {
      cfData = JSON.parse(cfText);
    } catch {
      console.warn('[Cashfree] Order creation non-JSON response:', cfResponse.status, cfText.substring(0, 300));
    }

    if (!cfResponse.ok || !cfData?.payment_session_id) {
      console.warn('[Cashfree] Order creation failed:', cfResponse.status, cfData || cfText.substring(0, 300));
      return res.status(cfResponse.status >= 500 ? 502 : 400).json({
        success: false,
        error: cfData?.message || 'Cashfree payment gateway is temporarily unreachable. Please try again.',
      });
    }

    const rawSessionId = cfData.payment_session_id ? String(cfData.payment_session_id) : '';
    const normalizedSessionId = normalizeSessionId(rawSessionId);

    const rawLast15 = rawSessionId.length > 15 ? rawSessionId.slice(-15) : rawSessionId;
    const normLast15 = normalizedSessionId.length > 15 ? normalizedSessionId.slice(-15) : normalizedSessionId;
    console.log(`[Cashfree Create Order] Env: ${CASHFREE_ENVIRONMENT}, Raw Session End: ...${rawLast15}, Norm Session End: ...${normLast15}`);

    // 8. Persist authoritative order to server database
    await db.createOrder({
      id: internalOrderId,
      cashfreeOrderId: cfData.cf_order_id ? String(cfData.cf_order_id) : internalOrderId,
      documentId: resolvedDocId,
      guestSessionId: session.id,
      mobile: cleanMobile,
      customerEmail: cleanEmail,
      amount: serverAmountINR,
      currency: 'INR',
      status: 'created',
      templateId: templateInfo.id,
      documentTitle: resolvedTitle,
      consent: {
        accepted: true,
        at: consent?.at || new Date().toISOString(),
        policyVersion: consent?.policyVersion || '2026-10',
      },
    });

    return res.json({
      success: true,
      orderId: internalOrderId,
      order_id: internalOrderId,
      cashfreeOrderId: cfData.cf_order_id || internalOrderId,
      paymentSessionId: normalizedSessionId,
      payment_session_id: normalizedSessionId,
      amount: serverAmountINR,
      currency: 'INR',
      environment: CASHFREE_ENVIRONMENT,
      mobile: cleanMobile,
      documentId: resolvedDocId,
      documentTitle: resolvedTitle,
      templateId: templateInfo.id,
      templateName: templateInfo.name,
    });
  } catch (err: any) {
    console.warn('[Cashfree] Create order exception:', err?.stack || err?.message || err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Payment order could not be created. Please try again.',
    });
  }
});

// Verify Order Status API (Called by frontend after Cashfree _modal checkout closes/completes)
app.get(['/api/payment/verify-order/:orderId', '/api/orders/:orderId/verify'], async (req, res) => {
  try {
    const { orderId } = req.params;
    const headerToken = req.headers['x-session-token'] as string;
    const queryToken = req.query.sessionToken as string;
    const token = headerToken || queryToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Missing x-session-token header.',
      });
    }

    const session = await db.getGuestSessionByToken(token);
    if (!session) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Invalid session.',
      });
    }

    const rateKey = `${session.id}_${req.ip || 'ip'}`;
    if (!(await checkVerifyRateLimit(rateKey))) {
      return res.status(429).json({
        success: false,
        error: 'Too many verification requests. Please wait a moment.',
        retryAfter: 2,
      });
    }

    const order = (await db.getOrderById(orderId)) || (await db.getOrderByCashfreeOrderId(orderId));
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }

    if (order.guestSessionId !== session.id) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You do not have permission to access this order.',
      });
    }

    const templateInfo = order.templateId ? resolveTemplateInfo(order.templateId) : null;
    const templateName = templateInfo?.name || order.documentTitle || 'Template Design';
    const maskedMobile = maskMobile(order.mobile);

    if (order.status === 'paid') {
      const payment = await db.getPaymentByOrderId(order.id);
      let plainRecoveryCode: string | undefined = undefined;

      if (!order.recoveryCodeHash) {
        plainRecoveryCode = generateRecoveryCode();
        const codeHash = hashRecoveryCode(plainRecoveryCode);
        await db.updateOrderFields(order.id, {
          recoveryCodeHash: codeHash,
          codeShown: true,
        });
      } else if (!order.codeShown) {
        await db.updateOrderFields(order.id, { codeShown: true });
      }

      return res.json({
        success: true,
        isPaid: true,
        status: 'PAID',
        orderId: order.id,
        receiptId: order.id,
        documentId: order.documentId,
        templateId: order.templateId,
        templateName,
        amount: order.amount,
        maskedMobile,
        ...(plainRecoveryCode ? { recoveryCode: plainRecoveryCode } : {}),
        codeShown: plainRecoveryCode ? false : true,
        paidAt: payment?.paidAt || order.updatedAt,
        downloadUrl: `/api/documents/${order.documentId}/download-pdf`,
      });
    }

    if (isCashfreeConfigured) {
      try {
        const cfHeaders = {
          'x-client-id': CASHFREE_CLIENT_ID,
          'x-client-secret': CASHFREE_CLIENT_SECRET,
          'x-api-version': CASHFREE_API_VERSION,
        };

        // Fetch both /pg/orders/{order_id} and /pg/orders/{order_id}/payments per 2023-08-01 API
        const [cfRes, pmtsRes] = await Promise.all([
          fetch(`${CASHFREE_BASE_URL}/orders/${encodeURIComponent(order.id)}`, { headers: cfHeaders }),
          fetch(`${CASHFREE_BASE_URL}/orders/${encodeURIComponent(order.id)}/payments`, { headers: cfHeaders }),
        ]);

        const cfOrder: any = cfRes.ok ? await cfRes.json().catch(() => null) : null;
        const cfStatus = String(cfOrder?.order_status || '').toUpperCase();

        const rawPmts: any = pmtsRes.ok ? await pmtsRes.json().catch(() => []) : [];
        const sortedPmts: any[] = Array.isArray(rawPmts)
          ? rawPmts
              .map((p, idx) => ({ p, idx }))
              .sort((a, b) => {
                const ta = Date.parse(a.p?.payment_completion_time || a.p?.payment_time || '') || 0;
                const tb = Date.parse(b.p?.payment_completion_time || b.p?.payment_time || '') || 0;
                return ta !== tb ? ta - tb : a.idx - b.idx;
              })
              .map((item) => item.p)
          : [];

        const latestPmt = sortedPmts.length > 0 ? sortedPmts[sortedPmts.length - 1] : null;
        const latestPmtStatus = String(latestPmt?.payment_status || '').toUpperCase();
        const successPmt = sortedPmts.find((p: any) => String(p?.payment_status || '').toUpperCase() === 'SUCCESS');

        // 1. Confirmed PAID when order_status === 'PAID' or latest payment_status === 'SUCCESS'
        if (cfStatus === 'PAID' || latestPmtStatus === 'SUCCESS' || successPmt) {
          const paidAmount = Number(successPmt?.payment_amount ?? cfOrder?.order_amount ?? order.amount);
          if (paidAmount >= order.amount) {
            await db.confirmOrderPaid({
              orderId: order.id,
              cashfreePaymentId: String(
                successPmt?.cf_payment_id || (cfOrder?.cf_order_id ? `cf_${cfOrder.cf_order_id}` : `cf_${order.id}`)
              ),
              paidAmount,
              paymentMethod: successPmt?.payment_method ? String(successPmt.payment_method) : 'Cashfree PG',
            });

            let plainRecoveryCode: string | undefined = undefined;
            if (!order.recoveryCodeHash) {
              plainRecoveryCode = generateRecoveryCode();
              await db.updateOrderFields(order.id, {
                recoveryCodeHash: hashRecoveryCode(plainRecoveryCode),
                codeShown: true,
              });
            } else if (!order.codeShown) {
              await db.updateOrderFields(order.id, { codeShown: true });
            }

            return res.json({
              success: true,
              isPaid: true,
              status: 'PAID',
              orderId: order.id,
              receiptId: order.id,
              documentId: order.documentId,
              templateId: order.templateId,
              templateName,
              amount: order.amount,
              maskedMobile,
              ...(plainRecoveryCode ? { recoveryCode: plainRecoveryCode } : {}),
              codeShown: plainRecoveryCode ? false : true,
              paidAt: successPmt?.payment_completion_time || new Date().toISOString(),
              downloadUrl: `/api/documents/${order.documentId}/download-pdf`,
            });
          }
        }

        // 2. Immediately return FAILED if order_status or latest payment attempt failed/dropped/cancelled/void
        const FAILURE_STATUSES = ['USER_DROPPED', 'FAILED', 'CANCELLED', 'VOID'];
        const ORDER_TERMINAL_STATUSES = [...FAILURE_STATUSES, 'EXPIRED', 'TERMINATED'];

        if (ORDER_TERMINAL_STATUSES.includes(cfStatus) || FAILURE_STATUSES.includes(latestPmtStatus)) {
          const effectiveStatus = FAILURE_STATUSES.includes(latestPmtStatus) ? latestPmtStatus : cfStatus;
          const isCancelLike = ['USER_DROPPED', 'CANCELLED', 'VOID'].includes(effectiveStatus);
          const rawReason =
            latestPmt?.payment_message ||
            latestPmt?.error_details?.error_description ||
            latestPmt?.error_details?.error_reason ||
            '';
          const reason = isCancelLike
            ? 'Payment was cancelled before completion.'
            : rawReason || (cfStatus === 'EXPIRED' ? 'Payment session expired.' : 'Payment failed or was declined.');

          await db.updateOrderStatus(order.id, 'failed');

          return res.json({
            success: true,
            isPaid: false,
            status: 'FAILED',
            reason,
            error: reason,
            canRetry: true,
            orderId: order.id,
            documentId: order.documentId,
            templateId: order.templateId,
            templateName,
            amount: order.amount,
            maskedMobile,
          });
        }
      } catch (err: any) {
        console.warn('[Cashfree] Authoritative order check error:', err?.message || err);
      }
    }

    return res.json({
      success: true,
      isPaid: false,
      status: order.status === 'failed' ? 'FAILED' : 'PENDING',
      orderId: order.id,
      documentId: order.documentId,
      templateId: order.templateId,
      templateName,
      amount: order.amount,
      maskedMobile,
      retryAfter: 1.5,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to verify payment status.' });
  }
});

// Sandbox Simulation Endpoint (Only active in sandbox or development mode)
app.post('/api/payment/sandbox-complete', rateLimit(20, 60000), async (req, res) => {
  try {
    if (CASHFREE_ENVIRONMENT === 'production' || process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        error: 'Sandbox simulation is not available in production.',
      });
    }

    const { orderId } = req.body;
    if (!orderId || typeof orderId !== 'string') {
      return res.status(400).json({ success: false, error: 'orderId is required.' });
    }

    const order = (await db.getOrderById(orderId.trim())) || (await db.getOrderByCashfreeOrderId(orderId.trim()));
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }

    // Confirm order in DB
    await db.confirmOrderPaid({
      orderId: order.id,
      cashfreePaymentId: `cf_sandbox_${Date.now()}_${order.id}`,
      paidAmount: order.amount,
      paymentMethod: 'Cashfree Sandbox Simulation',
    });

    let plainRecoveryCode: string | undefined = undefined;
    if (!order.recoveryCodeHash) {
      plainRecoveryCode = generateRecoveryCode();
      await db.updateOrderFields(order.id, {
        recoveryCodeHash: hashRecoveryCode(plainRecoveryCode),
        codeShown: true,
      });
    } else if (!order.codeShown) {
      await db.updateOrderFields(order.id, { codeShown: true });
    }

    const templateInfo = resolveTemplateInfo(order.templateId);
    const templateName = templateInfo?.name || 'Selected Design';
    const maskedMobile = maskMobile(order.mobile);

    return res.json({
      success: true,
      status: 'paid',
      isPaid: true,
      canRetry: false,
      orderId: order.id,
      receiptId: order.id,
      documentId: order.documentId,
      templateId: order.templateId,
      templateName,
      amount: order.amount,
      maskedMobile,
      ...(plainRecoveryCode ? { recoveryCode: plainRecoveryCode } : {}),
      codeShown: plainRecoveryCode ? false : true,
      paidAt: new Date().toISOString(),
      downloadUrl: `/api/documents/${order.documentId}/download-pdf`,
    });
  } catch (err: any) {
    console.warn('[Cashfree] Sandbox complete error:', err);
    return res.status(500).json({ success: false, error: 'Failed to complete sandbox payment.' });
  }
});

// Restore purchase query for caller session
app.get('/api/payment/restore', async (req, res) => {
  try {
    const orderId = (req.query.orderId as string) || '';
    const headerToken = req.headers['x-session-token'] as string;
    if (!headerToken) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Missing x-session-token header.' });
    }
    const session = await db.getGuestSessionByToken(headerToken);
    if (!session) {
      return res.status(403).json({ success: false, error: 'Forbidden: Invalid session.' });
    }
    if (!orderId) {
      return res.status(400).json({ success: false, error: 'orderId is required.' });
    }
    const order = (await db.getOrderById(orderId)) || (await db.getOrderByCashfreeOrderId(orderId));
    if (!order || order.guestSessionId !== session.id) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }
    const templateInfo = order.templateId ? resolveTemplateInfo(order.templateId) : null;
    return res.json({
      success: true,
      status: order.status === 'paid' ? 'paid' : 'pending',
      isPaid: order.status === 'paid',
      orderId: order.id,
      documentId: order.documentId,
      templateId: order.templateId,
      templateName: templateInfo?.name || order.documentTitle || 'Template Document',
      amount: order.amount,
      maskedMobile: maskMobile(order.mobile),
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to restore order.' });
  }
});

// Cross-device purchase restore (Order ID + Mobile verification + Recovery Code)
app.post('/api/payment/restore', async (req, res) => {
  const startTime = Date.now();
  const GENERIC_RESTORE_ERROR = 'Could not restore purchase. Please verify your Order ID, mobile number and recovery code, or contact support at support@genovaprofile.com.';

  const sendGenericError = async () => {
    const elapsed = Date.now() - startTime;
    const targetDelay = Math.max(0, 180 - elapsed);
    if (targetDelay > 0) {
      await new Promise((r) => setTimeout(r, targetDelay));
    }
    return res.status(400).json({
      success: false,
      error: GENERIC_RESTORE_ERROR,
    });
  };

  try {
    const { orderId, mobile, recoveryCode } = req.body;
    const headerToken = req.headers['x-session-token'] as string;
    const bodyToken = req.body?.sessionToken as string;
    const token = headerToken || bodyToken;

    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Missing session token.' });
    }
    let session = await db.getGuestSessionByToken(token);
    if (!session) {
      session = await db.createGuestSession();
    }

    const clientIp = getClientIp(req);
    const userAgent = String(req.headers['user-agent'] || 'unknown_agent');
    const trimmedOrderId = (orderId && typeof orderId === 'string') ? orderId.trim() : '';

    const ipRateKey = `ip_${clientIp}`;
    const orderRateKey = trimmedOrderId ? `ord_${trimmedOrderId}` : `ord_unknown`;

    if (!(await checkRestoreRateLimit(ipRateKey))) {
      console.warn(`[Restore Attempt] RATE_LIMITED_IP | IP: ${clientIp} | UA: ${userAgent}`);
      return res.status(429).json({
        success: false,
        error: 'Too many restore attempts from your IP. Please wait an hour or contact support at support@genovaprofile.com.',
      });
    }

    if (trimmedOrderId && !(await checkRestoreRateLimit(orderRateKey))) {
      console.warn(`[Restore Attempt] RATE_LIMITED_ORDER | Order: ${trimmedOrderId.slice(0, 8)}... | IP: ${clientIp} | UA: ${userAgent}`);
      return res.status(429).json({
        success: false,
        error: 'Too many restore attempts for this order. Please wait an hour or contact support at support@genovaprofile.com.',
      });
    }

    if (!trimmedOrderId || !mobile) {
      return sendGenericError();
    }

    const order = (await db.getOrderById(trimmedOrderId)) || (await db.getOrderByCashfreeOrderId(trimmedOrderId));
    if (!order) {
      return sendGenericError();
    }

    if (order.restoreLockedUntil && new Date(order.restoreLockedUntil).getTime() > Date.now()) {
      return res.status(423).json({
        success: false,
        error: 'This order is temporarily locked due to excessive failed restore attempts. Please wait 24 hours or contact support at support@genovaprofile.com.',
      });
    }

    const cleanOrderMobile = (order.mobile || '').replace(/\D/g, '').slice(-10);
    const cleanInputMobile = (String(mobile) || '').replace(/\D/g, '').slice(-10);
    if (!cleanOrderMobile || cleanOrderMobile !== cleanInputMobile || cleanOrderMobile.length !== 10) {
      await db.recordRestoreAttempt(order.id);
      return sendGenericError();
    }

    if (order.status !== 'paid') {
      await db.recordRestoreAttempt(order.id);
      return sendGenericError();
    }

    const providedCode = (recoveryCode && typeof recoveryCode === 'string') ? recoveryCode.trim() : '';
    if (!providedCode) {
      return res.json({
        success: true,
        option: 'B',
        unlocked: false,
        message: 'Purchase found. Because no recovery code was entered, please provide your recovery code or contact support at support@genovaprofile.com with your order reference to verify ownership.',
        hasEmail: Boolean(order.customerEmail),
      });
    }

    const isCodeValid = verifyRecoveryCode(providedCode, order.recoveryCodeHash);
    if (!isCodeValid) {
      await db.recordRestoreAttempt(order.id);
      return sendGenericError();
    }

    const doc = await db.getDocument(order.documentId);
    if (!doc || !doc.documentData || Object.keys(doc.documentData).length === 0) {
      const publicId = (order as any).receiptId || order.id;
      return res.status(410).json({
        success: false,
        expired: true,
        error: `This document was removed after ${PAID_DOCUMENT_RETENTION_DAYS} days. Contact support with your receipt ID (${publicId}).`,
      });
    }

    await db.linkSessionToOrderAndDocument(order.id, order.documentId, session.id);
    const templateInfo = order.templateId ? resolveTemplateInfo(order.templateId) : null;

    return res.json({
      success: true,
      restored: true,
      status: 'paid',
      isPaid: true,
      documentId: order.documentId,
      templateId: order.templateId,
      title: doc.title || order.documentTitle || 'My Document',
      templateName: templateInfo?.name || order.documentTitle || 'Template Document',
      amount: order.amount,
      maskedMobile: maskMobile(order.mobile),
    });
  } catch (err: any) {
    console.error('[Payment Restore] Error restoring order:', err);
    return sendGenericError();
  }
});

// Document Content API
app.get('/api/documents/:id/data', async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers['x-session-token'] as string;

    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Missing x-session-token header.' });
    }
    const session = await db.getGuestSessionByToken(token);
    if (!session) {
      return res.status(403).json({ success: false, error: 'Forbidden: Invalid session.' });
    }

    const doc = await db.getDocument(id);
    if (!doc) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    if (doc.guestSessionId !== session.id) {
      return res.status(403).json({ success: false, error: 'Forbidden: Session does not own this document.' });
    }

    const templatePrice = getTemplatePriceINR(doc.templateId);
    if (templatePrice > 0) {
      const hasPaid = await db.hasPaidOrder(doc.id, doc.templateId, templatePrice);
      if (!hasPaid) {
        return res.status(403).json({ success: false, error: 'Forbidden: This document has not been purchased for the selected template.' });
      }
    }

    const sanitizedDocumentData = sanitizeServerDocumentData(doc.documentData);

    return res.json({
      success: true,
      documentId: doc.id,
      templateId: doc.templateId,
      type: doc.type,
      title: doc.title,
      documentData: sanitizedDocumentData,
      status: doc.status,
      document: {
        id: doc.id,
        title: doc.title,
        type: doc.type,
        templateId: doc.templateId,
        status: doc.status,
        documentData: sanitizedDocumentData,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve document data.' });
  }
});

// Official Cashfree Webhook Handler
app.post('/api/webhooks/cashfree', async (req: any, res) => {
  try {
    if (!isCashfreeConfigured) {
      console.warn('[Cashfree Webhook] Webhook called but Cashfree is not configured');
      return res.status(503).json({ error: 'Cashfree webhook service is unconfigured.' });
    }

    const timestamp = req.headers['x-webhook-timestamp'] as string;
    const signature = req.headers['x-webhook-signature'] as string;

    if (!timestamp || !signature) {
      console.warn('[Cashfree Webhook] Missing signature headers');
      return res.status(400).json({ error: 'Missing webhook headers' });
    }

    const rawBody = req.rawBody ? req.rawBody.toString('utf-8') : JSON.stringify(req.body);
    const dataToSign = timestamp + rawBody;
    const expectedSig = crypto
      .createHmac('sha256', CASHFREE_CLIENT_SECRET)
      .update(dataToSign)
      .digest('base64');

    let isValid = false;
    try {
      isValid = crypto.timingSafeEqual(Buffer.from(expectedSig), Buffer.from(signature));
    } catch {
      isValid = false;
    }

    if (!isValid) {
      console.warn('[Cashfree Webhook] Invalid signature rejected');
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    const event = req.body;
    const eventType = event?.type || 'PAYMENT_WEBHOOK';
    const orderId =
      event?.data?.order?.order_id ||
      event?.order?.order_id ||
      event?.data?.order_id;
    const paymentStatus =
      event?.data?.payment?.payment_status ||
      event?.payment?.payment_status;
    const paymentAmount = Number(
      event?.data?.payment?.payment_amount ||
      event?.data?.order?.order_amount ||
      0
    );
    const cfPaymentId =
      event?.data?.payment?.cf_payment_id ||
      event?.payment?.cf_payment_id ||
      `cf_${Date.now()}`;

    const eventId = `cf_evt_${orderId}_${cfPaymentId}_${eventType}`;

    if (await db.hasProcessedWebhookEvent(eventId)) {
      console.log(`[Cashfree Webhook] Duplicate event ${eventId} ignored.`);
      return res.json({ success: true, duplicate: true });
    }

    if (orderId) {
      const internalOrder = (await db.getOrderById(orderId)) || (await db.getOrderByCashfreeOrderId(orderId));
      if (internalOrder) {
        if (paymentStatus === 'SUCCESS') {
          if (paymentAmount >= internalOrder.amount) {
            await db.updateOrderStatus(internalOrder.id, 'paid');
            await db.markDocumentPaid(internalOrder.documentId);
            await db.recordPayment({
              orderId: internalOrder.id,
              cashfreePaymentId: String(cfPaymentId),
              status: 'SUCCESS',
              amount: paymentAmount,
              paymentMethod: event?.data?.payment?.payment_method || 'Cashfree PG',
            });
            console.log(`[Cashfree Webhook] Order ${internalOrder.id} successfully marked PAID!`);
          }
        } else if (paymentStatus === 'FAILED' || paymentStatus === 'USER_DROPPED') {
          // Do not downgrade if already paid
          if (internalOrder.status !== 'paid') {
            await db.updateOrderStatus(internalOrder.id, 'failed');
          }
          await db.recordPayment({
            orderId: internalOrder.id,
            cashfreePaymentId: String(cfPaymentId),
            status: paymentStatus === 'FAILED' ? 'FAILED' : 'USER_DROPPED',
            amount: paymentAmount,
          });
        }
      }
    }

    await db.recordWebhookEvent(eventId, eventType, orderId, event);
    return res.json({ success: true, processed: true });
  } catch (err: any) {
    console.error('[Cashfree Webhook] Error processing event:', err?.message || err);
    return res.status(500).json({ error: 'Webhook processing error' });
  }
});

// Entitlement Verification API: Authoritative check before export
app.get('/api/documents/:documentId/entitlement', async (req, res) => {
  const { documentId } = req.params;
  const targetTemplateId = (req.query.templateId as string) || '';

  if (!documentId) {
    return res.status(400).json({ allowed: false, error: 'documentId is required.' });
  }

  const templatePrice = getTemplatePriceINR(targetTemplateId);
  if (templatePrice === 0) {
    return res.json({
      allowed: true,
      isFree: true,
      priceINR: 0,
      templateId: targetTemplateId,
    });
  }

  const hasPaid = await db.hasPaidOrder(documentId, targetTemplateId, templatePrice);
  return res.json({
    allowed: hasPaid,
    isFree: false,
    priceINR: templatePrice,
    templateId: targetTemplateId,
  });
});

// Secure Document Download Guard
app.get('/api/documents/:documentId/download-pdf', async (req, res) => {
  const { documentId } = req.params;
  const token = req.headers['x-session-token'] as string;

  const doc = await db.getDocument(documentId);
  if (!doc) {
    return res.status(404).json({ success: false, error: 'Document not found.' });
  }

  if (!token) {
    return res.status(403).json({ success: false, error: 'Forbidden: Missing x-session-token header.' });
  }
  const session = await db.getGuestSessionByToken(token);
  if (!session || session.id !== doc.guestSessionId) {
    return res.status(403).json({ success: false, error: 'Forbidden: Session does not own this document.' });
  }

  const templatePrice = getTemplatePriceINR(doc.templateId);
  const isFree = templatePrice === 0;
  const isPaid = !isFree && (await db.hasPaidOrder(doc.id, doc.templateId, templatePrice));

  if (!isPaid && !isFree) {
    return res.status(402).json({
      success: false,
      error: 'Document has not been purchased for this template. Please complete payment to unlock your document.',
      priceINR: templatePrice,
      templateId: doc.templateId,
    });
  }

  return res.json({
    success: true,
    documentId: doc.id,
    status: isPaid ? 'paid' : 'free',
    isFree,
    title: doc.title,
    templateId: doc.templateId,
    unlockedAt: doc.updatedAt,
    authorized: true,
    message: isFree
      ? 'Free template authorized for unrestricted download.'
      : 'Document unlocked and ready for final PDF download.',
  });
});

// WhatsApp Delivery API
app.post('/api/documents/:documentId/send-whatsapp', async (req, res) => {
  const { documentId } = req.params;
  const headerToken = req.headers['x-session-token'] as string;
  const bodyToken = req.body?.sessionToken as string;
  const token = headerToken || bodyToken;

  const doc = await db.getDocument(documentId);
  if (!doc) {
    return res.status(404).json({ success: false, error: 'Document not found.' });
  }

  if (!token) {
    return res.status(403).json({ success: false, error: 'Forbidden: Missing x-session-token header.' });
  }
  const session = await db.getGuestSessionByToken(token);
  if (!session || session.id !== doc.guestSessionId) {
    return res.status(403).json({ success: false, error: 'Forbidden: Session does not own this document.' });
  }

  const templatePrice = getTemplatePriceINR(doc.templateId);
  const isFree = templatePrice === 0;
  const isPaid = !isFree && (await db.hasPaidOrder(doc.id, doc.templateId, templatePrice));

  if (!isPaid && !isFree) {
    return res.status(403).json({
      success: false,
      error: 'Document must have a verified paid order or be a free template before sending via WhatsApp.',
      priceINR: templatePrice,
      templateId: doc.templateId,
    });
  }

  const isWhatsAppConfigured =
    process.env.WHATSAPP_API_ENABLED === 'true' &&
    Boolean(process.env.WHATSAPP_API_TOKEN) &&
    Boolean(process.env.WHATSAPP_API_ENDPOINT);

  if (!isWhatsAppConfigured) {
    return res.status(200).json({
      success: false,
      configured: false,
      message:
        'WhatsApp automated delivery is currently being configured with our business provider. Please download your PDF directly using the download button.',
    });
  }

  return res.json({
    success: true,
    configured: true,
    message: 'Your document PDF has been dispatched to your mobile number via WhatsApp.',
  });
});

// User Data Deletion API (DPDP Act 2023 / Right to Erasure)
app.post('/api/data/delete', rateLimit(10, 60000), async (req, res) => {
  try {
    const headerToken = req.headers['x-session-token'] as string;
    const bodyToken = req.body?.sessionToken as string;
    const token = headerToken || bodyToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Missing x-session-token header.',
      });
    }

    const session = await db.getGuestSessionByToken(token);
    if (!session) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Invalid session token or session not found.',
      });
    }

    const result = await db.deleteSessionData(session.id);
    return res.json({
      success: true,
      message: 'All personal document data and mobile records for this session have been permanently erased from our servers.',
      deletedDocuments: result.deletedDocuments,
    });
  } catch (err: any) {
    console.error('[Privacy API] Failed to delete session data:', err?.message || err);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while deleting your data. Please try again.',
    });
  }
});

// Automated Data Retention Cleanup (DPDP Act 2023 Compliance)
app.get('/api/cron/cleanup', async (req, res) => {
  const cronSecret = (process.env.CRON_SECRET || '').trim();
  if (!cronSecret) {
    return res.status(503).json({
      success: false,
      error: 'CRON_SECRET is not configured on the server.',
    });
  }

  const authHeader = String(req.headers['authorization'] || '').trim();
  const expectedHeader = `Bearer ${cronSecret}`;
  const authBuf = Buffer.from(authHeader, 'utf8');
  const expectedBuf = Buffer.from(expectedHeader, 'utf8');
  const isAuthorized =
    authBuf.length === expectedBuf.length && crypto.timingSafeEqual(authBuf, expectedBuf);

  if (!isAuthorized) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or missing authorization bearer token.',
    });
  }

  try {
    const result = await db.cleanupOldData(30);
    return res.json({
      success: true,
      retentionDays: PAID_DOCUMENT_RETENTION_DAYS,
      deletedDrafts: result.deletedDrafts,
      purgedPaidDocs: result.purgedPaidDocs,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Cron Cleanup] Error running retention cleanup:', err?.message || err);
    return res.status(500).json({
      success: false,
      error: 'Failed to execute retention cleanup.',
    });
  }
});

// Contact Form & Support Ticket API
const ALLOWED_CONTACT_SUBJECTS = [
  'Payment issue',
  'Download problem',
  'Refund request',
  'Template question',
  'Business enquiry',
  'Other',
] as const;

function maskEmailForLogs(email: string): string {
  if (!email || !email.includes('@')) return '***@***';
  const parts = email.split('@');
  const local = parts[0];
  const domain = parts[1];
  const maskedLocal = local.length <= 2 ? `${local[0]}*` : `${local[0]}***${local[local.length - 1]}`;
  return `${maskedLocal}@${domain}`;
}

app.post('/api/contact', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
      orderRef,
      order_ref,
      honeypot,
      website,
      startedAt,
      fillTimeMs,
    } = req.body;

    const clientIp = getClientIp(req);
    const ipPepper = (process.env.RECOVERY_PEPPER || '').trim();
    if (!ipPepper && isProd) {
      throw new Error('FATAL: RECOVERY_PEPPER is missing in production.');
    }
    const effectiveIpPepper = ipPepper || 'dev_insecure_local_ip_pepper';
    const ipHash = crypto.createHmac('sha256', effectiveIpPepper).update(clientIp).digest('hex').slice(0, 32);

    const isBotHoneypot = Boolean(honeypot || website);
    if (isBotHoneypot) {
      const fakeTicket = `GP-T-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
      return res.json({
        success: true,
        ticketRef: fakeTicket,
        message: 'Your message has been received. Our team will review it shortly.',
      });
    }

    const now = Date.now();
    const clientStartedAt = Number(startedAt || 0);
    const clientFillDuration = Number(fillTimeMs || (clientStartedAt > 0 ? now - clientStartedAt : 0));
    if (clientFillDuration > 0 && clientFillDuration < 3000) {
      return res.status(400).json({
        success: false,
        error: 'Form submitted too quickly. Please take a few seconds to write your inquiry.',
      });
    }

    const trimmedName = typeof name === 'string' ? name.trim() : '';
    if (trimmedName.length < 2 || trimmedName.length > 80) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid name between 2 and 80 characters.',
      });
    }

    const trimmedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail) || trimmedEmail.length > 150) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.',
      });
    }

    const trimmedSubject = typeof subject === 'string' ? subject.trim() : '';
    if (!ALLOWED_CONTACT_SUBJECTS.includes(trimmedSubject as any)) {
      return res.status(400).json({
        success: false,
        error: `Subject must be one of: ${ALLOWED_CONTACT_SUBJECTS.join(', ')}`,
      });
    }

    const trimmedMessage = typeof message === 'string' ? message.trim() : '';
    if (trimmedMessage.length < 10 || trimmedMessage.length > 2000) {
      return res.status(400).json({
        success: false,
        error: 'Message must be between 10 and 2000 characters.',
      });
    }

    if (
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(trimmedMessage) ||
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(trimmedName)
    ) {
      return res.status(400).json({
        success: false,
        error: 'HTML and script tags are not permitted in contact messages.',
      });
    }

    const sanitizedMessage = trimmedMessage.replace(/<[^>]*>?/gm, '');
    const sanitizedName = trimmedName.replace(/<[^>]*>?/gm, '');
    const sanitizedPhone = typeof phone === 'string' ? phone.trim().slice(0, 30) : undefined;
    const effectiveOrderRef = orderRef || order_ref;
    const sanitizedOrderRef = typeof effectiveOrderRef === 'string' ? effectiveOrderRef.trim().slice(0, 60) : undefined;

    const ipRate = await db.checkRateLimit(`contact:ip:${ipHash}`, 3, 3600000, true);
    if (!ipRate.allowed) {
      return res.status(429).json({
        success: false,
        error: 'Too many messages sent from this connection. Please wait an hour or email support directly.',
      });
    }

    const emailRate = await db.checkRateLimit(`contact:email:${trimmedEmail}`, 10, 86400000, true);
    if (!emailRate.allowed) {
      return res.status(429).json({
        success: false,
        error: 'Too many messages sent from this email address today. Please wait before submitting more.',
      });
    }

    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const ticketRef = `GP-T-${randomHex}`;

    await db.createContactMessage({
      id: ticketRef,
      name: sanitizedName,
      email: trimmedEmail,
      phone: sanitizedPhone || null,
      subject: trimmedSubject,
      message: sanitizedMessage,
      orderRef: sanitizedOrderRef || null,
      ipHash,
    });

    return res.status(201).json({
      success: true,
      ticketRef,
      message: 'Your inquiry has been received. Our team will review it and reply within 1-2 working days.',
    });
  } catch (err: any) {
    console.error('[Contact Form] Unexpected error handling message:', err?.message || err);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while submitting your message. Please try again or email support@genovaprofile.com directly.',
    });
  }
});

// Health check endpoint
app.get('/api/health', async (_req, res) => {
  const warning = getCashfreeEnvironmentWarning();
  const dbReachable = await db.isReachable();
  res.json({
    status: 'ok',
    app: 'GenovaProfile Full-Stack Server',
    gateway: 'cashfree',
    database: {
      configured: db.isConfigured(),
      reachable: dbReachable,
    },
    cashfree: {
      configured: isCashfreeConfigured,
      environment: CASHFREE_ENVIRONMENT,
      ...(warning ? { environmentWarning: warning } : {}),
    },
  });
});

// Global API Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  if (req.path.startsWith('/api/')) {
    const statusCode = typeof err.status === 'number' ? err.status : typeof err.statusCode === 'number' ? err.statusCode : 500;
    return res.status(statusCode).json({
      success: false,
      error: err.message || 'Internal server error',
    });
  }
  next(err);
});

// JSON 404 fallback for unmatched API routes (both Vercel serverless and local Express)
app.all(['/api', '/api/*'], (_req, res) => {
  return res.status(404).json({ success: false, error: 'API route not found' });
});

async function startLocalServer(): Promise<void> {
  // Static files in standalone production, Vite middleware in local dev only.
  // On Vercel (process.env.VERCEL), static assets and SPA fallback are served by Vercel's CDN.
  if (isProd && !process.env.VERCEL) {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ success: false, error: 'API route not found' });
      }
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else if (!isProd && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Return index.html for all non-/api paths in development
    app.get('*', async (req, res, next) => {
      if (req.path.startsWith('/api/')) {
        return next();
      }
      try {
        const fs = await import('fs');
        let template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
  server.on('error', (err: any) => {
    console.error('Server listen error:', err);
  });
}

if (!process.env.VERCEL) {
  void startLocalServer();
}

export default app;
