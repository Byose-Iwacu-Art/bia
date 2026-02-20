import Contact from "../comps/footer/contact";
import 'bootstrap-icons/font/bootstrap-icons.css';

export const metadata = {
  title: "Contact Us | Byose Iwacu Art",
  description: "Get in touch with the BIA team. We're here 24/7 to help with any questions, feedback, or support.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 text-orange-300 text-[13px] font-medium px-4 py-1.5 rounded-full mb-5">
            <i className="bi bi-chat-dots-fill"></i>
            We&apos;re here for you
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 leading-tight tracking-tight">
            Talk to the{" "}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              BIA Team
            </span>
          </h1>
          <p className="text-gray-300 text-[16px] sm:text-[17px] leading-relaxed">
            Whether you have a question about an order, want to partner with us, or just want to say hello — our team is available 24/7.
          </p>
        </div>
      </div>

      {/* Contact form (reuse existing component) */}
      <Contact />
    </div>
  );
}
