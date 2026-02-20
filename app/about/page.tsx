import Link from "next/link";
import Image from "next/image";
import 'bootstrap-icons/font/bootstrap-icons.css';

export const metadata = {
  title: "About Us | Byose Iwacu Art",
  description: "Learn about Byose Iwacu Art — celebrating African creativity, culture, and craftsmanship from Rwanda to the world.",
};

const values = [
  { icon: "bi-palette-fill", title: "Authentic Art", desc: "Every product is handcrafted by skilled Rwandan and African artisans, preserving cultural heritage.", color: "text-orange-500" },
  { icon: "bi-globe-americas", title: "Global Reach", desc: "We connect African creators to customers across the world, making authentic art accessible everywhere.", color: "text-blue-500" },
  { icon: "bi-people-fill", title: "Community First", desc: "We empower artisans with fair trade practices, skills training, and market access.", color: "text-green-500" },
  { icon: "bi-heart-fill", title: "Made with Love", desc: "Every stitch, every brushstroke, every craft is made with passion and dedication.", color: "text-red-400" },
];

const milestones = [
  { year: "2020", event: "BIA founded in Kigali, Rwanda with a vision to celebrate African artistry." },
  { year: "2022", event: "Launched the online marketplace connecting 50+ artisans to global buyers." },
  { year: "2023", event: "Partnered with Tailors Dream College to train the next generation of African fashion designers." },
  { year: "2024", event: "Expanded to serve customers in 10+ countries across Africa, Europe and beyond." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 text-orange-300 text-[13px] font-medium px-4 py-1.5 rounded-full mb-6">
            <i className="bi bi-info-circle-fill"></i>
            Our Story
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            Celebrating African{" "}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Creativity
            </span>
          </h1>
          <p className="text-gray-300 text-[16px] sm:text-[17px] leading-relaxed max-w-2xl mx-auto">
            Byose Iwacu Art (BIA) is an African art and fashion marketplace born in Rwanda, dedicated to connecting talented artisans with the world.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/products" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full transition-colors flex items-center gap-2">
              <i className="bi bi-bag-fill"></i> Shop Now
            </Link>
            <Link href="/contact-us" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-full transition-colors flex items-center gap-2">
              <i className="bi bi-chat-dots"></i> Get in Touch
            </Link>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 text-[12px] font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                Our Mission
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
                Bringing African art to the world, one creation at a time
              </h2>
              <p className="text-gray-600 text-[14px] leading-relaxed mb-4">
                We believe that African craftsmanship deserves a global stage. BIA was founded to bridge the gap between talented African artisans and customers who appreciate authentic, handcrafted goods.
              </p>
              <p className="text-gray-600 text-[14px] leading-relaxed">
                From traditional Rwandan woven baskets to contemporary African fashion, every product on our platform tells a story of culture, skill, and pride.
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-amber-400 rounded-3xl p-8 text-white text-center">
              <Image src="/imgs/logo.ico" alt="BIA Logo" width={80} height={80} className="mx-auto mb-4 rounded-xl" />
              <h3 className="text-2xl font-extrabold mb-2">Byose Iwacu Art</h3>
              <p className="text-white/80 text-[14px] mb-4">&quot;Byose Iwacu&quot; means &quot;Everything is ours&quot; in Kinyarwanda — a celebration of shared African heritage.</p>
              <div className="grid grid-cols-2 gap-4 mt-6 text-left">
                {[["50+", "Artisans"], ["10+", "Countries"], ["1000+", "Products"], ["2020", "Founded"]].map(([num, label]) => (
                  <div key={label} className="bg-white/20 rounded-xl p-3">
                    <p className="text-2xl font-extrabold">{num}</p>
                    <p className="text-white/70 text-[12px]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">What we stand for</h2>
            <p className="text-gray-500 text-[14px]">Our core values guide everything we do at BIA.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                  <i className={`bi ${v.icon} ${v.color} text-2xl`}></i>
                </div>
                <h3 className="font-bold text-gray-800 text-[15px] mb-2">{v.title}</h3>
                <p className="text-gray-500 text-[13px] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">Our journey</h2>
            <p className="text-gray-500 text-[14px]">From a small idea in Kigali to a growing African marketplace.</p>
          </div>
          <div className="space-y-6">
            {milestones.map((m, i) => (
              <div key={m.year} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-[13px] flex-shrink-0 shadow-md">
                    {m.year}
                  </div>
                  {i < milestones.length - 1 && <div className="w-0.5 flex-1 bg-orange-200 mt-2"></div>}
                </div>
                <div className="pt-3 pb-6">
                  <p className="text-gray-700 text-[14px] leading-relaxed">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-500 py-14 px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Join the BIA family</h2>
        <p className="text-white/80 text-[14px] mb-7 max-w-lg mx-auto">
          Whether you&apos;re a shopper, an artisan, or a partner — there&apos;s a place for you at Byose Iwacu Art.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/products" className="bg-white text-orange-600 font-bold px-6 py-3 rounded-full hover:bg-orange-50 transition-colors flex items-center gap-2">
            <i className="bi bi-bag-fill"></i> Explore Products
          </Link>
          <Link href="/contact-us" className="bg-gray-900 text-white font-bold px-6 py-3 rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2">
            <i className="bi bi-envelope-fill"></i> Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
