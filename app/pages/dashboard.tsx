"use client";

import React, { useEffect, useState } from "react";
import Orders from "../comps/dash/orders";
import Status from "../comps/dash/status";
import { useAuthModal } from "../comps/auth/AuthModalContext";

const Dashboard = () => {
    const { openLogin } = useAuthModal();
    const [authed, setAuthed] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const session = JSON.parse(localStorage.getItem('userSession') || 'null');
        if (!session) {
            openLogin(() => setAuthed(true));
        } else {
            setAuthed(true);
            if (session.name) setUserName(session.name.split(' ')[0]);
        }
    }, [openLogin]);

    if (!authed) return null;

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="min-h-screen">
            {/* Greeting */}
            <div className="mb-6">
                <h1 className="text-[22px] sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                    Welcome back{userName ? `, ${userName}` : ''}
                </h1>
                <p className="text-[13px] text-gray-400 mt-1">{today}</p>
            </div>

            <Status />
            <Orders />
        </div>
    );
};

export default Dashboard;
