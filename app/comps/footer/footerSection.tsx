import Link from "next/link";

const FooterSection = () => {
  return (
    <div className="w-full p-4 bg-gray-200">
    
    <div className="flex flex-col sm:flex-row px-4 justify-between">
      <div className="logo w-full sm:w-1/3">
        <div className="w-full flex justify-self-center sm:justify-self-start">
          <img src="/imgs/logo.ico" alt="" className="w-[30vw] h-[30vh] object-contain"/>
        </div>
      </div>
      <div className="services w-full sm:w-[42%]">
         <h4 className="text-3xl my-3  text-slate-950 text-nowrap">Byose Iwacu Art</h4>
         <div className="slides grid grid-cols-3 gap-3 justify-between">
            <div className="mr-1 my-2">
              <h3 className="text-base text-teal-600 my-2 font-medium">About us</h3>
               <ul className="space-y-2 mx-1">
                <li className="my-1 text-xs"><Link href={''}>Mission</Link></li>
                <li className="my-1 text-xs"><Link href={''}>Team</Link></li>
                <li className="my-1 text-xs"><Link href={''}>Newsletter</Link></li>
               </ul>
            </div>
            <div className="mr-1 my-2">
              <h3 className="text-base text-teal-600 my-2 font-medium">Support</h3>
               <ul className="space-y-2 mx-1">
                <li className="my-1 text-xs"><Link href={''}>Contact</Link></li>
                <li className="my-1 text-xs"><Link href={''}>FAQs</Link></li>
                <li className="my-1 text-xs"><Link href={'https://kamero.rw'}>Developers</Link></li>
               </ul>
            </div><div className="mr-1 my-2">
              <h3 className="text-base text-teal-600 my-2 font-medium">Social</h3>
               <ul className="space-y-2 mx-1">
                <li className="my-1 text-xs"><Link href={''}>Instagram</Link></li>
                <li className="my-1 text-xs"><Link href={''}>LinkedIn</Link></li>
                <li className="my-1 text-xs"><Link href={''}>Youtube</Link></li>
               </ul>
            </div>

         </div>
      </div>
      
    </div>
    <div className="border-t text-xs border-slate-500 py-6 px-5 flex justify-between items-center sm:py-2">
      <div className="">Copyright 2025 &copy;. All rights reserved</div>
      <Link href={''}>Terms of service</Link>
      <a href={'https://tailors.biafricantouch.com'} target="_blank">Tailors Dream College</a>
      <button className="border back-to-top border-slate-400 p-1 rounded text-nowrap">Back to Top<i className="bi bi-box-arrow-up"></i></button>
    </div>
  </div>
  )
}
export default FooterSection;