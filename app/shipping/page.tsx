import Link from "next/link";
import 'bootstrap-icons/font/bootstrap-icons.css';

export const metadata = {
  title: "Shipping Info | Byose Iwacu Art",
  description: "Learn about BIA shipping zones, delivery times, and costs.",
};

const zones = [
  {
    zone: "Kigali City",
    icon: "bi-building",
    time: "1 – 2 business days",
    cost: "Free over 50,000 RWF · 2,000 RWF otherwise",
    color: "bg-green-50 border-green-200",
    badge: "bg-green-500",
  },
  {
    zone: "Rwanda (Nationwide)",
    icon: "bi-map",
    time: "3 – 5 business days",
    cost: "Free over 50,000 RWF · 4,000 – 6,000 RWF otherwise",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-500",
  },
  {
    zone: "East Africa (EAC)",
    icon: "bi-globe-africa",
    time: "5 – 10 business days",
    cost: "Calculated at checkout based on weight & destination",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-500",
  },
  {
    zone: "International",
    icon: "bi-airplane",
    time: "10 – 21 business days",
    cost: "Calculated at checkout based on weight & destination",
    color: "bg-purple-50 border-purple-200",
    badge: "bg-purple-500",
  },
];

const steps = [
  { icon: "bi-bag-check-fill", label: "Order Placed", desc: "You place your order and receive a confirmation email." },
  { icon: "bi-box-seam", label: "Processing", desc: "The artisan prepares and packages your order (1–2 days)." },
  { icon: "bi-truck", label: "Shipped", desc: "Your order is handed to the delivery partner and you get a tracking number." },
  { icon: "bi-house-check-fill", label: "Delivered", desc: "Your package arrives at your door. Enjoy!" },
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 text-orange-300 text-[13px] font-medium px-4 py-1.5 rounded-full mb-5">
            <i className="bi bi-truck-front-fill"></i>
            Shipping Information
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 leading-tight tracking-tight">
            Fast &amp; Reliable{" "}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Delivery
            </span>
          </h1>
          <p className="text-gray-300 text-[16px] leading-relaxed">We deliver across Rwanda and internationally, with free shipping on qualifying orders.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-14 px-4 space-y-12">

        {/* Free shipping banner */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-400 rounded-2xl p-6 text-white flex items-center gap-4">
          <i className="bi bi-truck-front-fill text-5xl text-white/80"></i>
          <div>
            <h2 className="text-xl font-extrabold mb-1">Free Shipping Available</h2>
            <p className="text-white/80 text-[14px]">All orders over <strong>50,000 RWF</strong> within Rwanda qualify for free shipping — no code needed.</p>
          </div>
        </div>

        {/* Zones */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">Delivery Zones & Costs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {zones.map((z) => (
              <div key={z.zone} className={`rounded-2xl border p-5 ${z.color}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 ${z.badge} text-white rounded-full flex items-center justify-center text-[17px]`}>
                    <i className={`bi ${z.icon}`}></i>
                  </div>
                  <h3 className="font-bold text-gray-800 text-[15px]">{z.zone}</h3>
                </div>
                <p className="text-[13px] text-gray-600 mb-1"><i className="bi bi-clock text-gray-400 mr-1.5"></i>{z.time}</p>
                <p className="text-[13px] text-gray-600"><i className="bi bi-tag text-gray-400 mr-1.5"></i>{z.cost}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Process */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">How Delivery Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 text-center relative shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className={`bi ${s.icon} text-orange-500 text-2xl`}></i>
                </div>
                <span className="absolute top-3 left-3 bg-orange-500 text-white text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center">{i + 1}</span>
                <h3 className="font-bold text-gray-800 text-[14px] mb-1">{s.label}</h3>
                <p className="text-gray-500 text-[12px] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4">Important Notes</h2>
          {[
            "Delivery times are estimates and may vary due to public holidays, weather, or high demand periods.",
            "For fragile or high-value items, we use special protective packaging at no extra cost.",
            "Once an order is shipped, we cannot guarantee specific delivery times for international orders.",
            "BIA is not responsible for delays caused by customs or local postal services for international shipments.",
          ].map((note, i) => (
            <div key={i} className="flex items-start gap-3 text-[13px] text-gray-600">
              <i className="bi bi-info-circle-fill text-orange-400 mt-0.5 flex-shrink-0"></i>
              {note}
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="text-center">
          <p className="text-gray-500 text-[14px] mb-3">Have a question about your shipment?</p>
          <Link href="/contact-us" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full transition-colors inline-flex items-center gap-2">
            <i className="bi bi-chat-dots-fill"></i> Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
