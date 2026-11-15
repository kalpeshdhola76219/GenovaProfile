import crypto from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * GenovaProfile Authoritative Database Layer
 * Backed by Supabase Postgres with zero filesystem persistence.
 */

// One authoritative retention value across the entire application (default: 30 days)
export const PAID_DOCUMENT_RETENTION_DAYS = parseInt(process.env.PAID_DOCUMENT_RETENTION_DAYS || '30', 10);

export interface DbContactMessage {
  id: string; // Ticket reference, e.g. GP-T-XXXXXX
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  orderRef?: string | null;
  status: 'new' | 'in_progress' | 'resolved';
  ipHash?: string;
  createdAt: string;
}

export interface DbGuestSession {
  id: string;
  sessionToken: string;
  mobile?: string;
  createdAt: string;
}

export type ValidDocumentType = 'biodata' | 'resume' | 'cover-letter' | 'invitation';

export function normalizeDocumentType(
  rawType?: string | null,
  templateId?: string | null,
  fallback: ValidDocumentType = 'biodata'
): ValidDocumentType {
  const t = String(rawType || '').toLowerCase().trim();
  if (t === 'biodata' || t === 'resume' || t === 'cover-letter' || t === 'invitation') {
    return t;
  }
  if (t.includes('invit') || t.startsWith('inv-')) {
    return 'invitation';
  }
  if (t.includes('cover') || t.includes('letter')) {
    return 'cover-letter';
  }
  if (t.includes('resume') || t.includes('cv')) {
    return 'resume';
  }
  if (t.includes('biodata') || t.includes('marriage') || t.includes('matrimon')) {
    return 'biodata';
  }
  if (templateId) {
    const tid = String(templateId).toLowerCase().trim();
    if (tid.startsWith('inv-') || tid.includes('invitation')) return 'invitation';
    if (tid.startsWith('coverletter-') || tid.startsWith('cover-') || tid.includes('cover-letter')) return 'cover-letter';
    if (tid.startsWith('resume-') || tid.includes('resume')) return 'resume';
    if (tid.startsWith('biodata-') || tid.startsWith('marriage-') || tid.includes('biodata')) return 'biodata';
  }
  return fallback;
}

