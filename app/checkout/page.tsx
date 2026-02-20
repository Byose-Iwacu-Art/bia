"use client"
import { useEffect, useState } from "react";
import AddLocation from "../comps/payments/addLocation";
import Checkout from "../pages/CheckOut";
import Pay from "../comps/payments/pay";
import { useAuthModal } from "../comps/auth/AuthModalContext";

const CheckOutPage = () => {
    const [showAddLocation, setShowAddLocation] = useState(false);
    const [authed, setAuthed] = useState(false);
    const { openLogin } = useAuthModal();

    useEffect(() => {
        const session = localStorage.getItem('userSession');
        if (!session) {
            openLogin(() => setAuthed(true));
        } else {
            setAuthed(true);
        }
    }, [openLogin]);

    const toggleAddLocation = () => setShowAddLocation(true);
    const closeAddLocation = () => setShowAddLocation(false);

    if (!authed) return null;

    return (
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
