import Link from "next/link";

const FooterSection = () => {
  return (
    <div className="w-full bg-gray-900 text-white py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between px-6">
        {/* Logo */}
        <div className="mb-6 sm:mb-0">
          <img
            src="/imgs/logo.ico"
            alt="Byose Iwacu Art Logo"
            className="w-32 h-32 object-contain"
          />
        </div>

        {/* Site Title */}
        <div className="text-center sm:text-left mb-6 sm:mb-0">
          <h4 className="text-3xl font-bold text-orange-400 mb-2">
            Byose Iwacu Art
          </h4>
          <p className="text-sm text-gray-400">
            Celebrating creativity, culture, and craftsmanship.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-6 text-2xl">
          <Link href="#">
            <i className="bi bi-instagram hover:text-orange-400 transition"></i>
          </Link>
          <Link href="#">
            <i className="bi bi-linkedin hover:text-orange-400 transition"></i>
          </Link>
          <Link href="#">
            <i className="bi bi-youtube hover:text-orange-400 transition"></i>
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-6 pt-4 px-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
        <div>© 2025 Byose Iwacu Art. All rights reserved.</div>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <a href="https://kamero.rw" target="_blank" rel="noopener noreferrer">
            Developers
          </a>
          <Link href="#">Terms of Service</Link>
          <a href="https://tailors.biafricantouch.com" target="_blank" rel="noopener noreferrer">
            Tailors Dream College
          </a>
        </div>
        <button className="flex items-center mt-2 sm:mt-0 border border-gray-600 px-2 py-1 rounded hover:bg-gray-800 transition">
          <i className="bi bi-box-arrow-up mr-1"></i> Back to Top
        </button>
      </div>
    </div>
  );
};

export default FooterSection;
