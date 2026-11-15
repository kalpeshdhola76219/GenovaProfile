/**
 * GenovaDoc Cashfree Payment Integration Service
 * Official Cashfree Web Checkout integration:
 * - Server creates all Cashfree orders with strict server-side pricing
 * - Never trusts client-side amount or flags
 * - Official Cashfree JS SDK v3 checkout
 * - Server verification via webhook and authoritative Orders API
 */
import { sessionService } from './sessionService';
import { sanitizeDocumentDataImages } from '../utils/imageCompression';

declare global {
  interface Window {
    Cashfree?: (options: { mode: 'sandbox' | 'production' }) => any;
  }
}

export interface CashfreeConfig {
  success: boolean;
  gateway: 'cashfree';
  isConfigured: boolean;
  environment: 'sandbox' | 'production';
  currency: string;
  prices?: number[];
}

export interface CreateCashfreeOrderParams {
  documentId: string;
  mobile?: string;
  customerMobile?: string;
  email?: string;
  templateId?: string;
  documentTitle?: string;
  documentData?: any;
  consent?: {
    accepted: boolean;
    at: string;
    policyVersion: string;
  };
}

export interface CreateCashfreeOrderResponse {
  success: boolean;
  orderId: string;
  order_id?: string;
  cashfreeOrderId?: string;
  paymentSessionId: string;
  payment_session_id?: string;
  amount: number;
  currency: string;
  environment: 'sandbox' | 'production';
  mobile: string;
  documentId: string;
  documentTitle: string;
  templateId?: string;
  templateName?: string;
  error?: string;
}

export interface LaunchCheckoutResult {
  type: 'error' | 'paid_or_pending' | 'redirect' | 'closed';
  message?: string;
}

export interface VerifyOrderResponse {
  success: boolean;
  isPaid: boolean;
  status?: string;
  orderId?: string;
  receiptId?: string;
  recoveryCode?: string;
  codeShown?: boolean;
  documentId?: string;
  templateId?: string;
  templateName?: string;
  documentStatus?: string;
  amount?: number;
  maskedMobile?: string;
  paidAt?: string;
  downloadUrl?: string;
  error?: string;
  retryAfter?: number;
  canRetry?: boolean;
  reason?: string;
}

export interface RestorePurchaseResult {
  success: boolean;
  restored?: boolean;
  unlocked?: boolean;
  option?: 'A' | 'B';
  documentId?: string;
  templateId?: string;
  title?: string;
  templateName?: string;
  amount?: number;
  message?: string;
  hasEmail?: boolean;
  error?: string;
  expired?: boolean;
  orderId?: string;
  daysRemaining?: number;
  receiptUrl?: string;
  documentData?: any;
  status?: string;
  isPaid?: boolean;
  maskedMobile?: string;
}

let cashfreeSdkPromise: Promise<boolean> | null = null;

/**
 * Loads the official Cashfree JS SDK v3 script once when the customer initiates payment.
 * Resolves when window.Cashfree is available, rejects with an error on failure.
 */
