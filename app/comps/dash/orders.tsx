"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Order {
    created_at: Date;
    order_number: string;
    payment_method: string;
    total_amount: number;
    delivery_allowed: boolean;
    status: string;
    payment_id: string | null;
    payment_status: string;
}

const formatNumber = (amount: number): string =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const timeAgo = (createdDate: Date): string => {
    const now = new Date();
    const created = new Date(createdDate);
    const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);

    if (diffInSeconds < 60) return "Now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths}mo ago`;
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears}y ago`;
};

const statusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "delivered" || s === "approved")
        return "bg-emerald-50 text-emerald-600";
    if (s === "pending" || s === "processing")
        return "bg-amber-50 text-amber-600";
    return "bg-red-50 text-red-600";
};

const paymentBadge = (status: string) => {
    if (status?.toLowerCase() === "paid")
        return "bg-emerald-50 text-emerald-600";
    return "bg-amber-50 text-amber-600";
};

const SkeletonTable = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
        <div className="h-10 bg-gray-50"></div>
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3 border-t border-gray-50">
                <div className="h-3 bg-gray-100 rounded w-20"></div>
                <div className="h-3 bg-gray-100 rounded w-16"></div>
                <div className="h-3 bg-gray-100 rounded w-20"></div>
                <div className="h-5 bg-gray-100 rounded-full w-16"></div>
                <div className="h-5 bg-gray-100 rounded-full w-14"></div>
                <div className="h-3 bg-gray-100 rounded w-12"></div>
            </div>
        ))}
    </div>
);

const Orders = () => {
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const session = JSON.parse(localStorage.getItem("userSession") || "null");
        if (session?.id) setUserId(session.id);
        else setUserId(null);
    }, []);

    useEffect(() => {
        if (!userId) return;
        const fetchOrders = async () => {
            try {
                const res = await fetch(`/api/orders/view/${userId}`);
                if (!res.ok) throw new Error(res.statusText);
                const data = await res.json();
                if (data.success) setOrders(data.orders);
                else setOrders(null);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                setOrders(null);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [userId]);

    if (loading) return <SkeletonTable />;

    return (
        <div>
            {/* Section header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-bold text-gray-900">Recent Orders</h2>
                <Link
                    href="/dash/orders"
                    className="text-[12px] text-gray-400 hover:text-gray-900 font-medium transition-colors flex items-center gap-1"
                >
                    View All
                    <i className="bi bi-chevron-right text-[10px]"></i>
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="py-3 px-5 text-left text-[12px] uppercase tracking-wider text-gray-400 font-medium">Order</th>
                                <th className="py-3 px-5 text-left text-[12px] uppercase tracking-wider text-gray-400 font-medium">Amount</th>
                                <th className="py-3 px-5 text-left text-[12px] uppercase tracking-wider text-gray-400 font-medium hidden sm:table-cell">Method</th>
                                <th className="py-3 px-5 text-left text-[12px] uppercase tracking-wider text-gray-400 font-medium">Status</th>
                                <th className="py-3 px-5 text-left text-[12px] uppercase tracking-wider text-gray-400 font-medium hidden md:table-cell">Payment</th>
                                <th className="py-3 px-5 text-left text-[12px] uppercase tracking-wider text-gray-400 font-medium hidden lg:table-cell">Date</th>
                                <th className="py-3 px-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders && orders.length > 0 ? (
                                orders.slice(0, 8).map((order) => (
                                    <tr key={order.order_number} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-5">
                                            <span className="text-[13px] font-semibold text-gray-900">#{order.order_number}</span>
                                        </td>
                                        <td className="py-3 px-5">
                                            <span className="text-[13px] font-medium text-gray-700">
                                                {formatNumber(order.total_amount)}
                                                <span className="text-[10px] text-gray-400 ml-0.5">RWF</span>
                                            </span>
                                        </td>
                                        <td className="py-3 px-5 hidden sm:table-cell">
                                            <span className="text-[13px] text-gray-500">{order.payment_method}</span>
                                        </td>
                                        <td className="py-3 px-5">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium ${statusBadge(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-5 hidden md:table-cell">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium ${paymentBadge(order.payment_status)}`}>
                                                {order.payment_status || "Unpaid"}
                                            </span>
                                        </td>
                                        <td className="py-3 px-5 hidden lg:table-cell">
                                            <span className="text-[12px] text-gray-400">{timeAgo(order.created_at)}</span>
                                        </td>
                                        <td className="py-3 px-5 text-right">
                                            <Link
                                                href={`/dash/orders/${order.order_number}`}
                                                className="text-[12px] text-gray-400 hover:text-gray-900 font-medium transition-colors"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center">
                                        <i className="bi bi-bag text-gray-200 text-3xl"></i>
                                        <p className="text-[13px] text-gray-400 mt-2">No orders yet</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Orders;
