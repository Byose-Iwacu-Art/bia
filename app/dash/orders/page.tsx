"use client";

import React, { useEffect, useState } from "react";
import Orders from "../../comps/dash/orders";
import { useAuthModal } from "../../comps/auth/AuthModalContext";

const Dashboard = () => {
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
            <title>Orders</title>
            <div className="min-h-screen">
                <Orders />
            </div>
        </>
    );
};

export default Dashboard;
