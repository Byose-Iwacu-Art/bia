"use client";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import PaymentDetailsPopup from "./paymentDetails";

interface PaymentDetail {
  paymentId: number;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  account: string;
  name: string;
  email: string,
  provider: string,
  address: string,
  tx_ref: string,
  currency: string;
  details: string;
  status: string;
  orderNumber: number;
  transactionId: string;
  flutter_response: any;
  createdAt: string;
}

const Transactions = () => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetail[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<PaymentDetail | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("userSession") || "null");
    if (session && session.id) {
      setUserId(session.id);
    } else {
      setUserId(null);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchPayments = async () => {
      try {
        const response = await fetch(`/api/orders/transactions/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success) {
          setPaymentDetails(data.paymentDetails);
        } else {
          setPaymentDetails(null);
        }
      } catch (error) {
        console.error("Failed to fetch payments:", error);
        setPaymentDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [userId]);

  const timeAgo = (createdDate: string): string => {
    const now = new Date();
    const created = new Date(createdDate);
    const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);

    if (diffInSeconds < 60) return "Now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
    return `${Math.floor(diffInMonths / 12)} year${diffInMonths !== 1 ? "s" : ""} ago`;
  };

  const closeView = () => {
    setView(null);
  }
  if (loading) {
    return <p className="min-h-[30vh] w-full flex items-center justify-center text-gray-500 text-sm">Loading payments...</p>;
  }

  if (!userId) {
    return <p className="min-h-[30vh] w-full flex items-center justify-center text-gray-500 text-sm">You need to log in to view payments.</p>;
  }

  return (
    <div className="px-8 pb-4">
      <h4 className="font-semibold text-sm mb-4 text-gray-700">My Payments</h4>
      <div className="overflow-x-auto bg-white rounded-md">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 text-gray-600 text-sm font-medium">
            <tr>
              <th className="py-3 px-6 text-left">Payment Id</th>
              <th className="py-3 px-6 text-left">Payment Method</th>
              <th className="py-3 px-6 text-left">Account</th>
              <th className="py-3 px-6 text-left">Transaction Id</th>
              <th className="py-3 px-6 text-left">Order</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Created Date</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {paymentDetails && paymentDetails.length > 0 ? (
              paymentDetails.map((payment) => {
                const flutterData = typeof payment.flutter_response === "string"
                  ? JSON.parse(payment.flutter_response)
                  : payment.flutter_response;

                return (
                  <tr key={payment.paymentId} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-6">#{payment.paymentId}</td>
                    <td className="py-3 px-6">{payment.paymentMethod}</td>
                    <td className="py-3 px-6">{payment.account}</td>
                    <td className="py-3 px-6">{payment.transactionId}</td>
                    <td className="py-3 px-6">#{payment.orderNumber}</td>
                    <td className="py-3 px-6">{`${payment.currency} ${payment.amount}`}</td>
                    <td className={`py-3 px-6`}>
                       <span  className={`px-2 py-1 rounded ${
                         payment.status == "Paid"
                            ? "text-teal-500"
                            : "text-orange-400 bg-orange-100"
                            }`}>
                             {payment.status || "Not paid"}
                        </span>
                    </td>
                    <td className="py-3 px-6">{timeAgo(payment.createdAt)}</td>
                    <td className="py-3 px-6 flex space-x-2">
                      <i className="bi bi-info-circle text-emerald-600 border border-emerald-400 bg-emerald-200 px-2 py-[2px] rounded" onClick={() => setView(payment)}></i>
                      {payment.status !== "Paid" && flutterData?.data?.paymentLinkUrl ? (
                        <>
                         <Link href={`/dash/orders/${payment.orderNumber}`} onClick={() => redirect(`/dash/orders${payment.orderNumber}`)} className="text-orange-600 border border-orange-400 bg-orange-200 px-2 py-[2px] rounded text-nowrap">View Order</Link>
                         <Link href={ flutterData?.data?.paymentLinkUrl} onClick={() => redirect(flutterData?.data?.paymentLinkUrl)} className="text-teal-600 border border-teal-400 bg-teal-200 px-2 py-[2px] rounded">Pay</Link>
                        </>
                       ):(
                        <>
                        <Link href={`/dash/orders/${payment.orderNumber}`} onClick={() => redirect(`/dash/orders${payment.orderNumber}`)} className="text-orange-600 border border-orange-400 bg-orange-200 px-2 py-[2px] rounded text-nowrap">View Order</Link>
                       
                       </>
                       )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan={8} className="py-4 text-center text-gray-500 italic">No payments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {view && <PaymentDetailsPopup payment={view} onClose={closeView}/>}
    </div>
  );
};

export default Transactions;
