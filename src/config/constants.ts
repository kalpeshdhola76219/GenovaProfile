import { BUSINESS } from './business';

export { BUSINESS };

export const PAID_DOCUMENT_RETENTION_DAYS = 30;

export const BUSINESS_DETAILS = {
  name: BUSINESS.name,
  legalName: BUSINESS.legalName,
  domain: BUSINESS.domain,
  website: BUSINESS.website,
  address: '', // NO postal address anywhere
  phone: BUSINESS.phone, // Empty string by default; never show placeholder
  supportEmail: BUSINESS.email,
  businessHours: BUSINESS.hours,
  expectedReplyTime: BUSINESS.replyTime,
  complaintsReplyTime: BUSINESS.complaintsReplyTime,
  gstin: '', // NO GSTIN
  grievanceOfficer: {
    name: '', // NO named Grievance Officer
    email: BUSINESS.email,
    responseTime: BUSINESS.complaintsReplyTime,
  },
};
