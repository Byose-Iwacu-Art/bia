"use client";

import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';
import Transactions from "@/app/comps/dash/payments";

const Payments = () => {
    const router = useRouter();

    useEffect(() => {
        const session = JSON.parse(localStorage.getItem('userSession') || 'null');
        
        if (!session) {
            router.push("/auth/login");
        }
    }, [router]); // Added `router` to dependency array

    return (
        <div className="ml-[60px] sm:ml-[200px] mt-[80px] py-8 bg-slate-50">
            <head>
                <title>My payments </title>
            </head>
            <Transactions />
        </div>
    );
};

export default Payments;
