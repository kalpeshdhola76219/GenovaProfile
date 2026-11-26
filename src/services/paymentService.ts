/**
 * GenovaDoc Individual Template Payment Service
 * MODEL: TEMPLATE = PRODUCT
 * Each template is its own purchasable product with its own server-authoritative price: 0 (Free),  40,  50,  60,  80,  100.
 * Free templates (priceINR = 0) require NO payment, NO mobile number, NO login.
 * Paid templates (priceINR > 0) require mobile entry -> order summary -> Razorpay checkout -> verification -> download.
 * NO subscriptions. NO plans. NO bundles. NO global passes.
 */

import { sessionService } from './sessionService';
import {
  getTemplatePriceInfo,
  getTemplatePriceINR,
  isTemplateFree,
  getAllTemplates,
  AuthoritativeTemplate,
} from '../config/templatesCatalog';

export interface PaymentReceipt {
  orderId: string;
  paymentId?: string;
  documentId?: string;
  templateId?: string;
  templateName: string;
  amountINR: number;
  paidAt: string;
  mobile?: string;
}

const PAID_RECEIPTS_STORAGE_KEY = 'genovadoc_paid_receipts_v3';

export const paymentService = {
  /**
   * Returns all purchasable templates with individual pricing.
   */
  getTemplates: (): AuthoritativeTemplate[] => getAllTemplates(),

  /**
   * Retrieves specific template price information.
   */
  getTemplateInfo: (templateId?: string): AuthoritativeTemplate | undefined => {
    return getTemplatePriceInfo(templateId);
  },

  /**
   * Retrieves individual template price in INR.
   */
  getPriceINR: (templateId?: string): number => {
    return getTemplatePriceINR(templateId);
  },

  /**
   * Returns true if template is 100% free ( 0)
   */
  isFree: (templateId?: string): boolean => {
    return isTemplateFree(templateId);
  },

  /**
   * Checks whether a document or template is unlocked for the current customer session.
   */
  isDocumentUnlocked: (documentId?: string, templateId?: string): boolean => {
    if (!documentId || !templateId) return false;
    return sessionService.isDocumentPaidLocally(documentId, templateId);
  },

  /**
   * Unlocks a document for the current session.
   */
  unlockDocument: (documentId: string, templateId?: string): void => {
    if (!documentId) return;
    if (templateId) {
      sessionService.markDocumentPaidLocally(documentId, templateId);
    }
  },

  /**
   * Reads all verified receipts stored locally.
   */
  getReceipts: (): PaymentReceipt[] => {
    try {
      const saved = localStorage.getItem(PAID_RECEIPTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  /**
   * Saves a verified payment receipt to local storage and marks document paid.
   */
  saveVerifiedReceipt: (receipt: PaymentReceipt): void => {
    try {
      const existing = paymentService.getReceipts();
      const updated = [receipt, ...existing.filter((r) => r.orderId !== receipt.orderId)];
      localStorage.setItem(PAID_RECEIPTS_STORAGE_KEY, JSON.stringify(updated));
      if (receipt.documentId && receipt.templateId) {
        sessionService.markDocumentPaidLocally(receipt.documentId, receipt.templateId);
      }
    } catch (e) {
      console.warn('[PaymentService] Error persisting verified receipt:', e);
    }
  },
};
