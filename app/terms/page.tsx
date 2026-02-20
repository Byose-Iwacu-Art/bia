import Link from "next/link";
import 'bootstrap-icons/font/bootstrap-icons.css';

export const metadata = {
  title: "Terms of Use | Byose Iwacu Art",
  description: "Read the Terms of Use for the BIA platform.",
};

const sections = [
  { title: "Acceptance of Terms", content: "By accessing or using the Byose Iwacu Art platform, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our platform." },
  { title: "Use of the Platform", content: "You may use our platform for lawful purposes only. You agree not to use it to sell or purchase illegal goods, to harass or harm other users, to transmit harmful software or malware, or to violate any applicable local or international laws." },
  { title: "Account Responsibility", content: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Please notify us immediately of any unauthorized use of your account." },
  { title: "Product Listings", content: "BIA acts as a marketplace connecting buyers and artisan sellers. While we take reasonable steps to ensure product accuracy, we cannot guarantee all product descriptions, prices, or availability are error-free. Artisans are responsible for the accuracy of their listings." },
  { title: "Payments & Pricing", content: "All prices are displayed in RWF unless otherwise stated. BIA reserves the right to change prices at any time. Payments must be completed in full before orders are processed. We use secure, certified payment processors." },
  { title: "Intellectual Property", content: "All content on the BIA platform — including logos, images, text, and designs — is owned by BIA or its artisan partners and protected by copyright. You may not reproduce or distribute any content without express written permission." },
  { title: "Limitation of Liability", content: "BIA is not liable for any indirect, incidental, or consequential damages arising from the use of our platform or from products purchased through it. Our total liability in any claim shall not exceed the amount paid for the relevant order." },
  { title: "Changes to Terms", content: "We reserve the right to update these Terms of Use at any time. We will notify users of significant changes via email or a notice on the website. Continued use of the platform constitutes acceptance of the updated terms." },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 text-orange-300 text-[13px] font-medium px-4 py-1.5 rounded-full mb-5">
            <i className="bi bi-file-text-fill"></i>
            Legal
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 leading-tight tracking-tight">
            Terms of{" "}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Use
            </span>
          </h1>
          <p className="text-gray-400 text-[13px]">Last updated: January 2025</p>
          <p className="text-gray-300 text-[16px] mt-3 leading-relaxed">Please read these terms carefully before using the BIA platform.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto py-14 px-4 space-y-6">
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 text-[13px] text-gray-700 flex items-start gap-3">
          <i className="bi bi-info-circle-fill text-orange-500 text-lg flex-shrink-0 mt-0.5"></i>
          <p>These terms govern your use of Byose Iwacu Art. Questions? <Link href="/contact-us" className="text-orange-600 font-semibold underline">Contact us</Link>.</p>
        </div>

        {sections.map((s, i) => (
          <div key={s.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
            <h2 className="flex items-center gap-3 text-[16px] font-extrabold text-gray-800 mb-3">
              <span className="w-7 h-7 bg-orange-500 text-white text-[12px] font-extrabold rounded-full flex items-center justify-center flex-shrink-0">{i + 1}</span>
              {s.title}
            </h2>
            <p className="text-[13px] text-gray-600 leading-relaxed">{s.content}</p>
          </div>
        ))}

        <div className="text-center pt-4">
          <p className="text-gray-500 text-[13px] mb-3">Questions about our terms?</p>
          <Link href="/contact-us" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full transition-colors inline-flex items-center gap-2 text-[13px]">
            <i className="bi bi-chat-dots-fill"></i> Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
