/**
 * Authoritative Business Details Configuration for Genova Profile
 * Single source of truth across all pages, footer, receipts, and emails.
 * Rules:
 * - Business name: Genova Profile
 * - Support email: support@genovaprofile.com
 * - Support hours: Mon-Sat, 10:00-18:00 IST
 * - Reply time: within 1-2 working days
 * - Complaints: reply within 7 days
 * - NO postal address anywhere.
 * - NO business phone number by default (phone: ''). If non-empty, shown; if empty, nothing shown.
 * - NO GSTIN and NO Tax Invoice wording anywhere.
 * - NO named Grievance Officer.
 * - Governing law: India, courts at Surat, Gujarat.
 */
export const BUSINESS = {
  name: 'Genova Profile',
  legalName: 'Genova Profile',
  domain: 'genovaprofile.com',
  website: 'https://genovaprofile.com',
  email: 'support@genovaprofile.com',
  supportEmail: 'support@genovaprofile.com',
  hours: 'Mon-Sat, 10:00-18:00 IST',
  businessHours: 'Mon-Sat, 10:00-18:00 IST',
  phone: '', // When empty, no phone block/placeholder is rendered
  replyTime: 'within 1-2 working days',
  expectedReplyTime: 'within 1-2 working days',
  complaintsReplyTime: 'within 7 days',
  jurisdiction: 'India and courts at Surat, Gujarat',
  governingLaw: 'India and the courts at Surat, Gujarat',
};

export default BUSINESS;
