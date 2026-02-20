"use client";
import { useState } from "react";
import Link from "next/link";
import 'bootstrap-icons/font/bootstrap-icons.css';

const faqs = [
  {
    category: "Orders & Shipping",
    icon: "bi-truck",
    questions: [
      { q: "How long does delivery take?", a: "Delivery within Kigali takes 1–2 business days. Nationwide Rwanda delivery takes 3–5 business days. International shipping varies by destination, typically 7–21 business days." },
      { q: "Do you offer free shipping?", a: "Yes! Orders over 50,000 RWF qualify for free shipping within Rwanda. International shipping fees vary by destination and order weight." },
      { q: "How do I track my order?", a: "Once your order is shipped, you'll receive a confirmation with a tracking number. You can also visit your dashboard under 'My Orders' to see real-time status." },
      { q: "Can I change my delivery address after ordering?", a: "Please contact us within 1 hour of placing your order to change the delivery address. After that, changes may not be possible if the order has already been processed." },
    ],
  },
  {
    category: "Payments",
    icon: "bi-credit-card",
    questions: [
      { q: "What payment methods do you accept?", a: "We accept MTN Mobile Money, Airtel Money, Visa, Mastercard, and Bank Transfer. All payments are processed securely." },
      { q: "Is it safe to pay on BIA?", a: "Yes. All transactions are encrypted and processed through secure payment gateways. We never store your full card details on our servers." },
      { q: "Can I pay in USD or EUR?", a: "Yes, you can switch the currency display in the top bar of our website. Final checkout will show the equivalent amount in your selected currency." },
    ],
  },
  {
    category: "Products & Returns",
    icon: "bi-bag-check",
    questions: [
      { q: "Are all products handmade?", a: "Most products on BIA are handcrafted by African artisans. Each product listing clearly indicates whether it is handmade or manufactured." },
      { q: "What is your return policy?", a: "We accept returns within 7 days of delivery if the item is in its original condition and packaging. Customized or personalized items cannot be returned unless defective. See our Returns page for details." },
      { q: "What if my order arrives damaged?", a: "Please take photos immediately and contact us within 24 hours of delivery. We will arrange a replacement or full refund at no additional cost to you." },
      { q: "Do you offer product customization?", a: "Yes! Many of our artisans offer customization options. Look for the 'Customizable' tag on product listings, or contact us to discuss your specific requirements." },
    ],
  },
  {
    category: "Account & Support",
    icon: "bi-person-circle",
    questions: [
      { q: "How do I create an account?", a: "Click 'Sign In' in the top navigation and then select 'Register'. Fill in your details and you'll receive a confirmation email." },
      { q: "I forgot my password. What do I do?", a: "On the login page, click 'Forgot Password'. Enter your email address and we'll send you a link to reset your password." },
      { q: "How can I become a seller on BIA?", a: "We're always looking for talented African artisans to join our marketplace. Contact us at our Contact Us page with photos of your work and we'll get back to you." },
      { q: "How do I contact customer support?", a: "You can reach us via our Contact Us page, call us at +250 788 282 252, or email info@biafricantouch.com. We're available 24/7." },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 text-orange-300 text-[13px] font-medium px-4 py-1.5 rounded-full mb-5">
            <i className="bi bi-question-circle-fill"></i>
            Help Center
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 leading-tight tracking-tight">
            Frequently{" "}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Asked
            </span>
          </h1>
          <p className="text-gray-300 text-[16px] leading-relaxed">Find quick answers to common questions about orders, payments, returns, and more.</p>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto py-14 px-4">
        <div className="space-y-10">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold text-gray-900 mb-5 border-b border-gray-200 pb-3">
                <i className={`bi ${section.icon} text-orange-500 text-xl`}></i>
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.questions.map((item, i) => {
                  const key = `${section.category}-${i}`;
                  const isOpen = openItems[key];
                  return (
                    <div key={key} className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen ? 'border-orange-200 shadow-sm' : 'border-gray-100'}`}>
                      <button
                        onClick={() => toggle(key)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left text-[14px] font-semibold text-gray-800 hover:text-orange-600 transition-colors"
                      >
                        <span>{item.q}</span>
                        <i className={`bi bi-${isOpen ? 'dash' : 'plus'}-circle-fill text-orange-500 text-lg flex-shrink-0 ml-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-gray-600 text-[13px] leading-relaxed border-t border-orange-100 pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still need help */}
        <div className="mt-14 bg-gradient-to-r from-orange-500 to-amber-400 rounded-3xl p-8 text-white text-center">
          <i className="bi bi-chat-dots-fill text-4xl mb-3 block"></i>
          <h3 className="text-xl font-extrabold mb-2">Still have questions?</h3>
          <p className="text-white/80 text-[14px] mb-5">Our team is available 24/7 to help you.</p>
          <Link href="/contact-us" className="bg-white text-orange-600 font-bold px-6 py-3 rounded-full hover:bg-orange-50 transition-colors inline-flex items-center gap-2">
            <i className="bi bi-envelope-fill"></i> Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
