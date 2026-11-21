import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { BUSINESS } from '../../config/business';

interface ContactPageProps {
  onNavigate?: (page: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderRef: '',
    subject: 'Payment issue',
    message: '',
    honeypot: '', // Hidden honeypot field for anti-bot protection
  });
  const [startedAt, setStartedAt] = useState<number>(Date.now());
  const [loading, setLoading] = useState(false);
  const [ticketRef, setTicketRef] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setStartedAt(Date.now());
  }, []);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Please provide your full name (minimum 2 characters).';
    } else if (formData.name.trim().length > 80) {
      errors.name = 'Name must be 80 characters or fewer.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address so we can reply to you.';
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = 'Please provide details about your inquiry (minimum 10 characters).';
    } else if (formData.message.trim().length > 2000) {
      errors.message = 'Message must be under 2,000 characters.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          orderRef: formData.orderRef.trim() || undefined,
          subject: formData.subject,
          message: formData.message.trim(),
          honeypot: formData.honeypot,
          startedAt,
          fillTimeMs: Date.now() - startedAt,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit message. Please try again.');
      }

      setTicketRef(data.ticketRef || 'GP-T-CONFIRMED');
      setSuccessMessage(data.message || 'Your inquiry has been received. Our team will review it promptly.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error occurred. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      orderRef: '',
      subject: 'Payment issue',
      message: '',
      honeypot: '',
    });
    setTicketRef(null);
    setSuccessMessage(null);
    setErrorMessage(null);
    setFieldErrors({});
    setStartedAt(Date.now());
  };

  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.location.hash = page;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-[#5B4BDB] text-xs font-bold uppercase tracking-wider">
          <Mail className="w-3.5 h-3.5" />
          <span>Customer Support & Inquiries</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          Contact {BUSINESS.name} Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Need assistance with a payment, template question, download, or refund request? Our team is here to help. Every message receives an official ticket reference and human review.
        </p>
      </div>

      {/* Main Grid: Form (Left) & Verified Business Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Real Submission Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          {ticketRef ? (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900">Support Ticket Created</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {successMessage}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-sm mx-auto space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Your Ticket Reference
                </span>
                <span className="font-mono text-lg font-black text-indigo-600 bg-white px-3 py-1 rounded-lg border border-indigo-100 inline-block shadow-2xs">
                  {ticketRef}
                </span>
                <p className="text-[11px] text-slate-500">
                  Please keep this reference for all future correspondence. We review and respond {BUSINESS.replyTime}.
                </p>
              </div>

              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                >
                  Send Another Message
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('home')}
                  className="px-5 py-2.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs" noValidate>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Send Us a Message</h2>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Expected reply time: <strong className="text-slate-700">{BUSINESS.replyTime}</strong>.
                </p>
              </div>

              {/* Bot Honeypot (hidden from human visitors) */}
              <div className="sr-only" aria-hidden="true" style={{ display: 'none' }}>
                <label htmlFor="hp_field">Website / URL</label>
                <input
                  type="text"
                  id="hp_field"
                  name="honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                />
              </div>

              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="text-xs">{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                      fieldErrors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                  {fieldErrors.name && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{fieldErrors.name}</span>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Your Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. rahul.sharma@example.com"
                    className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                      fieldErrors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                  {fieldErrors.email && (
                    <span className="text-[11px] text-rose-600 mt-1 block">{fieldErrors.email}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Order / Receipt ID <span className="text-slate-400 font-normal">(Optional, if regarding a payment)</span>
                </label>
                <input
                  type="text"
                  value={formData.orderRef}
                  onChange={(e) => setFormData({ ...formData, orderRef: e.target.value })}
                  placeholder="e.g. GP-XXXX-XXXX-XXXX or order_..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Topic / Subject <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
                >
                  <option value="Payment issue">Payment issue (Cashfree, UPI, debit / credit card)</option>
                  <option value="Download problem">Download problem (PDF generation or download issue)</option>
                  <option value="Refund request">Refund request (Duplicate payment or delivery failure)</option>
                  <option value="Template question">Template question (Design or format inquiry)</option>
                  <option value="Business enquiry">Business enquiry (Partnership, licensing)</option>
                  <option value="Other">Other general inquiry</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Your Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry in detail. Include any payment transaction ID or error description if applicable..."
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 leading-relaxed ${
                    fieldErrors.message ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  }`}
                />
                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                  <span>Minimum 10 characters</span>
                  <span>{formData.message.length} / 2,000</span>
                </div>
                {fieldErrors.message && (
                  <span className="text-[11px] text-rose-600 mt-1 block">{fieldErrors.message}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xs inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Submitting Support Ticket...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Support Request</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-500 text-center leading-normal">
                Your personal details are used solely to investigate and answer your inquiry. We retain support messages for 12 months for compliance and quality records.
              </p>
            </form>
          )}
        </div>

        {/* Right Column: Business Details & Support Information (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Business Info Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 text-xs">
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
              Support &amp; Business Information
            </h3>
            <div className="space-y-4 text-slate-600">
              <div>
                <strong className="text-slate-900 block font-semibold">Brand Name:</strong>
                <p className="text-slate-800 font-medium">{BUSINESS.name}</p>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Support Email:</strong>
                  <a
                    href={`mailto:${BUSINESS.email}`}
                    className="text-indigo-600 font-medium underline"
                  >
                    {BUSINESS.email}
                  </a>
                </div>
              </div>

              {BUSINESS.phone ? (
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="text-slate-900 block font-semibold">Support Phone / WhatsApp:</strong>
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={BUSINESS.phoneHref}
                        className="text-slate-900 font-semibold hover:text-indigo-600 transition-colors"
                      >
                        {BUSINESS.phone}
                      </a>
                      <a
                        href={BUSINESS.whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1"
                      >
                        <span>WhatsApp</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      WhatsApp &amp; Support Calls: Mon–Sat, 10:00 AM – 6:00 PM IST. For 24/7 assistance, please email{' '}
                      <a href={`mailto:${BUSINESS.email}`} className="text-indigo-600 underline font-medium">
                        {BUSINESS.email}
                      </a>
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Location:</strong>
                  <p className="text-slate-800 font-medium">{BUSINESS.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Support Hours:</strong>
                  <p className="text-slate-700">{BUSINESS.hours}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Expected reply time: {BUSINESS.replyTime}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                <strong className="text-slate-800 block font-semibold">Complaints &amp; Grievances:</strong>
                <p>
                  For complaints write to{' '}
                  <a href={`mailto:${BUSINESS.email}`} className="text-indigo-600 underline font-medium">
                    {BUSINESS.email}
                  </a>
                  ; we reply within 7 days.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Help Links */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-slate-400" /> Quick Reference Links
            </h4>
            <div className="space-y-1.5 text-slate-600 text-[11px]">
              <div>
                <button
                  type="button"
                  onClick={() => handleNavigate('refund-policy')}
                  className="text-indigo-600 hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  Review our Refund & Cancellation Policy &rarr;
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => handleNavigate('shipping-policy')}
                  className="text-indigo-600 hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  Digital Delivery & Instant Access Policy &rarr;
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => handleNavigate('restore')}
                  className="text-indigo-600 hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  Restore a past purchase on a new device &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
