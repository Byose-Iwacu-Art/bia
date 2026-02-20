"use client";

import { useEffect, useState } from "react";
import PersonalDetails from "@/app/comps/dash/profile/personalDetails";
import ProfileBar from "@/app/comps/dash/profile/profileBar";
import { useAuthModal } from "@/app/comps/auth/AuthModalContext";

const Profile = () => {
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
            <title>Profile</title>
            <div className="min-h-screen">
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
                    <ProfileBar />
                    <PersonalDetails />
                </div>
            </div>
        </>
    );
};

export default Profile;
