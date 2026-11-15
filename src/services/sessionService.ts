/**
 * GenovaDoc Invisible Client Session Manager
 * Provides an anonymous session token and guest ID for document ownership
 * without requiring any customer login or registration.
 */

const SESSION_STORAGE_KEY = 'genovadoc_client_session_v3';
const PAID_DOCS_STORAGE_KEY = 'genovadoc_paid_documents_v3';

export interface ClientSession {
  id: string; // guest session ID (sess_xxxxxx)
  sessionToken: string;
  mobile?: string;
}

export const sessionService = {
  /**
   * Retrieves the current client session from local storage or bootstraps a new one.
   */
  getSession: (): ClientSession => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}

    // Generate fallback client-side session immediately
    const fallback: ClientSession = {
      id: `sess_${Math.random().toString(36).substring(2, 10)}`,
      sessionToken: `tok_${Math.random().toString(36).substring(2, 18)}`,
    };
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(fallback));
    } catch {}
    return fallback;
  },

  getSessionId: (): string => {
    return sessionService.getSession().id;
  },

  getSessionToken: (): string => {
    return sessionService.getSession().sessionToken;
  },

  clearSession: (): void => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(PAID_DOCS_STORAGE_KEY);
    } catch {}
  },

  /**
   * Synchronizes or initializes the session with the backend.
   */
  initBackendSession: async (mobile?: string): Promise<ClientSession> => {
    const current = sessionService.getSession();
    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken: current.sessionToken,
          mobile: mobile || current.mobile,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.session) {
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.session));
          return data.session;
        }
      }
    } catch (err) {
      console.warn('[SessionService] Could not sync session with backend:', err);
    }
    return current;
  },

  /**
   * Saves the customer's mobile number to the local session.
   */
  saveMobile: (mobile: string): void => {
    const current = sessionService.getSession();
    current.mobile = mobile;
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(current));
    } catch {}
    // Background sync with server
    sessionService.initBackendSession(mobile).catch(() => {});
  },

  /**
   * Records a document as paid locally for instant UI responsiveness.
   * Key format: "documentId::templateId" ensures changing templates requires re-payment.
   */
  markDocumentPaidLocally: (documentId: string, templateId: string): void => {
    if (!documentId || !templateId) return;
    const compoundKey = `${documentId}::${templateId}`;
    try {
      const saved = localStorage.getItem(PAID_DOCS_STORAGE_KEY);
      // Migrate old data safely: discard entries without '::' so legacy docIds unlock nothing
      const list: string[] = saved
        ? JSON.parse(saved).filter((item: any) => typeof item === 'string' && item.includes('::'))
        : [];
      if (!list.includes(compoundKey)) {
        list.push(compoundKey);
        localStorage.setItem(PAID_DOCS_STORAGE_KEY, JSON.stringify(list));
      }
    } catch {}
  },

  /**
   * Removes a document::template paid key from local cache when rejected by server.
   */
  removeDocumentPaidLocally: (documentId: string, templateId: string): void => {
    if (!documentId || !templateId) return;
    const compoundKey = `${documentId}::${templateId}`;
    try {
      const saved = localStorage.getItem(PAID_DOCS_STORAGE_KEY);
      if (saved) {
        const list: string[] = JSON.parse(saved).filter((k: string) => k !== compoundKey && k.includes('::'));
        localStorage.setItem(PAID_DOCS_STORAGE_KEY, JSON.stringify(list));
      }
    } catch {}
  },

  /**
   * Checks if a document has been paid in the current session for the specific template.
   */
  isDocumentPaidLocally: (documentId: string, templateId?: string): boolean => {
    if (!documentId || !templateId) return false;
    const compoundKey = `${documentId}::${templateId}`;
    try {
      const saved = localStorage.getItem(PAID_DOCS_STORAGE_KEY);
      if (saved) {
        // Discard any legacy entries that lack '::'
        const list: string[] = JSON.parse(saved).filter((item: any) => typeof item === 'string' && item.includes('::'));
        return list.includes(compoundKey);
      }
    } catch {}
    return false;
  },

  /**
   * Verifies entitlement with the server as the authoritative source of truth.
   * If server rejects, removes local cache flag. If server approves, updates local cache.
   */
  checkEntitlement: async (documentId: string, templateId: string): Promise<boolean> => {
    if (!documentId || !templateId) return false;
    try {
      const session = sessionService.getSession();
      const res = await fetch(
        `/api/documents/${encodeURIComponent(documentId)}/entitlement?templateId=${encodeURIComponent(templateId)}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-session-token': session.sessionToken,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.allowed) {
          sessionService.markDocumentPaidLocally(documentId, templateId);
          return true;
        } else {
          sessionService.removeDocumentPaidLocally(documentId, templateId);
          return false;
        }
      }
    } catch (err) {
      console.warn('[SessionService] Entitlement check error:', err);
    }
    return sessionService.isDocumentPaidLocally(documentId, templateId);
  },
};
