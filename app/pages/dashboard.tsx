"use client";

import React, { useEffect } from "react";
import Orders from "../comps/dash/orders";
import Status from "../comps/dash/status";
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
        <div className="ml-[60px] sm:ml-[200px] mt-[80px] bg-slate-50">
            <Status />
            <Orders />
        </div>
    );
};

export default Dashboard;
