/**
 * GenovaProfile Pending Order Storage Service
 * Persists pending orders in localStorage across Razorpay checkout flow.
 */

export interface PendingOrder {
  orderId: string;
  documentId: string;
  templateId: string;
  documentTitle: string;
  amount: number;
  mobile?: string;
  createdAt: number;
  pendingAction?: 'pdf' | 'png' | 'print' | null;
}

const PRIMARY_STORAGE_KEY = 'genovaprofile_pending_order_v1';
const LEGACY_STORAGE_KEY = 'genovadoc_pending_order_v1';

export const pendingOrderService = {
  /**
   * Saves a pending order before launching Razorpay checkout.
   */
  savePendingOrder: (order: PendingOrder): void => {
    if (!order || !order.orderId) return;
    try {
      const serialized = JSON.stringify(order);
      localStorage.setItem(PRIMARY_STORAGE_KEY, serialized);
      localStorage.setItem(LEGACY_STORAGE_KEY, serialized);
    } catch (err) {
      console.warn('[PendingOrderService] Failed to persist pending order:', err);
    }
  },

  /**
   * Retrieves the currently active pending order from localStorage.
   */
  getPendingOrder: (): PendingOrder | null => {
    try {
      const raw = localStorage.getItem(PRIMARY_STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.orderId) {
        return parsed as PendingOrder;
      }
    } catch {}
    return null;
  },

  /**
   * Clears the pending order once verified as paid or abandoned.
   */
  clearPendingOrder: (): void => {
    try {
      localStorage.removeItem(PRIMARY_STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {}
  },
};
