import Link from "next/link";
import 'bootstrap-icons/font/bootstrap-icons.css';

export const metadata = {
  title: "Privacy Policy | Byose Iwacu Art",
  description: "Read BIA's privacy policy to understand how we collect, use, and protect your personal data.",
};

const sections = [
  {
    title: "Information We Collect",
    icon: "bi-database",
    content: [
      "Personal identification information (name, email address, phone number)",
      "Delivery address and billing information",
      "Payment information (processed securely — we never store full card numbers)",
      "Order history and shopping preferences",
      "Device and browser information for improving our platform",
      "Communications you send us via our contact form or email",
    ],
  },
  {
    title: "How We Use Your Information",
    icon: "bi-gear",
    content: [
      "To process and fulfill your orders",
      "To send order confirmations and delivery updates",
      "To respond to your inquiries and provide customer support",
      "To send promotional emails (only with your consent — you can unsubscribe anytime)",
      "To improve our website, products, and services",
      "To comply with legal obligations",
    ],
  },
  {
    title: "How We Protect Your Data",
    icon: "bi-shield-lock",
    content: [
      "All data is transmitted via SSL/TLS encrypted connections",
      "Payment information is processed by certified PCI-DSS compliant payment providers",
      "Access to personal data is restricted to authorized BIA employees only",
      "We conduct regular security audits of our systems",
      "We do not sell or rent your personal data to third parties",
    ],
  },
  {
    title: "Cookies",
    icon: "bi-browser-chrome",
    content: [
      "We use cookies to keep you signed in and remember your preferences",
      "Analytics cookies help us understand how users navigate our site",
      "You can manage cookie preferences in our Cookie Policy page",
      "Disabling cookies may affect some features of the website",
    ],
  },
  {
    title: "Your Rights",
    icon: "bi-person-check",
    content: [
      "Right to access: request a copy of the data we hold about you",
      "Right to rectification: request correction of inaccurate data",
      "Right to erasure: request deletion of your personal data",
      "Right to restrict processing: request we limit how we use your data",
      "Right to data portability: receive your data in a machine-readable format",
      "To exercise any of these rights, contact us at info@biafricantouch.com",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 text-orange-300 text-[13px] font-medium px-4 py-1.5 rounded-full mb-5">
            <i className="bi bi-shield-lock-fill"></i>
            Legal
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Privacy
            </span>{" "}
            Policy
          </h1>
          <p className="text-gray-400 text-[13px]">Last updated: January 2025</p>
          <p className="text-gray-300 text-[16px] mt-3 leading-relaxed">We respect your privacy. This policy explains how Byose Iwacu Art collects and uses your data.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto py-14 px-4 space-y-8">
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 text-[13px] text-gray-700 flex items-start gap-3">
          <i className="bi bi-info-circle-fill text-orange-500 text-lg flex-shrink-0 mt-0.5"></i>
          <p>By using the BIA platform, you agree to the collection and use of information as described in this policy. If you have questions, please <Link href="/contact-us" className="text-orange-600 font-semibold underline">contact us</Link>.</p>
        </div>

        {sections.map((s) => (
          <div key={s.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold text-gray-900 mb-4">
              <i className={`bi ${s.icon} text-orange-500 text-xl`}></i>
              {s.title}
            </h2>
            <ul className="space-y-2.5">
              {s.content.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[13px] text-gray-600">
                  <i className="bi bi-dot text-orange-400 text-2xl flex-shrink-0 -mt-1"></i>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-3">Contact Us</h2>
          <p className="text-[13px] text-gray-600 mb-4">If you have questions about this Privacy Policy or how we handle your data, please reach out to our Data Protection team.</p>
          <Link href="/contact-us" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-full transition-colors inline-flex items-center gap-2 text-[13px]">
            <i className="bi bi-envelope-fill"></i> Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
