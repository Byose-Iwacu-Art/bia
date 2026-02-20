"use client";

import React, { useEffect, useState } from "react";
import Transactions from "@/app/comps/dash/payments";
import { useAuthModal } from "@/app/comps/auth/AuthModalContext";

const Payments = () => {
    const [authed, setAuthed] = useState(false);
    const { openLogin } = useAuthModal();

    useEffect(() => {
        const session = JSON.parse(localStorage.getItem('userSession') || 'null');
        if (!session) {
            openLogin(() => setAuthed(true));
        } else {
            setAuthed(true);
        }
    }, [openLogin]);

    if (!authed) return null;

    return (
        <>
            <title>My Payments</title>
            <div className="min-h-screen">
                <Transactions />
            </div>
        </>
    );
};

export default Payments;
