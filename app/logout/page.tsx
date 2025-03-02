"use client"; // ✅ Required for using useRouter()

import React, { useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';

const Logout: React.FC = () => {

    useEffect(() => {
        const logoutUser = async () => {
            try {
                const session = localStorage.getItem('userSession');

                if (!session) {
                    localStorage.removeItem('userSession');
                    window.location.assign("/");
                    return;
                }

                const { session_id } = JSON.parse(session);
                const response = await axios.post("/api/auth/logout", { session_id });

                if (response.status === 200) {
                    localStorage.removeItem('userSession');
                    console.log(response.data.message);
                    window.location.assign('/');
                }
            } catch (error) {
                console.error("Error logging out:", error);
                alert("Error logging out. Please try again.");
            }
        };

        logoutUser();
    }, []); // ✅ Added `router` to dependency array

    return (
        <div className="flex justify-center items-center h-screen">
            <Head>
                <title>Logging Out</title>
            </Head>
            <h1 className="text-2xl">Logging out...</h1>
        </div>
    );
};

export default Logout;
