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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-[#5B4BDB] text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Pay Per Template &bull; No Subscriptions &bull; No Hidden Fees</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          Individual Template Pricing
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          At {BUSINESS.name}, you only pay for the exact template you choose. Free templates are free with no login or payment required. Paid designs require a simple one-time payment via Cashfree when you download. All prices are in Indian Rupees (INR) and the prices shown are the final amount payable. Instant digital delivery via high-resolution PDF and PNG downloads.
        </p>
      </div>

      {/* Pricing Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {priceTiersSummary.map((tier) => (
          <div
            key={tier.price}
            className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-5 ${
              tier.price === '₹0'
                ? 'border-emerald-200 shadow-xs'
                : tier.price === '₹100'
                ? 'border-2 border-[#5B4BDB] shadow-md'
                : 'border-slate-200 shadow-2xs hover:border-slate-300'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {tier.badge}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {tier.count} templates
                </span>
              </div>
              <div>
                <span className="text-3xl font-black text-slate-900">{tier.price}</span>
                <span className="text-xs text-slate-500 ml-1.5">/ template</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{tier.label}</h3>
              <p className="text-xs text-slate-500 leading-relaxed min-h-[36px]">{tier.desc}</p>
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                <strong className="text-slate-800">Designs:</strong> {tier.examples}
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
              className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                tier.price === '₹0'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs shadow-emerald-200'
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs'
              }`}
            >
              <span>{tier.price === '₹0' ? 'Start Free Now' : `Browse ${tier.price} Designs`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Interactive Template Price Browser */}
      <div className="max-w-6xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Explore Template Catalog & Authoritative Prices</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Every template is an individual purchasable product. Review exact prices below.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-white rounded-xl border border-slate-200 p-0.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedFilter === 'all' ? 'bg-[#5B4BDB] text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({templates.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('free')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedFilter === 'free' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Free (₹0)
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('paid')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedFilter === 'paid' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Paid (₹40 - ₹100)
              </button>
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
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
              className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-[#5B4BDB] transition-colors"
            >
              <div className="min-w-0 pr-2">
                <h4 className="text-xs font-bold text-slate-900 truncate">{t.name}</h4>
                <p className="text-[10px] text-slate-500 capitalize">{t.documentType.replace('-', ' ')}</p>
              </div>
              <span
                className={`text-xs font-black px-2.5 py-1 rounded-lg shrink-0 ${
                  t.priceINR === 0
                    ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                    : 'text-violet-800 bg-violet-50 border border-violet-200'
                }`}
              >
                {t.priceINR === 0 ? 'Free' : `₹${t.priceINR}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 text-center">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-900">Are free templates genuinely free?</h4>
            <p className="text-slate-600">
              Yes, 100%. If a template is ₹0, you do not need to enter a mobile number, log in, or pay anything. You can generate and download your high-resolution PDF immediately.
            </p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-900">How do paid templates work?</h4>
            <p className="text-slate-600">
              If you pick a paid design (₹40, ₹50, ₹60, ₹80, or ₹100), you fill in your details, preview the draft, enter your mobile number, and pay the exact amount via Cashfree Checkout.
            </p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-900">Are there recurring subscriptions or plans?</h4>
            <p className="text-slate-600">
              No. We have completely eliminated subscriptions, monthly charges, and bundle passes. You only pay for the individual template you use.
            </p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-900">Which payment methods are supported?</h4>
            <p className="text-slate-600">
              Cashfree supports UPI (Google Pay, PhonePe, Paytm, BHIM), Indian Debit & Credit cards, NetBanking, and popular mobile wallets with instant confirmation.
            </p>
          </div>
        </div>

        {/* Merchant Trust & Policy Summary */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-600 text-xs">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#5B4BDB]" />
            <span>Payments secured by Cashfree &bull; Instant Digital Delivery</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#refund-policy" className="text-indigo-600 hover:underline font-medium">
              Refund & Cancellation Policy
            </a>
            <span>&bull;</span>
            <a href="#shipping-policy" className="text-indigo-600 hover:underline font-medium">
              Shipping & Delivery Policy
            </a>
            <span>&bull;</span>
            <a href="#contact" className="text-indigo-600 hover:underline font-medium">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
