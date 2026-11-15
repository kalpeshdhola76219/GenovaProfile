/**
 * GenovaProfile Customer Profile Service
 * Google Login and Guest Login have been completely removed.
 * All customers use direct document creation without any login requirements.
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobile?: string;
}

export const authService = {
  getCurrentUser: (): UserProfile => {
    return {
      id: 'customer',
      name: 'GenovaProfile Customer',
      email: 'customer@genovaprofile.com',
    };
  },
  listenToAuthState: (_callback: (user: UserProfile | null) => void): (() => void) => {
    return () => {};
  },
  logout: async (): Promise<void> => {},
};
