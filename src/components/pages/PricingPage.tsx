import React, { useState } from 'react';
import { paymentService } from '../../services/paymentService';
import { BUSINESS } from '../../config/business';
import {
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Lock,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface PricingPageProps {
  onStartFree: () => void;
  onBrowseTemplates?: (type?: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onStartFree,
  onBrowseTemplates,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const templates = paymentService.getTemplates();

  const filteredTemplates = templates.filter((t) => {
    if (selectedFilter === 'free' && t.priceINR > 0) return false;
    if (selectedFilter === 'paid' && t.priceINR === 0) return false;
    if (selectedType !== 'all' && t.documentType !== selectedType) return false;
    return true;
  });

  const priceTiersSummary = [
    {
      price: '₹0',
      label: 'Free Starter Designs',
      desc: 'No payment, no mobile number required. Generate and download immediately.',
      badge: 'Genuinely Free',
      examples: 'Classic, Traditional, Minimal basic layouts',
      count: templates.filter((t) => t.priceINR === 0).length,
    },
    {
      price: '₹40',
      label: 'Good-Looking Designs',
      desc: 'Enhanced formatting, clean lines, and polished multi-column sections.',
      badge: 'Popular',
      examples: 'Emerald focus, Mandir classic, Clean corporate',
      count: templates.filter((t) => t.priceINR === 40).length,
    },
    {
      price: '₹50',
      label: 'Modern & Elegant',
      desc: 'Refined color palettes, botanical motifs, and contemporary typography.',
      badge: 'Contemporary',
      examples: 'Modern Teal, Botanical Blossom, Contemporary Profile',
      count: templates.filter((t) => t.priceINR === 50).length,
    },
    {
      price: '₹60',
      label: 'Premium & Executive',
      desc: 'High-impact executive framing, editorial layouts, and champagne tones.',
      badge: 'Professional',
      examples: 'Minimal Editorial, Executive Gold, Champagne Elite',
      count: templates.filter((t) => t.priceINR === 60).length,
    },
    {
      price: '₹80',
      label: 'Luxury & Regal',
      desc: 'Rich velvet textures, gold filigree accents, and ceremonial grandeur.',
      badge: 'Luxury',
      examples: 'Royal Maroon, Imperial Filigree, Regal Velvet',
      count: templates.filter((t) => t.priceINR === 80).length,
    },
    {
      price: '₹100',
      label: 'Exclusive & Royal',
      desc: 'Our finest mastercrafted designs with gold filigree and auspicious blessings.',
      badge: 'Best / Exclusive',
      examples: 'Royal Hindu, Royal Gold Shubh Vivah, Modern Luxury Sovereign',
      count: templates.filter((t) => t.priceINR === 100).length,
    },
  ];

  return (
    <div className="site-shell max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 lg:pb-16 space-y-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <p className="text-xs font-semibold text-brand inline-flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Pay Per Template &middot; No Subscriptions &middot; No Hidden Fees</span>
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy text-balance">
          Individual Template Pricing
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          At {BUSINESS.name}, you only pay for the exact template you choose. Free templates are free with no login or payment required. Paid designs require a simple one-time payment via Razorpay when you download. All prices are in Indian Rupees (INR) and the prices shown are the final amount payable. Instant digital delivery via high-resolution PDF and PNG downloads.
        </p>
      </div>

      {/* Pricing Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {priceTiersSummary.map((tier) => (
          <div
            key={tier.price}
            className={`site-card site-card-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-5 ${
              tier.price === '₹0'
                ? 'border-cover-letter/35'
                : tier.price === '₹100'
                ? 'ring-2 ring-brand/90'
                : 'hover:border-slate-300'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                <span
                  className={
                    tier.price === '₹0'
                      ? 'text-cover-letter'
                      : tier.price === '₹100'
                      ? 'text-brand'
                      : 'text-slate-600'
                  }
                >
                  {tier.badge}
                </span>
                <span className="text-slate-500 tabular-nums">
                  {tier.count} templates
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-navy tracking-tight tabular-nums site-heading">
                  {tier.price}
                </span>
                <span className="text-xs text-slate-500">/ template</span>
              </div>
              <h3 className="font-bold text-navy text-base tracking-tight">{tier.label}</h3>
              <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">{tier.desc}</p>
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                <strong className="text-navy">Designs:</strong> {tier.examples}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (tier.price === '₹0') {
                  onStartFree();
                } else if (onBrowseTemplates) {
                  onBrowseTemplates('all');
                } else {
                  onStartFree();
                }
              }}
              className={`w-full py-3 rounded-2xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98] ${
                tier.price === '₹0'
                  ? 'bg-cover-letter text-white hover:bg-teal-700'
                  : tier.price === '₹100'
                  ? 'bg-brand text-white hover:bg-brand-hover'
                  : 'bg-navy text-white hover:bg-navy/90'
              }`}
            >
              <span>{tier.price === '₹0' ? 'Start Free Now' : `Browse ${tier.price} Designs`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Interactive Template Price Browser */}
      <div className="max-w-6xl mx-auto site-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-navy">
              Explore Template Catalog &amp; Authoritative Prices
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Every template is an individual purchasable product. Review exact prices below.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex bg-slate-100 rounded-2xl border border-slate-200/80 p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedFilter === 'all' ? 'bg-white text-navy font-semibold shadow-2xs' : 'text-slate-600 hover:text-navy'
                }`}
              >
                All ({templates.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('free')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedFilter === 'free' ? 'bg-cover-letter text-white font-semibold shadow-2xs' : 'text-slate-600 hover:text-navy'
                }`}
              >
                Free (₹0)
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('paid')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedFilter === 'paid' ? 'bg-brand text-white font-semibold shadow-2xs' : 'text-slate-600 hover:text-navy'
                }`}
              >
                Paid (₹40 - ₹100)
              </button>
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-surface border border-slate-200 rounded-2xl px-3.5 py-2 text-xs font-semibold text-navy cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="all">All Document Types</option>
              <option value="resume">Professional Resumes</option>
              <option value="cover-letter">Cover Letters</option>
              <option value="biodata">Matrimonial Profiles</option>
            </select>
          </div>
        </div>

        {/* Templates Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredTemplates.map((t) => (
            <div
              key={t.id}
              className="bg-surface/70 p-3.5 rounded-2xl border border-slate-200/80 flex items-center justify-between hover:border-brand/40 hover:bg-white transition-colors"
            >
              <div className="min-w-0 pr-2">
                <h4 className="text-xs font-bold text-navy truncate">{t.name}</h4>
                <p className="text-[11px] text-slate-500 capitalize">{t.documentType.replace('-', ' ')}</p>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-xl shrink-0 tabular-nums border ${
                  t.priceINR === 0
                    ? 'text-cover-letter bg-cover-letter/10 border-cover-letter/20'
                    : 'text-navy bg-white border-slate-200'
                }`}
              >
                {t.priceINR === 0 ? 'Free' : `₹${t.priceINR}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto space-y-5">
        <h3 className="text-lg font-extrabold tracking-tight text-navy text-center">
          Frequently Asked Questions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="site-card p-5 rounded-2xl space-y-1.5">
            <h4 className="font-bold text-navy">Are free templates genuinely free?</h4>
            <p className="text-slate-600 leading-relaxed">
              Yes, 100%. If a template is ₹0, you do not need to enter a mobile number, log in, or pay anything. You can generate and download your high-resolution PDF immediately.
            </p>
          </div>
          <div className="site-card p-5 rounded-2xl space-y-1.5">
            <h4 className="font-bold text-navy">How do paid templates work?</h4>
            <p className="text-slate-600 leading-relaxed">
              If you pick a paid design (₹40, ₹50, ₹60, ₹80, or ₹100), you fill in your details, preview the draft, enter your mobile number, and pay the exact amount via Razorpay Checkout.
            </p>
          </div>
          <div className="site-card p-5 rounded-2xl space-y-1.5">
            <h4 className="font-bold text-navy">Are there recurring subscriptions or plans?</h4>
            <p className="text-slate-600 leading-relaxed">
              No. We have completely eliminated subscriptions, monthly charges, and bundle passes. You only pay for the individual template you use.
            </p>
          </div>
          <div className="site-card p-5 rounded-2xl space-y-1.5">
            <h4 className="font-bold text-navy">Which payment methods are supported?</h4>
            <p className="text-slate-600 leading-relaxed">
              Razorpay supports UPI (Google Pay, PhonePe, Paytm, BHIM), Indian Debit &amp; Credit cards, NetBanking, and popular mobile wallets with instant confirmation.
            </p>
          </div>
        </div>

        {/* Merchant Trust & Policy Summary */}
        <div className="p-4 sm:p-5 bg-white border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-600 text-xs shadow-2xs">
          <div className="flex items-center gap-2 text-navy font-semibold">
            <ShieldCheck className="w-4 h-4 text-brand shrink-0" />
            <span>Payments secured by Razorpay &middot; Instant Digital Delivery</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
            <a href="#refund-policy" className="text-brand hover:underline font-medium">
              Refund &amp; Cancellation Policy
            </a>
            <span className="text-slate-300">&middot;</span>
            <a href="#shipping-policy" className="text-brand hover:underline font-medium">
              Shipping &amp; Delivery Policy
            </a>
            <span className="text-slate-300">&middot;</span>
            <a href="#contact" className="text-brand hover:underline font-medium">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
