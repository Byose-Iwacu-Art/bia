"use client";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

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

const Orders = () => {
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const session = JSON.parse(localStorage.getItem("userSession") || "null");
        if (session && session.id) {
            setUserId(session.id); // Extract user ID from session
        } else {
            setUserId(null); // No session available
        }
    }, []);

    useEffect(() => {
        if (!userId) return;

        const fetchOrders = async () => {
            try {
                const response = await fetch(`/api/orders/view/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();

                if (data.success) {
                    setOrders(data.orders);
                } else {
                    setOrders(null);
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                setOrders(null);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    const timeAgo = (createdDate: Date): string => {
        const now = new Date();
        const created = new Date(createdDate);

        const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return `Now`;
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
        }

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) {
            return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
        }

        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) {
            return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
        }

        const diffInYears = Math.floor(diffInMonths / 12);
        return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`;
    };

    if (loading) {
        return <p className="min-h-[30vh] w-full flex items-center justify-center text-gray-500 text-sm">Loading orders...</p>;
    }

    if (!userId) {
        return <p className="min-h-[30vh] w-full flex items-center justify-center text-gray-500 text-sm" >You need to log in to view orders.</p>;
    }
   
    return (
        <div className="px-8 pb-4 max-h-[80vh] overflow-hidden overflow-y-visible">
            <h4 className="font-semibold text-sm mb-4 text-gray-700">My Orders</h4>
            {loading ? (
                <p className="text-gray-500 text-sm text center p-8 w-full">Loading orders...</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded-md">
                    <table className="min-w-full border-collapse">
                        <thead className="bg-gray-100 text-gray-600 text-sm font-medium">
                            <tr>
                                <th className="py-3 px-6 text-left">Order ID</th>
                                <th className="py-3 px-6 text-left">Payment Method</th>
                                <th className="py-3 px-6 text-left">Total Amount</th>
                                <th className="py-3 px-6 text-left">Delivery</th>
                                <th className="py-3 px-6 text-left">Status</th>
                                <th className="py-3 px-6 text-left">Payment ID</th>
                                <th className="py-3 px-6 text-left">Date</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm">
                            {orders && orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.order_number} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-6">#{order.order_number}</td>
                                        <td className="py-3 px-6">{order.payment_method}</td>
                                        <td className="py-3 px-6">RF {order.total_amount}</td>
                                        <td className="py-3 px-6">{order.delivery_allowed ? "Yes" : "No"}</td>
                                        <td className={`py-3 px-6 `}>
                                            <span  className={`px-2 py-1 rounded ${
                                                order.status === "Delivered" || order.status === "Approved"
                                                    ? "text-green-400 bg-green-100"
                                                    : "text-red-400 bg-red-100"
                                            }`}>{order.status}</span>
                                        </td>
                                        <td className="py-3 px-6">
                                            <span  className={`px-2 py-1 rounded ${
                                                order.payment_status == "Paid" 
                                                    ? "text-teal-500"
                                                    : "text-orange-400 bg-orange-100"
                                            }`}>{order.payment_status || "Not paid"}</span></td>
                                        <td className="py-3 px-6">{timeAgo(order.created_at)}</td>
                                        <td className="py-3 px-6"><Link href={`/dash/orders/${order.order_number}`} onClick={() => redirect(`/dash/orders/${order.order_number}`)} className="text-orange-500">view</Link></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-4 text-center text-gray-500 italic"
                                    >
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Orders;
