"use client";

import { useEffect, useState } from "react";

interface StatusData {
    totalOrders: number;
    totalPayments: number;
    pendingOrders: number;
    deliveredOrders: number;
}

const formatNumber = (amount: number, decimals: number): string =>
    new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(amount);

const CARDS = [
    {
        key: "totalOrders" as const,
        label: "Total Orders",
        icon: "bi-bag",
        decimals: 0,
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
    },
    {
        key: "pendingOrders" as const,
        label: "Pending",
        icon: "bi-clock-history",
        decimals: 0,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
    },
    {
        key: "deliveredOrders" as const,
        label: "Delivered",
        icon: "bi-truck",
        decimals: 0,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        key: "totalPayments" as const,
        label: "Total Paid",
        icon: "bi-credit-card",
        decimals: 2,
        iconBg: "bg-gray-100",
        iconColor: "text-gray-600",
        suffix: "RWF",
    },
];

const SkeletonCards = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
                <div className="w-10 h-10 bg-gray-100 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-100 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-20"></div>
            </div>
        ))}
    </div>
);

const Status = () => {
    const [status, setStatus] = useState<StatusData | null>(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const session = JSON.parse(localStorage.getItem("userSession") || "null");
        if (session?.id) setUserId(session.id);
        else setUserId(null);
    }, []);

    useEffect(() => {
        if (!userId) return;
        const fetchStatus = async () => {
            try {
                const res = await fetch(`/api/orders/count/${userId}`);
                if (!res.ok) throw new Error(res.statusText);
                const data = await res.json();
                if (data.success) setStatus(data.data);
                else setStatus(null);
            } catch (error) {
                console.error("Failed to fetch status:", error);
                setStatus(null);
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, [userId]);

    if (loading) return <SkeletonCards />;

    if (!status) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                <i className="bi bi-bar-chart text-gray-200 text-3xl"></i>
                <p className="text-[13px] text-gray-400 mt-2">No statistics available</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {CARDS.map((card) => (
                <div
                    key={card.key}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
                >
                    <div className={`w-10 h-10 ${card.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                        <i className={`bi ${card.icon} ${card.iconColor} text-[18px]`}></i>
                    </div>
                    <p className="text-[22px] font-extrabold text-gray-900 tracking-tight">
                        {formatNumber(status[card.key], card.decimals)}
                        {card.suffix && (
                            <span className="text-[11px] font-medium text-gray-400 ml-1">{card.suffix}</span>
                        )}
                    </p>
                    <p className="text-[12px] text-gray-400 mt-0.5">{card.label}</p>
                </div>
            ))}
        </div>
    );
};

export default Status;
