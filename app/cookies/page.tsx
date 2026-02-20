import Link from "next/link";
import 'bootstrap-icons/font/bootstrap-icons.css';

export const metadata = {
  title: "Cookie Policy | Byose Iwacu Art",
  description: "Understand how BIA uses cookies to improve your experience.",
};

const cookieTypes = [
  {
    name: "Essential Cookies",
    icon: "bi-lock-fill",
    required: true,
    color: "text-green-500",
    bg: "bg-green-50 border-green-100",
    desc: "These cookies are necessary for the website to function and cannot be switched off. They are set in response to actions made by you such as signing in, adding items to your cart, or setting language preferences.",
    examples: ["Session authentication", "Cart contents", "Language preference", "Security tokens"],
  },
  {
    name: "Analytics Cookies",
    icon: "bi-bar-chart-fill",
    required: false,
    color: "text-blue-500",
    bg: "bg-blue-50 border-blue-100",
    desc: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. They allow us to improve the user experience.",
    examples: ["Page views and navigation paths", "Time spent on pages", "Error tracking", "Feature usage stats"],
  },
  {
    name: "Preference Cookies",
    icon: "bi-sliders",
    required: false,
    color: "text-purple-500",
    bg: "bg-purple-50 border-purple-100",
    desc: "These cookies enable us to remember your preferences and settings, such as your selected currency, language, or display options, so you don't have to re-select them on every visit.",
    examples: ["Currency selection", "Language setting", "Display preferences"],
  },
  {
    name: "Marketing Cookies",
    icon: "bi-megaphone-fill",
    required: false,
    color: "text-orange-500",
    bg: "bg-orange-50 border-orange-100",
    desc: "These cookies may be set by our advertising partners to build a profile of your interests. They do not store personal information directly but are based on identifying your browser uniquely.",
    examples: ["Ad relevance tracking", "Frequency capping", "Conversion measurement"],
  },
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 text-orange-300 text-[13px] font-medium px-4 py-1.5 rounded-full mb-5">
            <i className="bi bi-browser-chrome"></i>
            Legal
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 leading-tight tracking-tight">
            Cookie{" "}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Policy
            </span>
          </h1>
          <p className="text-gray-400 text-[13px]">Last updated: January 2025</p>
          <p className="text-gray-300 text-[16px] mt-3 leading-relaxed">We use cookies to give you the best experience on BIA. Here&apos;s what you should know.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto py-14 px-4 space-y-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-[13px] text-gray-600 leading-relaxed">
          <h2 className="text-xl font-extrabold text-gray-900 mb-2">What are cookies?</h2>
          <p>Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, keep you signed in, and understand how you use the site to improve future visits. Cookies do not harm your device or contain viruses.</p>
        </div>

        {cookieTypes.map((c) => (
          <div key={c.name} className={`rounded-2xl border p-6 ${c.bg}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 text-[16px] font-extrabold text-gray-800">
                <i className={`bi ${c.icon} ${c.color} text-xl`}></i>
                {c.name}
              </h2>
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${c.required ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                {c.required ? 'Always Active' : 'Optional'}
              </span>
            </div>
            <p className="text-[13px] text-gray-600 leading-relaxed mb-4">{c.desc}</p>
            <div>
              <p className="text-[12px] font-semibold text-gray-500 mb-2 uppercase tracking-wide">Examples:</p>
              <div className="flex flex-wrap gap-2">
                {c.examples.map((ex) => (
                  <span key={ex} className="bg-white border border-gray-200 text-gray-600 text-[11px] px-2.5 py-1 rounded-full">{ex}</span>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-[16px] font-extrabold text-gray-800 mb-3">Managing Your Cookie Preferences</h2>
          <p className="text-[13px] text-gray-600 leading-relaxed mb-4">You can control cookies through your browser settings. Most browsers allow you to block or delete cookies. Note that blocking essential cookies may affect how the website works, including keeping you signed in or maintaining your cart.</p>
          <p className="text-[13px] text-gray-600 leading-relaxed">For more information on managing cookies in your browser, visit the help pages of your browser provider.</p>
        </div>

        <div className="text-center">
          <p className="text-gray-500 text-[13px] mb-3">Questions about cookies or privacy?</p>
          <Link href="/contact-us" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full transition-colors inline-flex items-center gap-2 text-[13px]">
            <i className="bi bi-chat-dots-fill"></i> Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
