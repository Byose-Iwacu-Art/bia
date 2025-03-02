"use client"
import { useEffect, useState } from "react";
import AddLocation from "../comps/payments/addLocation";
import Checkout from "../pages/CheckOut";
import { useRouter } from 'next/navigation';
import Pay from "../comps/payments/pay";

const CheckOutPage = () => {
    const [showAddLocation, setShowAddLocation] = useState(false);
    
    const router = useRouter();
 
    const toggleAddLocation = () => {
        setShowAddLocation(true);
      };
    
      const closeAddLocation = () => {
        setShowAddLocation(false);
      };
      const session = localStorage.getItem('userSession');
                
      if (!session) {
          router.push("/auth/login");
          return;
      }
      
    return(
        <>
        <head>
            <title>Payments Check Out</title>
        </head>
        <Checkout onAddLocationClick={toggleAddLocation}/>
        {showAddLocation && (
        <div className="block">
          <AddLocation onClose={closeAddLocation}/>
        </div>
      )}
     
                
        </>

    );
}
export default CheckOutPage;