export interface DbDocument {
  id: string;
  guestSessionId: string;
  templateId: string;
  type: ValidDocumentType;
  title: string;
  documentData: any;
  status: 'draft' | 'paid' | 'free';
  pdfReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbOrder {
  id: string;
  cashfreeOrderId: string;
  documentId: string;
  guestSessionId: string;
  mobile: string;
  customerEmail?: string;
  receiptId?: string;
  recoveryCodeHash?: string;
  restoreAttempts?: number;
  restoreLockedUntil?: string;
  codeShown?: boolean;
  receiptEmailSent?: boolean;
  amount: number;
  currency: string;
  status: 'created' | 'paid' | 'failed' | 'cancelled';
  templateId?: string;
  documentTitle?: string;
  consent?: {
    accepted: boolean;
    at: string;
    policyVersion: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DbPayment {
  id: string;
  orderId: string;
  cashfreePaymentId: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'USER_DROPPED';
  amount: number;
  paymentMethod?: string;
  paidAt: string;
}

export interface DbWebhookEvent {
  id: string;
  eventId: string;
  orderId?: string;
  eventType: string;
  processed: boolean;
  payload?: any;
  createdAt: string;
}

interface RowGuestSession {
  id: string;
  session_token: string;
  mobile: string | null;
  created_at: string;
}

interface RowDocument {
  id: string;
  guest_session_id: string;
  template_id: string;
  type: 'biodata' | 'resume' | 'cover-letter' | 'invitation';
  title: string;
  document_data: Record<string, unknown>;
  status: 'draft' | 'paid' | 'free';
  pdf_reference: string | null;
  created_at: string;
  updated_at: string;
}

interface RowOrder {
  id: string;
  cashfree_order_id: string;
  document_id: string;
  guest_session_id: string;
  mobile: string;
  customer_email?: string | null;
  recovery_code_hash?: string | null;
  restore_attempts?: number | null;
  restore_locked_until?: string | null;
  code_shown?: boolean | null;
  receipt_email_sent?: boolean | null;
  amount: number;
  currency: string;
  status: 'created' | 'paid' | 'failed' | 'cancelled';
  template_id: string | null;
  document_title: string | null;
  created_at: string;
  updated_at: string;
}

interface RowPayment {
  id: string;
  order_id: string;
  cashfree_payment_id: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'USER_DROPPED';
  amount: number;
  payment_method: string | null;
  paid_at: string;
}

interface RowWebhookEvent {
  id: string;
  event_id: string;
  order_id: string | null;
  event_type: string;
  processed: boolean;
  payload: Record<string, unknown> | null;
  created_at: string;
}

// Mappers from snake_case database rows to camelCase interface objects
function mapGuestSession(row: RowGuestSession): DbGuestSession {
  return {
    id: row.id,
    sessionToken: row.session_token,
    mobile: row.mobile ?? undefined,
    createdAt: row.created_at,
  };
}

function mapDocument(row: RowDocument): DbDocument {
  return {
    id: row.id,
    guestSessionId: row.guest_session_id,
    templateId: row.template_id,
    type: row.type,
    title: row.title,
    documentData: row.document_data,
    status: row.status,
    pdfReference: row.pdf_reference ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// In-memory overlay cache for recovery fields if database schema has not yet applied p0_5.sql
const orderOverlayCache = new Map<string, {
  recoveryCodeHash?: string;
  codeShown?: boolean;
  customerEmail?: string;
  restoreAttempts?: number;
  restoreLockedUntil?: string;
  receiptEmailSent?: boolean;
}>();

function mapOrder(row: RowOrder): DbOrder {
  const overlay = orderOverlayCache.get(row.id) || {};
  return {
    id: row.id,
    cashfreeOrderId: row.cashfree_order_id,
    documentId: row.document_id,
    guestSessionId: row.guest_session_id,
    mobile: row.mobile,
    customerEmail: overlay.customerEmail ?? row.customer_email ?? undefined,
    recoveryCodeHash: overlay.recoveryCodeHash ?? row.recovery_code_hash ?? undefined,
    restoreAttempts: overlay.restoreAttempts ?? row.restore_attempts ?? 0,
    restoreLockedUntil: overlay.restoreLockedUntil ?? row.restore_locked_until ?? undefined,
    codeShown: overlay.codeShown ?? row.code_shown ?? false,
    receiptEmailSent: overlay.receiptEmailSent ?? row.receipt_email_sent ?? false,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    templateId: row.template_id ?? undefined,
    documentTitle: row.document_title ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapPayment(row: RowPayment): DbPayment {
  return {
    id: row.id,
    orderId: row.order_id,
    cashfreePaymentId: row.cashfree_payment_id,
    status: row.status,
    amount: Number(row.amount),
    paymentMethod: row.payment_method ?? undefined,
    paidAt: row.paid_at,
  };
}

function mapWebhookEvent(row: RowWebhookEvent): DbWebhookEvent {
  return {
    id: row.id,
    eventId: row.event_id,
    orderId: row.order_id ?? undefined,
    eventType: row.event_type,
    processed: row.processed,
    payload: row.payload ?? undefined,
    createdAt: row.created_at,
  };
}

export function maskMobile(mobile?: string): string {
  if (!mobile) return '';
  const clean = mobile.replace(/\D/g, '');
  if (clean.length <= 2) return '**';
  return '*'.repeat(clean.length - 2) + clean.slice(-2);
}

// Initialize Supabase Client
export function normalizeSupabaseUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  let url = rawUrl.trim();
  try {
    const parsed = new URL(url);
    if (parsed.hostname.endsWith('.supabase.co')) {
      return parsed.origin;
    }
  } catch {}
  return url.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
}

const rawSupabaseUrl = process.env.SUPABASE_URL || '';
const SUPABASE_URL = normalizeSupabaseUrl(rawSupabaseUrl);
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
const isProd = process.env.NODE_ENV === 'production';

let supabaseClient: SupabaseClient | null = null;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  const errMsg = '[Supabase] SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be provided.';
  if (isProd) {
    console.error(errMsg);
    throw new Error(errMsg);
  } else {
    console.warn(`${errMsg} Running with in-memory development fallback (no disk storage).`);
  }
} else {
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

export interface RateLimitResult {
  allowed: boolean;
  count: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

// Optional In-Memory Storage used strictly in development when Supabase env vars are missing
interface DevMemoryStorage {
  sessions: DbGuestSession[];
  documents: DbDocument[];
  orders: DbOrder[];
  payments: DbPayment[];
  webhookEvents: DbWebhookEvent[];
  contactMessages: DbContactMessage[];
  rateLimits: Map<string, { count: number; resetAt: number }>;
}

const devStorage: DevMemoryStorage = {
  sessions: [],
  documents: [],
  orders: [],
  payments: [],
  webhookEvents: [],
  contactMessages: [],
  rateLimits: new Map(),
};

class DatabaseEngine {
  private client: SupabaseClient | null = supabaseClient;

  public isConfigured(): boolean {
    return Boolean(this.client);
  }

  public async isReachable(): Promise<boolean> {
    if (!this.client) {
      return false;
    }
    try {
      const { error } = await this.client.from('guest_sessions').select('id').limit(1);
      return !error;
    } catch {
      return false;
    }
  }

  // =========================================================================
  // GUEST SESSIONS
  // =========================================================================

  public async createGuestSession(mobile?: string): Promise<DbGuestSession> {
    const id = `sess_${crypto.randomBytes(8).toString('hex')}`;
    const sessionToken = crypto.randomBytes(24).toString('hex');
    const now = new Date().toISOString();

    if (this.client) {
      const { data, error } = await this.client
        .from('guest_sessions')
        .insert({
          id,
          session_token: sessionToken,
          mobile: mobile || null,
          created_at: now,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`[DatabaseEngine] Failed to create guest session: ${error.message}`);
      }
      return mapGuestSession(data as RowGuestSession);
    }

    // In-memory dev fallback
    const session: DbGuestSession = { id, sessionToken, mobile, createdAt: now };
    devStorage.sessions.push(session);
    return session;
  }

  public async getGuestSession(id: string): Promise<DbGuestSession | null> {
    if (this.client) {
      const { data, error } = await this.client
        .from('guest_sessions')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !data) return null;
      return mapGuestSession(data as RowGuestSession);
    }
    return devStorage.sessions.find((s) => s.id === id) || null;
  }

  public async getGuestSessionByToken(token: string): Promise<DbGuestSession | null> {
    if (this.client) {
      const { data, error } = await this.client
        .from('guest_sessions')
        .select('*')
        .eq('session_token', token)
        .maybeSingle();

      if (error || !data) return null;
      return mapGuestSession(data as RowGuestSession);
    }
    return devStorage.sessions.find((s) => s.sessionToken === token) || null;
  }

  public async updateGuestSessionMobile(sessionId: string, mobile: string): Promise<DbGuestSession | null> {
    if (this.client) {
      const { data, error } = await this.client
        .from('guest_sessions')
        .update({ mobile })
        .eq('id', sessionId)
        .select()
        .maybeSingle();

      if (error || !data) return null;
      return mapGuestSession(data as RowGuestSession);
    }
    const item = devStorage.sessions.find((s) => s.id === sessionId);
    if (!item) return null;
    item.mobile = mobile;
    return item;
  }

  // =========================================================================
  // DOCUMENTS
  // =========================================================================

  public async saveDocument(doc: {
    id: string;
    guestSessionId: string;
    templateId: string;
    type?: string;
    title: string;
    documentData: any;
    status?: 'draft' | 'paid' | 'free';
    pdfReference?: string;
  }): Promise<DbDocument> {
    const now = new Date().toISOString();

    if (this.client) {
      const { data: existing } = await this.client
        .from('documents')
        .select('*')
        .eq('id', doc.id)
        .maybeSingle();

      const effectiveType = normalizeDocumentType(
        doc.type,
        doc.templateId,
        existing ? (existing.type as ValidDocumentType) : 'biodata'
      );

      if (existing) {
        const resolvedStatus = existing.status === 'paid' ? 'paid' : (doc.status || existing.status || 'draft');
        const { data, error } = await this.client
          .from('documents')
          .update({
            template_id: doc.templateId,
            type: effectiveType,
            title: doc.title,
            document_data: doc.documentData || {},
            status: resolvedStatus,
            pdf_reference: doc.pdfReference ?? existing.pdf_reference,
            updated_at: now,
          })
          .eq('id', doc.id)
          .select()
          .single();

        if (error) {
          throw new Error(`[DatabaseEngine] Failed to update document: ${error.message}`);
        }
        return mapDocument(data as RowDocument);
      }

      const { data, error } = await this.client
        .from('documents')
        .insert({
          id: doc.id,
          guest_session_id: doc.guestSessionId,
          template_id: doc.templateId,
          type: effectiveType,
          title: doc.title || 'My Document',
          document_data: doc.documentData || {},
          status: doc.status || 'draft',
          pdf_reference: doc.pdfReference ?? null,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`[DatabaseEngine] Failed to insert document: ${error.message}`);
      }
      return mapDocument(data as RowDocument);
    }

    const idx = devStorage.documents.findIndex((d) => d.id === doc.id);
    const existing = idx >= 0 ? devStorage.documents[idx] : undefined;
    const effectiveType = normalizeDocumentType(
      doc.type,
      doc.templateId,
      existing ? existing.type : 'biodata'
    );

    if (existing) {
      const resolvedStatus = existing.status === 'paid' ? 'paid' : (doc.status || existing.status || 'draft');
      const updated: DbDocument = {
        ...existing,
        templateId: doc.templateId,
        type: effectiveType,
        title: doc.title,
        documentData: doc.documentData,
        status: resolvedStatus,
        pdfReference: doc.pdfReference ?? existing.pdfReference,
        updatedAt: now,
      };
      devStorage.documents[idx] = updated;
      return updated;
    }

    const created: DbDocument = {
      id: doc.id,
      guestSessionId: doc.guestSessionId,
      templateId: doc.templateId,
      type: effectiveType,
      title: doc.title || 'My Document',
      documentData: doc.documentData || {},
      status: doc.status || 'draft',
      pdfReference: doc.pdfReference,
      createdAt: now,
      updatedAt: now,
    };
    devStorage.documents.push(created);
    return created;
  }

  public async getDocument(id: string, guestSessionId?: string): Promise<DbDocument | null> {
    if (this.client) {
      let query = this.client.from('documents').select('*').eq('id', id);
      if (guestSessionId) {
        query = query.eq('guest_session_id', guestSessionId);
      }
      const { data, error } = await query.maybeSingle();
      if (error || !data) return null;
      return mapDocument(data as RowDocument);
    }
    const doc = devStorage.documents.find((d) => d.id === id);
    if (!doc) return null;
    if (guestSessionId && doc.guestSessionId !== guestSessionId) return null;
    return doc;
  }

  public async markDocumentPaid(documentId: string, pdfReference?: string): Promise<DbDocument | null> {
    const now = new Date().toISOString();
    if (this.client) {
      const updatePayload: Record<string, unknown> = {
        status: 'paid',
        updated_at: now,
      };
      if (pdfReference) updatePayload.pdf_reference = pdfReference;
      const { data, error } = await this.client
        .from('documents')
        .update(updatePayload)
        .eq('id', documentId)
        .select()
        .maybeSingle();

      if (error || !data) return null;
      return mapDocument(data as RowDocument);
    }
    const doc = devStorage.documents.find((d) => d.id === documentId);
    if (!doc) return null;
    doc.status = 'paid';
    if (pdfReference) doc.pdfReference = pdfReference;
    doc.updatedAt = now;
    return doc;
  }

  // =========================================================================
  // ORDERS
  // =========================================================================

  public async createOrder(order: Omit<DbOrder, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
    id?: string;
    status?: DbOrder['status'];
  }): Promise<DbOrder> {
    const id = order.id || `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const now = new Date().toISOString();
    const status = order.status || 'created';

    if (this.client) {
      const insertPayload: any = {
        id,
        cashfree_order_id: order.cashfreeOrderId,
        document_id: order.documentId,
        guest_session_id: order.guestSessionId,
        mobile: order.mobile,
        amount: Math.round(order.amount),
        currency: order.currency || 'INR',
        status,
        template_id: order.templateId || null,
        document_title: order.documentTitle || null,
        created_at: now,
        updated_at: now,
      };

      if (order.customerEmail) {
        insertPayload.customer_email = order.customerEmail;
      }
      if (order.recoveryCodeHash) {
        insertPayload.recovery_code_hash = order.recoveryCodeHash;
      }
      if (order.consent) {
        insertPayload.consent = order.consent;
      }

      orderOverlayCache.set(id, {
        customerEmail: order.customerEmail,
        recoveryCodeHash: order.recoveryCodeHash,
        codeShown: order.codeShown,
      });

      let { data, error } = await this.client
        .from('orders')
        .insert(insertPayload)
        .select()
        .single();

      if (error && error.message && (error.message.includes('column of \'orders\' in the schema cache') || error.message.includes('schema cache'))) {
        delete insertPayload.customer_email;
        delete insertPayload.recovery_code_hash;
        delete insertPayload.consent;
        const retry = await this.client
          .from('orders')
          .insert(insertPayload)
          .select()
          .single();
        data = retry.data;
        error = retry.error;
      }

      if (error) {
        throw new Error(`[DatabaseEngine] Failed to create order: ${error.message}`);
      }
      return mapOrder(data as RowOrder);
    }

    const record: DbOrder = {
      ...order,
      id,
      status,
      createdAt: now,
      updatedAt: now,
    };
    devStorage.orders.push(record);
    return record;
  }

  public async getOrderById(id: string): Promise<DbOrder | null> {
    if (this.client) {
      const { data, error } = await this.client
        .from('orders')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !data) return null;
      return mapOrder(data as RowOrder);
    }
    return devStorage.orders.find((o) => o.id === id) || null;
  }

  public async getOrderByCashfreeOrderId(cashfreeOrderId: string): Promise<DbOrder | null> {
    if (this.client) {
      const { data, error } = await this.client
        .from('orders')
        .select('*')
        .or(`cashfree_order_id.eq.${cashfreeOrderId},id.eq.${cashfreeOrderId}`)
        .maybeSingle();

      if (error || !data) return null;
      return mapOrder(data as RowOrder);
    }
    return (
      devStorage.orders.find((o) => o.cashfreeOrderId === cashfreeOrderId || o.id === cashfreeOrderId) || null
    );
  }

  public async updateOrderStatus(idOrCfId: string, status: DbOrder['status']): Promise<DbOrder | null> {
    const now = new Date().toISOString();
    if (this.client) {
      const { data, error } = await this.client
        .from('orders')
        .update({ status, updated_at: now })
        .or(`id.eq.${idOrCfId},cashfree_order_id.eq.${idOrCfId}`)
        .select()
        .maybeSingle();

      if (error || !data) return null;
      return mapOrder(data as RowOrder);
    }
    const order = devStorage.orders.find((o) => o.id === idOrCfId || o.cashfreeOrderId === idOrCfId);
    if (!order) return null;
    order.status = status;
    order.updatedAt = now;
    return order;
  }

  public async updateOrderFields(orderId: string, updates: Partial<{
    recoveryCodeHash: string;
    codeShown: boolean;
    customerEmail: string;
    restoreAttempts: number;
    restoreLockedUntil: string | null;
    receiptEmailSent: boolean;
  }>): Promise<DbOrder | null> {
    const now = new Date().toISOString();
    const payload: any = { updated_at: now };
    if (updates.recoveryCodeHash !== undefined) payload.recovery_code_hash = updates.recoveryCodeHash;
    if (updates.codeShown !== undefined) payload.code_shown = updates.codeShown;
    if (updates.customerEmail !== undefined) payload.customer_email = updates.customerEmail;
    if (updates.restoreAttempts !== undefined) payload.restore_attempts = updates.restoreAttempts;
    if (updates.restoreLockedUntil !== undefined) payload.restore_locked_until = updates.restoreLockedUntil;
    if (updates.receiptEmailSent !== undefined) payload.receipt_email_sent = updates.receiptEmailSent;

    const existingOverlay = orderOverlayCache.get(orderId) || {};
    if (updates.recoveryCodeHash !== undefined) existingOverlay.recoveryCodeHash = updates.recoveryCodeHash;
    if (updates.codeShown !== undefined) existingOverlay.codeShown = updates.codeShown;
    if (updates.customerEmail !== undefined) existingOverlay.customerEmail = updates.customerEmail;
    if (updates.restoreAttempts !== undefined) existingOverlay.restoreAttempts = updates.restoreAttempts;
    if (updates.restoreLockedUntil !== undefined) existingOverlay.restoreLockedUntil = updates.restoreLockedUntil || undefined;
    if (updates.receiptEmailSent !== undefined) existingOverlay.receiptEmailSent = updates.receiptEmailSent;
    orderOverlayCache.set(orderId, existingOverlay);

    if (this.client) {
      let { data, error } = await this.client
        .from('orders')
        .update(payload)
        .eq('id', orderId)
        .select()
        .maybeSingle();

      if (error && error.message) {
        const fallback = await this.client
          .from('orders')
          .update({ updated_at: now })
          .eq('id', orderId)
          .select()
          .maybeSingle();
        data = fallback.data;
        error = fallback.error;
      }

      if (error || !data) {
        const fallbackOrder = await this.getOrderById(orderId);
        return fallbackOrder;
      }
      return mapOrder(data as RowOrder);
    }

    const order = devStorage.orders.find((o) => o.id === orderId);
    if (!order) return null;
    if (updates.recoveryCodeHash !== undefined) order.recoveryCodeHash = updates.recoveryCodeHash;
    if (updates.codeShown !== undefined) order.codeShown = updates.codeShown;
    if (updates.customerEmail !== undefined) order.customerEmail = updates.customerEmail;
    if (updates.restoreAttempts !== undefined) order.restoreAttempts = updates.restoreAttempts;
    if (updates.restoreLockedUntil !== undefined) order.restoreLockedUntil = updates.restoreLockedUntil || undefined;
    if (updates.receiptEmailSent !== undefined) order.receiptEmailSent = updates.receiptEmailSent;
    order.updatedAt = now;
    return order;
  }

  public async recordRestoreAttempt(orderId: string): Promise<{ totalAttempts: number; isLocked: boolean; lockedUntil?: string }> {
    const order = await this.getOrderById(orderId);
    if (!order) {
      return { totalAttempts: 1, isLocked: false };
    }
    const newAttempts = (order.restoreAttempts || 0) + 1;
    let lockedUntil: string | null = order.restoreLockedUntil || null;
    if (newAttempts >= 10) {
      lockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      console.warn(`[Restore Security] Order ${orderId.slice(0, 8)}... locked for 24 hours after ${newAttempts} failed attempts.`);
    }
    await this.updateOrderFields(orderId, {
      restoreAttempts: newAttempts,
      restoreLockedUntil: lockedUntil,
    });
    return {
      totalAttempts: newAttempts,
      isLocked: Boolean(lockedUntil && new Date(lockedUntil).getTime() > Date.now()),
      lockedUntil: lockedUntil || undefined,
    };
  }

  // =========================================================================
  // PAYMENTS
  // =========================================================================

  public async recordPayment(payment: Omit<DbPayment, 'id' | 'paidAt'> & { id?: string; paidAt?: string }): Promise<DbPayment> {
    const now = new Date().toISOString();
    const id = payment.id || `pay_${crypto.randomBytes(8).toString('hex')}`;

    if (this.client) {
      const { data, error } = await this.client
        .from('payments')
        .insert({
          id,
          order_id: payment.orderId,
          cashfree_payment_id: payment.cashfreePaymentId,
          status: payment.status,
          amount: payment.amount,
          payment_method: payment.paymentMethod || null,
          paid_at: payment.paidAt || now,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          const { data: existing } = await this.client
            .from('payments')
            .select('*')
            .eq('order_id', payment.orderId)
            .eq('cashfree_payment_id', payment.cashfreePaymentId)
            .maybeSingle();

          if (existing) {
            return mapPayment(existing as RowPayment);
          }
        }
        throw new Error(`[DatabaseEngine] Failed to record payment: ${error.message}`);
      }
      return mapPayment(data as RowPayment);
    }

    const existing = devStorage.payments.find(
      (p) => p.orderId === payment.orderId && p.cashfreePaymentId === payment.cashfreePaymentId
    );
    if (existing) return existing;

    const record: DbPayment = {
      ...payment,
      id,
      paidAt: payment.paidAt || now,
    };
    devStorage.payments.push(record);
    return record;
  }

  public async getPaymentByOrderId(orderId: string): Promise<DbPayment | null> {
    if (this.client) {
      const { data, error } = await this.client
        .from('payments')
        .select('*')
        .eq('order_id', orderId)
        .maybeSingle();

      if (error || !data) return null;
      return mapPayment(data as RowPayment);
    }
    return devStorage.payments.find((p) => p.orderId === orderId) || null;
  }

  // =========================================================================
  // ATOMIC PAYMENT CONFIRMATION
  // =========================================================================

  public async confirmOrderPaid(params: {
    orderId: string;
    cashfreePaymentId: string;
    paidAmount: number;
    paymentMethod?: string;
  }): Promise<{ ok: boolean; alreadyPaid?: boolean; reason?: string }> {
    if (this.client) {
      const { data, error } = await this.client.rpc('confirm_order_paid', {
        p_order_id: params.orderId,
        p_cashfree_payment_id: params.cashfreePaymentId,
        p_paid_amount: params.paidAmount,
        p_payment_method: params.paymentMethod || 'Cashfree PG',
      });

      if (!error && data && typeof data === 'object') {
        return data as { ok: boolean; alreadyPaid?: boolean; reason?: string };
      }

      const order = await this.getOrderById(params.orderId);
      if (!order) {
        return { ok: false, reason: 'order_not_found' };
      }
      if (order.status === 'paid') {
        return { ok: true, alreadyPaid: true };
      }
      if (params.paidAmount < order.amount) {
        return { ok: false, reason: 'amount_mismatch' };
      }

      await this.updateOrderStatus(order.id, 'paid');
      await this.recordPayment({
        orderId: order.id,
        cashfreePaymentId: params.cashfreePaymentId,
        status: 'SUCCESS',
        amount: params.paidAmount,
        paymentMethod: params.paymentMethod || 'Cashfree PG',
      });
      const doc = await this.getDocument(order.documentId);
      if (doc) {
        await this.saveDocument({
          ...doc,
          templateId: order.templateId || doc.templateId,
          status: 'paid',
        });
      }
      return { ok: true, alreadyPaid: false };
    }

    const order = devStorage.orders.find((o) => o.id === params.orderId);
    if (!order) return { ok: false, reason: 'order_not_found' };
    if (order.status === 'paid') return { ok: true, alreadyPaid: true };
    if (params.paidAmount < order.amount) return { ok: false, reason: 'amount_mismatch' };

    order.status = 'paid';
    order.updatedAt = new Date().toISOString();
    await this.recordPayment({
      orderId: order.id,
      cashfreePaymentId: params.cashfreePaymentId,
      status: 'SUCCESS',
      amount: params.paidAmount,
      paymentMethod: params.paymentMethod || 'Cashfree PG',
    });
    const doc = devStorage.documents.find((d) => d.id === order.documentId);
    if (doc) {
      doc.status = 'paid';
      if (order.templateId) doc.templateId = order.templateId;
      doc.updatedAt = new Date().toISOString();
    }
    return { ok: true, alreadyPaid: false };
  }

  public async linkSessionToOrderAndDocument(
    orderId: string,
    documentId: string,
    newSessionId: string
  ): Promise<boolean> {
    const now = new Date().toISOString();
    if (this.client) {
      await Promise.all([
        this.client
          .from('documents')
          .update({ guest_session_id: newSessionId, updated_at: now })
          .eq('id', documentId),
        this.client
          .from('orders')
          .update({ guest_session_id: newSessionId, updated_at: now })
          .eq('id', orderId),
      ]);
      return true;
    }
    const doc = devStorage.documents.find((d) => d.id === documentId);
    if (doc) doc.guestSessionId = newSessionId;
    const ord = devStorage.orders.find((o) => o.id === orderId);
    if (ord) ord.guestSessionId = newSessionId;
    return true;
  }

  // =========================================================================
  // WEBHOOK EVENTS
  // =========================================================================

  public async hasProcessedWebhookEvent(eventId: string): Promise<boolean> {
    if (this.client) {
      const { data, error } = await this.client
        .from('webhook_events')
        .select('event_id')
        .eq('event_id', eventId)
        .maybeSingle();

      return !error && Boolean(data);
    }
    return devStorage.webhookEvents.some((w) => w.eventId === eventId && w.processed);
  }

  public async recordWebhookEvent(
    eventId: string,
    eventType: string,
    orderId?: string,
    payload?: any
  ): Promise<DbWebhookEvent> {
    const id = `wh_${crypto.randomBytes(8).toString('hex')}`;
    const now = new Date().toISOString();

    if (this.client) {
      const { data, error } = await this.client
        .from('webhook_events')
        .insert({
          id,
          event_id: eventId,
          order_id: orderId || null,
          event_type: eventType,
          processed: true,
          payload: payload || null,
          created_at: now,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }
      return mapWebhookEvent(data as RowWebhookEvent);
    }

    if (devStorage.webhookEvents.some((w) => w.eventId === eventId)) {
      const err: any = new Error('Unique violation: event already exists');
      err.code = '23505';
      throw err;
    }

    const record: DbWebhookEvent = {
      id,
      eventId,
      orderId,
      eventType,
      processed: true,
      payload,
      createdAt: now,
    };
    devStorage.webhookEvents.push(record);
    return record;
  }

  public async deleteWebhookEvent(eventId: string): Promise<void> {
    if (this.client) {
      await this.client.from('webhook_events').delete().eq('event_id', eventId);
      return;
    }
    devStorage.webhookEvents = devStorage.webhookEvents.filter((w) => w.eventId !== eventId);
  }

  // =========================================================================
  // AUTHORITATIVE PAID ORDER CHECK
  // =========================================================================

  public async hasPaidOrder(documentId: string, templateId: string, minAmount: number): Promise<boolean> {
    if (this.client) {
      const { data, error } = await this.client
        .from('orders')
        .select('id')
        .eq('status', 'paid')
        .eq('document_id', documentId)
        .eq('template_id', templateId)
        .gte('amount', minAmount)
        .limit(1);

      if (error || !data) return false;
      return data.length > 0;
    }
    return devStorage.orders.some(
      (o) =>
        o.status === 'paid' &&
        o.documentId === documentId &&
        o.templateId === templateId &&
        Number(o.amount) >= Number(minAmount)
    );
  }

  // =========================================================================
  // USER PRIVACY & DATA PURGE (DPDP ACT 2023 COMPLIANCE)
  // =========================================================================

  public async deleteSessionData(sessionId: string): Promise<{ success: boolean; deletedDocuments: number }> {
    if (this.client) {
      const { data: userDocs } = await this.client
        .from('documents')
        .select('id')
        .eq('guest_session_id', sessionId);

      const deletedCount = userDocs ? userDocs.length : 0;

      await this.client
        .from('orders')
        .update({
          mobile: 'deleted',
          document_title: null,
          updated_at: new Date().toISOString(),
        })
        .eq('guest_session_id', sessionId);

      const { error: deleteError } = await this.client
        .from('documents')
        .delete()
        .eq('guest_session_id', sessionId);

      if (deleteError) {
        await this.client
          .from('documents')
          .update({
            document_data: {},
            title: 'Deleted Document',
            pdf_reference: null,
            updated_at: new Date().toISOString(),
          })
          .eq('guest_session_id', sessionId);
      }

      await this.client
        .from('guest_sessions')
        .update({ mobile: null })
        .eq('id', sessionId);

      return { success: true, deletedDocuments: deletedCount };
    }

    const count = devStorage.documents.filter((d) => d.guestSessionId === sessionId).length;
    devStorage.documents = devStorage.documents.filter((d) => d.guestSessionId !== sessionId);
    const session = devStorage.sessions.find((s) => s.id === sessionId);
    if (session) {
      session.mobile = undefined;
    }
    for (const ord of devStorage.orders) {
      if (ord.guestSessionId === sessionId) {
        ord.mobile = 'deleted';
        ord.documentTitle = undefined;
      }
    }
    return { success: true, deletedDocuments: count };
  }

  public async cleanupOldData(draftDays: number = 1): Promise<{ deletedDrafts: number; purgedPaidDocs: number }> {
    const draftCutoffDate = new Date(Date.now() - draftDays * 24 * 60 * 60 * 1000).toISOString();
    const paidCutoffDate = new Date(Date.now() - PAID_DOCUMENT_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();
    const orderPiiCutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    if (this.client) {
      const { data: paidOrders } = await this.client
        .from('orders')
        .select('document_id')
        .eq('status', 'paid');

      const paidDocIds = new Set<string>((paidOrders || []).map((o: any) => o.document_id).filter(Boolean));

      const { data: oldDrafts } = await this.client
        .from('documents')
        .select('id')
        .eq('status', 'draft')
        .lt('created_at', draftCutoffDate);

      let draftCount = 0;
      if (oldDrafts && oldDrafts.length > 0) {
        const eligibleDraftIds = oldDrafts.map((d: any) => d.id).filter((id: string) => !paidDocIds.has(id));
        if (eligibleDraftIds.length > 0) {
          const { error: delErr } = await this.client
            .from('documents')
            .delete()
            .in('id', eligibleDraftIds);

          if (!delErr) {
            draftCount = eligibleDraftIds.length;
          }
        }
      }

      const { data: expiredPaid } = await this.client
        .from('documents')
        .select('id')
        .eq('status', 'paid')
        .lt('updated_at', paidCutoffDate);

      const paidCount = expiredPaid ? expiredPaid.length : 0;
      if (paidCount > 0) {
        await this.client
          .from('documents')
          .update({
            document_data: {},
            pdf_reference: null,
            updated_at: new Date().toISOString(),
          })
          .eq('status', 'paid')
          .lt('updated_at', paidCutoffDate);
      }

      await this.client
        .from('orders')
        .update({
          customer_email: null,
          mobile: 'purged_30d',
          updated_at: new Date().toISOString(),
        })
        .lt('created_at', orderPiiCutoffDate);

      try {
        await this.client.from('rate_limits').delete().lt('reset_at', new Date().toISOString());
      } catch {}

      return { deletedDrafts: draftCount, purgedPaidDocs: paidCount };
    }

    const draftCutoffMs = Date.now() - draftDays * 24 * 60 * 60 * 1000;
    const paidCutoffMs = Date.now() - PAID_DOCUMENT_RETENTION_DAYS * 24 * 60 * 60 * 1000;
    const orderPiiCutoffMs = Date.now() - 30 * 24 * 60 * 60 * 1000;

    const paidDocIds = new Set(
      devStorage.orders
        .filter((o) => o.status === 'paid' && o.documentId)
        .map((o) => o.documentId)
    );

    const initialDrafts = devStorage.documents.filter(
      (d) => d.status === 'draft' && !paidDocIds.has(d.id) && new Date(d.createdAt).getTime() < draftCutoffMs
    ).length;

    devStorage.documents = devStorage.documents.filter(
      (d) => !(d.status === 'draft' && !paidDocIds.has(d.id) && new Date(d.createdAt).getTime() < draftCutoffMs)
    );

    let paidCount = 0;
    for (const d of devStorage.documents) {
      if ((d.status === 'paid' || paidDocIds.has(d.id)) && new Date(d.updatedAt).getTime() < paidCutoffMs) {
        d.documentData = {};
        d.pdfReference = undefined;
        paidCount++;
      }
    }

    for (const ord of devStorage.orders) {
      if (new Date(ord.createdAt).getTime() < orderPiiCutoffMs) {
        ord.customerEmail = undefined;
        ord.mobile = 'purged_30d';
      }
    }

    return { deletedDrafts: initialDrafts, purgedPaidDocs: paidCount };
  }

  // =========================================================================
  // CONTACT MESSAGES (P0-6 Compliance & Support)
  // =========================================================================

  private contactTableAvailable: boolean | null = null;

  public async createContactMessage(msg: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    subject: string;
    message: string;
    orderRef?: string | null;
    ipHash?: string;
  }): Promise<DbContactMessage> {
    const record: DbContactMessage = {
      id: msg.id,
      name: msg.name,
      email: msg.email,
      phone: msg.phone || null,
      subject: msg.subject,
      message: msg.message,
      orderRef: msg.orderRef || null,
      status: 'new',
      ipHash: msg.ipHash,
      createdAt: new Date().toISOString(),
    };

    if (this.client && this.contactTableAvailable !== false) {
      try {
        const insertPayload: Record<string, any> = {
          id: record.id,
          name: record.name,
          email: record.email,
          subject: record.subject,
          message: record.message,
          order_ref: record.orderRef,
          status: record.status,
          ip_hash: record.ipHash,
          created_at: record.createdAt,
        };
        if (record.phone) {
          insertPayload.phone = record.phone;
        }

        const { error } = await this.client.from('contact_messages').insert(insertPayload);
        if (error) {
          this.contactTableAvailable = false;
        } else {
          this.contactTableAvailable = true;
        }
      } catch {
        this.contactTableAvailable = false;
      }
    }

    devStorage.contactMessages.push(record);
    return record;
  }

  public async getContactMessages(): Promise<DbContactMessage[]> {
    if (this.client && this.contactTableAvailable !== false) {
      try {
        const { data, error } = await this.client
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          this.contactTableAvailable = false;
        } else if (data) {
          return data.map((r: any) => ({
            id: r.id,
            name: r.name,
            email: r.email,
            phone: r.phone,
            subject: r.subject,
            message: r.message,
            orderRef: r.order_ref,
            status: r.status,
            ipHash: r.ip_hash,
            createdAt: r.created_at,
          }));
        }
      } catch {
        this.contactTableAvailable = false;
      }
    }

    return [...devStorage.contactMessages];
  }

  // =========================================================================
  // DIAGNOSTIC METRICS
  // =========================================================================

  public async getMetrics() {
    if (this.client) {
      const [sessions, documents, orders, paidOrders, payments, webhookEvents] = await Promise.all([
        this.client.from('guest_sessions').select('*', { count: 'exact', head: true }),
        this.client.from('documents').select('*', { count: 'exact', head: true }),
        this.client.from('orders').select('*', { count: 'exact', head: true }),
        this.client.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'paid'),
        this.client.from('payments').select('*', { count: 'exact', head: true }),
        this.client.from('webhook_events').select('*', { count: 'exact', head: true }),
      ]);
      return {
        sessionsCount: sessions.count || 0,
        documentsCount: documents.count || 0,
        ordersCount: orders.count || 0,
        paidOrdersCount: paidOrders.count || 0,
        paymentsCount: payments.count || 0,
        webhookEventsCount: webhookEvents.count || 0,
      };
    }
    return {
      sessionsCount: devStorage.sessions.length,
      documentsCount: devStorage.documents.length,
      ordersCount: devStorage.orders.length,
      paidOrdersCount: devStorage.orders.filter((o) => o.status === 'paid').length,
      paymentsCount: devStorage.payments.length,
      webhookEventsCount: devStorage.webhookEvents.length,
    };
  }

  private rateLimitsTableAvailable: boolean | null = null;

  private checkMemoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
    const now = Date.now();
    const entry = devStorage.rateLimits.get(key);
    if (!entry || now > entry.resetAt) {
      devStorage.rateLimits.set(key, { count: 1, resetAt: now + windowMs });
      return {
        allowed: true,
        count: 1,
        remaining: Math.max(0, limit - 1),
        resetAt: now + windowMs,
        retryAfterSeconds: 0,
      };
    }

    if (entry.count >= limit) {
      const retryAfter = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
      return {
        allowed: false,
        count: entry.count,
        remaining: 0,
        resetAt: entry.resetAt,
        retryAfterSeconds: retryAfter,
      };
    }

    entry.count += 1;
    return {
      allowed: true,
      count: entry.count,
      remaining: Math.max(0, limit - entry.count),
      resetAt: entry.resetAt,
      retryAfterSeconds: 0,
    };
  }

  /**
   * Distributed Rate Limiter backed by Supabase PostgreSQL rate_limits table.
   * Increments the count atomically and returns allowed or not.
   * Fails closed for payment and restore routes, fails open for the contact form.
   */
  public async checkRateLimit(
    key: string,
    limit: number,
    windowMs: number,
    failOpen?: boolean
  ): Promise<RateLimitResult> {
    const isContactForm = typeof failOpen === 'boolean' ? failOpen : key.startsWith('contact:');
    const now = Date.now();

    // 1. In-memory dev fallback when Supabase is not configured or table not yet created
    if (!this.client || this.rateLimitsTableAvailable === false) {
      return this.checkMemoryRateLimit(key, limit, windowMs);
    }

    // 2. Supabase Atomic Execution: Stored Procedure RPC increment_rate_limit
    try {
      const { data, error } = await this.client.rpc('increment_rate_limit', {
        p_key: key,
        p_limit: limit,
        p_window_ms: windowMs,
      });

      if (!error && Array.isArray(data) && data.length > 0) {
        this.rateLimitsTableAvailable = true;
        const row = data[0];
        const currentCount = Number(row.current_count ?? 1);
        const resetAtMs = new Date(row.reset_at).getTime();
        const retryAfterSeconds = Number(row.retry_after_seconds || 0);
        return {
          allowed: Boolean(row.allowed),
          count: currentCount,
          remaining: Math.max(0, limit - currentCount),
          resetAt: resetAtMs,
          retryAfterSeconds,
        };
      }
    } catch {
      // Fall through to direct table upsert / update fallback
    }

    // 3. Supabase Direct Table Fallback on rate_limits table
    try {
      const { data: existing, error: selectErr } = await this.client
        .from('rate_limits')
        .select('count, reset_at')
        .eq('key', key)
        .maybeSingle();

      if (selectErr) {
        if (
          selectErr.code === '42P01' ||
          selectErr.code === '42501' ||
          selectErr.message?.includes('Could not find the table') ||
          selectErr.message?.includes('relation "rate_limits" does not exist') ||
          selectErr.message?.includes('permission denied')
        ) {
          this.rateLimitsTableAvailable = false;
          return this.checkMemoryRateLimit(key, limit, windowMs);
        }
        console.warn(`[RateLimit] Error querying key ${key}:`, selectErr.message);
        return isContactForm
          ? { allowed: true, count: 0, remaining: limit, resetAt: now + windowMs, retryAfterSeconds: 0 }
          : { allowed: false, count: limit, remaining: 0, resetAt: now + 60000, retryAfterSeconds: 60 };
      }

      this.rateLimitsTableAvailable = true;
      const rowResetAt = existing?.reset_at ? new Date(existing.reset_at).getTime() : 0;

      // Expired window or new key: initialize window
      if (!existing || now > rowResetAt) {
        const newResetIso = new Date(now + windowMs).toISOString();
        const { error: upsertErr } = await this.client
          .from('rate_limits')
          .upsert({
            key,
            count: 1,
            reset_at: newResetIso,
          });

        if (upsertErr) {
          if (
            upsertErr.code === '42P01' ||
            upsertErr.code === '42501' ||
            upsertErr.message?.includes('Could not find the table') ||
            upsertErr.message?.includes('relation "rate_limits" does not exist') ||
            upsertErr.message?.includes('permission denied')
          ) {
            this.rateLimitsTableAvailable = false;
            return this.checkMemoryRateLimit(key, limit, windowMs);
          }
          console.warn(`[RateLimit] Error upserting key ${key}:`, upsertErr.message);
          return isContactForm
            ? { allowed: true, count: 1, remaining: limit - 1, resetAt: now + windowMs, retryAfterSeconds: 0 }
            : { allowed: false, count: limit, remaining: 0, resetAt: now + 60000, retryAfterSeconds: 60 };
        }

        return {
          allowed: true,
          count: 1,
          remaining: Math.max(0, limit - 1),
          resetAt: now + windowMs,
          retryAfterSeconds: 0,
        };
      }

      // Existing window: check limit
      const retryAfter = Math.max(1, Math.ceil((rowResetAt - now) / 1000));
      if (existing.count >= limit) {
        return {
          allowed: false,
          count: existing.count,
          remaining: 0,
          resetAt: rowResetAt,
          retryAfterSeconds: retryAfter,
        };
      }

      // Increment count
      const nextCount = existing.count + 1;
      const { error: updateErr } = await this.client
        .from('rate_limits')
        .update({ count: nextCount })
        .eq('key', key);

      if (updateErr) {
        if (
          updateErr.code === '42P01' ||
          updateErr.code === '42501' ||
          updateErr.message?.includes('Could not find the table') ||
          updateErr.message?.includes('relation "rate_limits" does not exist') ||
          updateErr.message?.includes('permission denied')
        ) {
          this.rateLimitsTableAvailable = false;
          return this.checkMemoryRateLimit(key, limit, windowMs);
        }
        console.warn(`[RateLimit] Error updating key ${key}:`, updateErr.message);
        return isContactForm
          ? { allowed: true, count: nextCount, remaining: Math.max(0, limit - nextCount), resetAt: rowResetAt, retryAfterSeconds: 0 }
          : { allowed: false, count: limit, remaining: 0, resetAt: rowResetAt, retryAfterSeconds: retryAfter };
      }

      return {
        allowed: nextCount <= limit,
        count: nextCount,
        remaining: Math.max(0, limit - nextCount),
        resetAt: rowResetAt,
        retryAfterSeconds: nextCount <= limit ? 0 : retryAfter,
      };
    } catch (err: any) {
      console.warn(`[RateLimit] Unexpected error for key ${key}:`, err?.message || err);
      return isContactForm
        ? { allowed: true, count: 0, remaining: limit, resetAt: now + windowMs, retryAfterSeconds: 0 }
        : { allowed: false, count: limit, remaining: 0, resetAt: now + 60000, retryAfterSeconds: 60 };
    }
  }
}

export const db = new DatabaseEngine();

export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  failOpen?: boolean
): Promise<RateLimitResult> {
  return db.checkRateLimit(key, limit, windowMs, failOpen);
}
