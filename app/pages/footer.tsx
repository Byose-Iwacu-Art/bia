import Link from "next/link";
import Image from "next/image";
import Contact from "../comps/footer/contact";
import FooterSection from "../comps/footer/footerSection";

const Footer = () => {
  return (
   <div className="pt-5 bg-slate-50">
   <Contact />
   <FooterSection />
   </div>
  );
};

export default Footer;

