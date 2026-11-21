import { BUSINESS } from './business';

export { BUSINESS };

export const PAID_DOCUMENT_RETENTION_DAYS = 30;

export const BUSINESS_DETAILS = {
  name: BUSINESS.name,
  legalName: BUSINESS.legalName,
  legalOperator: BUSINESS.legalOperator,
  domain: BUSINESS.domain,
  website: BUSINESS.website,
  address: BUSINESS.location, // City, State & PIN only (no house/street address)
  location: BUSINESS.location,
  phone: BUSINESS.phone,
  phoneHoursNote: BUSINESS.phoneHoursNote,
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
