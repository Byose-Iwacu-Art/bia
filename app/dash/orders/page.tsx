"use client";

import React, { useEffect } from "react";
import Orders from "../../comps/dash/orders";
import { useRouter } from 'next/navigation';

const Dashboard = () => {
    const router = useRouter();

    useEffect(() => {
        const session = JSON.parse(localStorage.getItem('userSession') || 'null');
        
        if (!session) {
            router.push("/auth/login");
        }
    }, [router]); // Added `router` to dependency array

    return (
        <>
        <title>Orders</title>
        <div className="ml-[60px] sm:ml-[200px] mt-[80px] py-8 bg-slate-50">
            <Orders />
        </div>
        </>
    );
};

export default Dashboard;