export function loadCashfreeSdk(): Promise<boolean> {
  if (typeof window !== 'undefined' && typeof window.Cashfree === 'function') {
    return Promise.resolve(true);
  }
  if (typeof document === 'undefined') {
    return Promise.reject(new Error('Document environment is not available to load payment library.'));
  }
  if (cashfreeSdkPromise) {
    return cashfreeSdkPromise;
  }

  cashfreeSdkPromise = new Promise<boolean>((resolve, reject) => {
    const existingScript = document.getElementById('cashfree-checkout-js') as HTMLScriptElement | null;
    if (existingScript) {
      if (typeof window.Cashfree === 'function') {
        cashfreeSdkPromise = null;
        return resolve(true);
      }
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'cashfree-checkout-js';
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;

    const timeoutId = setTimeout(() => {
      script.remove();
      cashfreeSdkPromise = null;
      reject(new Error('Payment library failed to load in time. Please check your internet connection and try again.'));
    }, 15000);

    script.onload = () => {
      clearTimeout(timeoutId);
      cashfreeSdkPromise = null;
      if (typeof window.Cashfree === 'function') {
        resolve(true);
      } else {
        reject(new Error('Cashfree payment SDK could not be initialized. Please try again.'));
      }
    };

    script.onerror = () => {
      clearTimeout(timeoutId);
      script.remove();
      cashfreeSdkPromise = null;
      reject(new Error('Unable to connect to Cashfree payment gateway. Please check your internet connection and try again.'));
    };

    document.head.appendChild(script);
  });

  return cashfreeSdkPromise;
}

export const cashfreeService = {
  /**
   * Fetches gateway configuration from the backend.
   */
  getConfig: async (): Promise<CashfreeConfig> => {
    try {
      const res = await fetch('/api/payment/config');
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('[CashfreeService] Failed to fetch config:', err);
    }
    return {
      success: true,
      gateway: 'cashfree',
      isConfigured: false,
      environment: 'sandbox',
      currency: 'INR',
    };
  },

  /**
   * Loads the official Cashfree JS SDK v3 once.
   */
  loadCashfreeSdk,
  loadCashfreeSDK: loadCashfreeSdk,

  /**
   * Creates a Cashfree payment order on the server.
   */
  createOrder: async (params: CreateCashfreeOrderParams): Promise<CreateCashfreeOrderResponse> => {
    const session = sessionService.getSession();
    const safeDocumentData = params.documentData
      ? await sanitizeDocumentDataImages(params.documentData)
      : params.documentData;
    const res = await fetch('/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        documentData: safeDocumentData,
        mobile: params.customerMobile || (params as any).mobile,
        customerMobile: params.customerMobile || (params as any).mobile,
        sessionToken: session.sessionToken,
      }),
    });
    let data: any = null;
    try {
      data = await res.json();
    } catch {
      throw new Error('Payment service returned an invalid response. Please try again.');
    }
    if (!res.ok || !data?.success) {
      throw new Error(data?.error || data?.message || 'Failed to create Cashfree payment order.');
    }
    return data;
  },

  /**
   * Syncs the customer document draft with the server before checkout.
   */
  syncDocument: async (params: {
    id: string;
    templateId: string;
    type?: string;
    title?: string;
    documentData?: any;
  }): Promise<{ success: boolean; documentId?: string }> => {
    const session = sessionService.getSession();
    const normalizedType = (() => {
      const raw = String(params.type || '').toLowerCase().trim();
      if (raw.includes('invit')) return 'invitation';
      if (raw.includes('cover') || raw.includes('letter')) return 'cover-letter';
      if (raw.includes('resume') || raw.includes('cv')) return 'resume';
      return 'biodata';
    })();

    try {
      const safeDocumentData = params.documentData
        ? await sanitizeDocumentDataImages(params.documentData)
        : params.documentData;
      const res = await fetch('/api/documents/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-token': session.sessionToken,
        },
        body: JSON.stringify({
          ...params,
          documentData: safeDocumentData,
          type: normalizedType,
          sessionToken: session.sessionToken,
          guestSessionId: session.id,
        }),
      });
      if (!res.ok) {
        console.warn('[CashfreeService] Document sync response status:', res.status);
      }
      return await res.json().catch(() => ({ success: false }));
    } catch (err) {
      console.warn('[CashfreeService] Document sync error:', err);
      return { success: false };
    }
  },

  /**
   * Launches official Cashfree Web Checkout compact popup modal (redirectTarget: "_modal").
   * Handles checkout promise resolution, result.error, result.paymentDetails, and modal dismissals.
   */
  launchCheckout: async (
    paymentSessionId: string,
    environment?: 'sandbox' | 'production'
  ): Promise<LaunchCheckoutResult> => {
    const cleanSessionId = String(paymentSessionId || '').trim();
    if (!cleanSessionId) {
      throw new Error('Payment session ID was not received from gateway. Please try again.');
    }

    const sdkLoaded = await cashfreeService.loadCashfreeSDK();
    if (!sdkLoaded || typeof window.Cashfree !== 'function') {
      throw new Error('Cashfree Checkout could not be loaded. Please check your internet connection.');
    }

    let mode: 'sandbox' | 'production' =
      environment === 'production' || environment === 'sandbox' ? environment : 'sandbox';
    if (!environment) {
      try {
        const cfg = await cashfreeService.getConfig();
        if (cfg?.environment === 'production' || cfg?.environment === 'sandbox') {
          mode = cfg.environment;
        }
      } catch {
        // Use resolved environment parameter
      }
    }

    const cashfree = window.Cashfree({
      mode,
    });

    try {
      const result = await cashfree.checkout({
        paymentSessionId: cleanSessionId,
        redirectTarget: '_modal',
      });

      if (!result) {
        return { type: 'closed', message: 'Payment popup was closed before completion.' };
      }
      if (result.error) {
        const errMsg =
          result.error.message ||
          result.error.description ||
          result.error.error ||
          'Payment was declined or cancelled.';
        const isClosed =
          errMsg.toLowerCase().includes('close') ||
          errMsg.toLowerCase().includes('dismiss') ||
          errMsg.toLowerCase().includes('drop') ||
          errMsg.toLowerCase().includes('cancel');
        return {
          type: isClosed ? 'closed' : 'error',
          message: errMsg,
        };
      }
      if (result.paymentDetails) {
        return { type: 'paid_or_pending' };
      }
      if (result.redirect) {
        return { type: 'redirect' };
      }
      return { type: 'closed', message: 'Payment popup was closed before completion.' };
    } catch (err: any) {
      const msg = err?.message || '';
      if (
        msg.toLowerCase().includes('close') ||
        msg.toLowerCase().includes('cancel') ||
        msg.toLowerCase().includes('dismiss')
      ) {
        return { type: 'closed', message: 'Payment popup was closed before completion.' };
      }
      return { type: 'error', message: msg || 'Checkout could not be completed.' };
    }
  },

  /**
   * Queries authoritative server to verify if payment was completed.
   */
  verifyOrder: async (orderId: string, signal?: AbortSignal): Promise<VerifyOrderResponse> => {
    const session = sessionService.getSession();
    const res = await fetch(`/api/payment/verify-order/${encodeURIComponent(orderId)}`, {
      headers: {
        'x-session-token': session.sessionToken,
      },
      signal,
    });
    let data: any = null;
    try {
      data = await res.json();
    } catch {
      throw new Error('Payment verification returned an invalid response.');
    }
    const isPaid =
      Boolean(data?.isPaid) || String(data?.status || '').toUpperCase() === 'PAID';
    if (isPaid && data?.documentId && data?.templateId) {
      sessionService.markDocumentPaidLocally(data.documentId, data.templateId);
    }
    return data;
  },

  /**
   * Simulates successful payment for testing in Cashfree Sandbox mode.
   */
  simulateSandboxPayment: async (orderId: string): Promise<VerifyOrderResponse> => {
    const session = sessionService.getSession();
    const res = await fetch('/api/payment/sandbox-complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-token': session.sessionToken,
      },
      body: JSON.stringify({ orderId }),
    });
    let data: any = null;
    try {
      data = await res.json();
    } catch {
      throw new Error('Sandbox simulation returned an invalid response.');
    }
    if (!res.ok || !data?.success) {
      throw new Error(data?.error || 'Sandbox simulation failed.');
    }
    if (data?.isPaid && data?.documentId && data?.templateId) {
      sessionService.markDocumentPaidLocally(data.documentId, data.templateId);
    }
    return data;
  },

  /**
   * Cross-device purchase restore
   */
  restorePurchase: async (params: {
    orderId?: string;
    mobile: string;
    recoveryCode?: string;
  }): Promise<RestorePurchaseResult> => {
    const session = sessionService.getSession();
    const res = await fetch('/api/payment/restore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-token': session.sessionToken,
      },
      body: JSON.stringify({
        ...params,
        sessionToken: session.sessionToken,
      }),
    });
    let data: any = null;
    try {
      data = await res.json();
    } catch {
      throw new Error('Restore service returned an invalid response. Please try again.');
    }
    if (!res.ok && !data?.error) {
      throw new Error('Could not restore purchase. Please verify your details or contact support.');
    }
    if (data?.isPaid && data?.documentId && data?.templateId) {
      sessionService.markDocumentPaidLocally(data.documentId, data.templateId);
    }
    return data;
  },

  /**
   * Fetches full authoritative document data from server
   */
  fetchDocumentData: async (documentId: string): Promise<any> => {
    const session = sessionService.getSession();
    const res = await fetch(`/api/documents/${encodeURIComponent(documentId)}/data`, {
      headers: {
        'x-session-token': session.sessionToken,
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to retrieve document data from server.');
    }
    return await res.json();
  },

  /**
   * Authorizes and initiates document PDF download using x-session-token header
   */
  downloadDocumentPdf: async (documentId: string): Promise<any> => {
    const session = sessionService.getSession();
    const res = await fetch(`/api/documents/${encodeURIComponent(documentId)}/download-pdf`, {
      headers: {
        'x-session-token': session.sessionToken,
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to authorize document PDF download.');
    }
    return await res.json();
  },

  /**
   * Dispatches the final paid document via WhatsApp.
   */
  sendWhatsApp: async (documentId: string): Promise<{ success: boolean; configured: boolean; message: string }> => {
    const session = sessionService.getSession();
    const res = await fetch(`/api/documents/${encodeURIComponent(documentId)}/send-whatsapp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-token': session.sessionToken,
      },
    });
    return await res.json();
  },
};
