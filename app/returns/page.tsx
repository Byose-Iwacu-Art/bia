import Link from "next/link";
import 'bootstrap-icons/font/bootstrap-icons.css';

export const metadata = {
  title: "Returns & Refunds | Byose Iwacu Art",
  description: "Learn about BIA's returns and refunds policy.",
};

const steps = [
  { step: "1", title: "Contact Us", desc: "Within 7 days of receiving your order, reach out via our Contact Us page or call +250 788 282 252.", icon: "bi-chat-dots-fill" },
  { step: "2", title: "Get Approval", desc: "Our team reviews your request and provides a return authorization within 24 hours.", icon: "bi-check-circle-fill" },
  { step: "3", title: "Ship the Item", desc: "Pack the item securely in its original packaging and ship it to the address we provide.", icon: "bi-box-seam" },
  { step: "4", title: "Receive Refund", desc: "Once we receive and inspect the item, your refund is processed within 5–7 business days.", icon: "bi-wallet2" },
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 text-orange-300 text-[13px] font-medium px-4 py-1.5 rounded-full mb-5">
            <i className="bi bi-arrow-return-left"></i>
            Returns & Refunds
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 leading-tight tracking-tight">
            Easy{" "}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Returns
            </span>
            , No Hassle
          </h1>
          <p className="text-gray-300 text-[16px] leading-relaxed">We stand behind every product. If something isn&apos;t right, we&apos;ll make it right.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-14 px-4 space-y-12">

        {/* Policy summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: "bi-calendar-check", title: "7-Day Window", desc: "Return eligible items within 7 days of delivery.", color: "text-green-500" },
            { icon: "bi-box", title: "Original Condition", desc: "Items must be unused, unwashed, and in original packaging.", color: "text-blue-500" },
            { icon: "bi-cash-coin", title: "Full Refund", desc: "Approved returns receive a full refund to your original payment method.", color: "text-orange-500" },
          ].map((p) => (
            <div key={p.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <i className={`bi ${p.icon} ${p.color} text-4xl mb-3 block`}></i>
              <h3 className="font-bold text-gray-800 text-[15px] mb-1">{p.title}</h3>
              <p className="text-gray-500 text-[13px] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* What's eligible */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5">What can be returned?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-green-600 flex items-center gap-2 mb-3 text-[14px]">
                <i className="bi bi-check-circle-fill text-green-500"></i> Eligible for return
              </h3>
              <ul className="space-y-2 text-[13px] text-gray-600">
                {["Unused items in original packaging", "Items received damaged or defective", "Wrong item delivered", "Items significantly different from description"].map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <i className="bi bi-check2 text-green-500 mt-0.5 flex-shrink-0"></i>{i}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-red-500 flex items-center gap-2 mb-3 text-[14px]">
                <i className="bi bi-x-circle-fill text-red-400"></i> Not eligible for return
              </h3>
              <ul className="space-y-2 text-[13px] text-gray-600">
                {["Customized or personalized items", "Items that have been used or washed", "Items without original packaging", "Items returned after 7 days"].map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <i className="bi bi-x text-red-400 mt-0.5 flex-shrink-0"></i>{i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* How to return */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">How to return an item</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s) => (
              <div key={s.step} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative">
                <span className="absolute top-3 right-3 w-7 h-7 bg-orange-500 text-white text-[12px] font-extrabold rounded-full flex items-center justify-center">{s.step}</span>
                <i className={`bi ${s.icon} text-orange-400 text-2xl mb-3 block`}></i>
                <h3 className="font-bold text-gray-800 text-[14px] mb-1">{s.title}</h3>
                <p className="text-gray-500 text-[12px] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Refund timeline */}
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
            <i className="bi bi-clock-history text-orange-500"></i> Refund Timeline
          </h2>
          <div className="space-y-3 text-[13px] text-gray-700">
            {[
              ["MTN / Airtel Mobile Money", "1–3 business days"],
              ["Visa / Mastercard", "5–7 business days"],
              ["Bank Transfer", "3–7 business days"],
            ].map(([method, time]) => (
              <div key={method} className="flex justify-between items-center bg-white rounded-xl px-4 py-3 border border-orange-100">
                <span className="font-medium">{method}</span>
                <span className="text-orange-600 font-semibold">{time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-500 text-[14px] mb-3">Need help with a return?</p>
          <Link href="/contact-us" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full transition-colors inline-flex items-center gap-2">
            <i className="bi bi-chat-dots-fill"></i> Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
