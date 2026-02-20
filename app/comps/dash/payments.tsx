"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import PaymentDetailsPopup from "./paymentDetails";

interface PaymentDetail {
  paymentId: number;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  account: string;
  name: string;
  email: string;
  provider: string;
  address: string;
  tx_ref: string;
  currency: string;
  details: string;
  status: string;
  orderNumber: number;
  transactionId: string;
  flutter_response: any;
  createdAt: string;
}

const formatNumber = (amount: number): string =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const timeAgo = (createdDate: string): string => {
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
  return `${Math.floor(diffInMonths / 12)}y ago`;
};

const statusBadge = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "paid" || s === "completed") return "bg-emerald-50 text-emerald-600";
  if (s === "pending") return "bg-amber-50 text-amber-600";
  return "bg-red-50 text-red-600";
};

const SkeletonTable = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
    <div className="h-10 bg-gray-50"></div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-5 py-3 border-t border-gray-50">
        <div className="h-3 bg-gray-100 rounded w-16"></div>
        <div className="h-3 bg-gray-100 rounded w-20"></div>
        <div className="h-3 bg-gray-100 rounded w-24"></div>
        <div className="h-5 bg-gray-100 rounded-full w-16"></div>
        <div className="h-3 bg-gray-100 rounded w-12"></div>
      </div>
    ))}
  </div>
);

const Transactions = () => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetail[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<PaymentDetail | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("userSession") || "null");
    if (session?.id) setUserId(session.id);
    else setUserId(null);
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchPayments = async () => {
      try {
        const res = await fetch(`/api/orders/transactions/${userId}`);
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        if (data.success) setPaymentDetails(data.paymentDetails);
        else setPaymentDetails(null);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
        setPaymentDetails(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [userId]);

  if (loading) return <SkeletonTable />;

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-bold text-gray-900">Payments</h2>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-5 text-left text-[12px] uppercase tracking-wider text-gray-400 font-medium">ID</th>
                <th className="py-3 px-5 text-left text-[12px] uppercase tracking-wider text-gray-400 font-medium">Method</th>
                <th className="py-3 px-5 text-left text-[12px] uppercase tracking-wider text-gray-400 font-medium hidden sm:table-cell">Account</th>
                <th className="py-3 px-5 text-left text-[12px] uppercase tracking-wider text-gray-400 font-medium hidden md:table-cell">Transaction</th>
                <th className="py-3 px-5 text-left text-[12px] uppercase tracking-wider text-gray-400 font-medium">Amount</th>
                <th className="py-3 px-5 text-left text-[12px] uppercase tracking-wider text-gray-400 font-medium">Status</th>
                <th className="py-3 px-5 text-left text-[12px] uppercase tracking-wider text-gray-400 font-medium hidden lg:table-cell">Date</th>
                <th className="py-3 px-5 text-right text-[12px] uppercase tracking-wider text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paymentDetails && paymentDetails.length > 0 ? (
                paymentDetails.map((payment) => {
                  const flutterData = typeof payment.flutter_response === "string"
                    ? JSON.parse(payment.flutter_response)
                    : payment.flutter_response;

                  return (
                    <tr key={payment.paymentId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-5">
                        <span className="text-[13px] font-semibold text-gray-900">#{payment.paymentId}</span>
                      </td>
                      <td className="py-3 px-5">
                        <span className="text-[13px] text-gray-500">{payment.paymentMethod}</span>
                      </td>
                      <td className="py-3 px-5 hidden sm:table-cell">
                        <span className="text-[13px] text-gray-500">{payment.account}</span>
                      </td>
                      <td className="py-3 px-5 hidden md:table-cell">
                        <span className="text-[12px] text-gray-400 font-mono">{payment.transactionId}</span>
                      </td>
                      <td className="py-3 px-5">
                        <span className="text-[13px] font-medium text-gray-700">
                          {formatNumber(payment.amount)}
                          <span className="text-[10px] text-gray-400 ml-0.5">{payment.currency}</span>
                        </span>
                      </td>
                      <td className="py-3 px-5">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium ${statusBadge(payment.status)}`}>
                          {payment.status || "Unpaid"}
                        </span>
                      </td>
                      <td className="py-3 px-5 hidden lg:table-cell">
                        <span className="text-[12px] text-gray-400">{timeAgo(payment.createdAt)}</span>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setView(payment)}
                            className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
                            title="Details"
                          >
                            <i className="bi bi-info-circle text-[13px] text-gray-500"></i>
                          </button>
                          <Link
                            href={`/dash/orders/${payment.orderNumber}`}
                            className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
                            title="View Order"
                          >
                            <i className="bi bi-eye text-[13px] text-gray-500"></i>
                          </Link>
                          {payment.status !== "Paid" && flutterData?.data?.paymentLinkUrl && (
                            <a
                              href={flutterData.data.paymentLinkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="h-8 px-3 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-[12px] font-medium flex items-center justify-center transition-colors"
                            >
                              Pay
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <i className="bi bi-credit-card text-gray-200 text-3xl"></i>
                    <p className="text-[13px] text-gray-400 mt-2">No payments found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {view && <PaymentDetailsPopup payment={view} onClose={() => setView(null)} />}
    </div>
  );
};

export default Transactions;
