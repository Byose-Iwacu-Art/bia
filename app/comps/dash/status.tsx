import { useEffect, useState } from "react";

interface Status {
    totalOrders: number;
    totalPayments: number;
    pendingOrders: number;
    deliveredOrders: number;
    totalInboxes: number;
}
const formatNumber = (amount: number | any, decimals: number): string => {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(amount);
  };
  

const Status = () => {
    const [status, setStatus] = useState<Status | null>(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    // Fetch user session
    useEffect(() => {
        const session = JSON.parse(localStorage.getItem("userSession") || "null");
        if (session && session.id) {
            setUserId(session.id); // Extract user ID from session
        } else {
            setUserId(null); // No session available
        }
    }, []);

    // Fetch status
    useEffect(() => {
        if (!userId) return;

        const fetchStatus = async () => {
            try {
                const response = await fetch(`/api/orders/count/${userId}`, {
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
                    setStatus(data.data);
                } else {
                    setStatus(null);
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                setStatus(null);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, [userId]);

    if (loading) {
        return <div className="min-h-[30vh] w-full flex items-center justify-center">Loading...</div>;
    }

    if (!status) {
        return <div className="min-h-[30vh] w-full flex items-center justify-center">No data available</div>;
    }

    return (
        <div className="sm:px-8 py-8 px-4">
            <h4 className="m-1 font-semibold">Statistics</h4>
            <div className="sm:flex grid grid-cols-2 sm:justify-between items-center gap-4 sm:flex-grow sm:flex-wrap">
                <div className="box bg-white p-4 m-2 text-center rounded-md">
                    <i className="bi bi-bag text-4xl text-green-300"></i>
                    <div className="count text-2xl font-semibold">{formatNumber(status.totalOrders, 0)}</div>
                    <span className="text-sm text-slate-400">Total Orders</span>
                </div>
                <div className="box bg-white p-4 m-2 text-center rounded-md">
                    <i className="bi bi-cart-plus text-4xl text-orange-300"></i>
                    <div className="count text-2xl font-semibold">{formatNumber(status.pendingOrders, 0)}</div>
                    <span className="text-sm text-slate-400">Pending Orders</span>
                </div>
                <div className="box bg-white p-4 m-2 text-center rounded-md">
                    <i className="bi bi-truck text-4xl text-red-300"></i>
                    <div className="count text-2xl font-semibold">{formatNumber(status.deliveredOrders, 0)}</div>
                    <span className="text-sm text-slate-400">Delivered Orders</span>
                </div>
                <div className="box bg-white p-4 m-2 text-center rounded-md">
                    <i className="bi bi-credit-card text-4xl text-green-300"></i>
                    <div className="count text-2xl font-semibold">{formatNumber(status.totalPayments, 2)}<span className="text-xs text-slate-800 ml-[1px]">RWF</span> </div>
                    <span className="text-sm text-slate-400">Total Payments</span>
                </div>
                <div className="box bg-white p-4 m-2 text-center rounded-md">
                    <i className="bi bi-receipt text-4xl text-orange-300"></i>
                    <div className="count text-2xl font-semibold">{formatNumber(status.totalInboxes, 0)}</div>
                    <span className="text-sm text-slate-400">Unpaid Invoices</span>
                </div>
            </div>
        </div>
    );
};

export default Status;
