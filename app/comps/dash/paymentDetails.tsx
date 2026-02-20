"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentDetailsProps {
  payment: {
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
  };
  onClose: () => void;
}

const formatNumber = (amount: number): string =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const statusBadge = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "paid" || s === "completed") return "bg-emerald-50 text-emerald-600";
  if (s === "pending") return "bg-amber-50 text-amber-600";
  return "bg-red-50 text-red-600";
};

const FIELDS = [
  { label: "Payment ID", key: "paymentId", icon: "bi-hash" },
  { label: "Transaction ID", key: "transactionId", icon: "bi-upc-scan" },
  { label: "Order Number", key: "orderNumber", icon: "bi-bag" },
  { label: "Account", key: "account", icon: "bi-phone" },
  { label: "Name", key: "name", icon: "bi-person" },
  { label: "Email", key: "email", icon: "bi-envelope" },
  { label: "Address", key: "address", icon: "bi-geo-alt" },
  { label: "Provider", key: "provider", icon: "bi-building" },
  { label: "Method", key: "paymentMethod", icon: "bi-credit-card" },
  { label: "Tx Ref", key: "tx_ref", icon: "bi-link-45deg" },
  { label: "Details", key: "details", icon: "bi-file-text" },
  { label: "Payment Date", key: "paymentDate", icon: "bi-calendar-event", format: true },
  { label: "Created At", key: "createdAt", icon: "bi-clock", format: true },
] as const;

const PaymentDetailsPopup: React.FC<PaymentDetailsProps> = ({ payment, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gray-900 px-6 py-5 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-[16px] font-bold">Payment Details</h2>
                <p className="text-[12px] text-gray-400 mt-0.5">Transaction #{payment.paymentId}</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <i className="bi bi-x-lg text-[12px] text-white"></i>
              </button>
            </div>

            {/* Amount + Status */}
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider">Amount</p>
                <p className="text-[28px] font-extrabold text-emerald-400 leading-tight">
                  {formatNumber(payment.amount)}
                  <span className="text-[13px] font-medium text-gray-400 ml-1">{payment.currency}</span>
                </p>
              </div>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium ${statusBadge(payment.status)}`}>
                {payment.status}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 px-6 py-4 space-y-2">
            {FIELDS.map((field) => {
              const value = (payment as any)[field.key];
              if (!value && value !== 0) return null;
              return (
                <div key={field.key} className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-3">
                  <i className={`bi ${field.icon} text-[14px] text-gray-400 flex-shrink-0`}></i>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-gray-400 uppercase tracking-wider">{field.label}</p>
                    <p className="text-[13px] font-medium text-gray-700 truncate">
                      {field.format ? formatDate(String(value)) : String(value) || "N/A"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-[13px] font-bold rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentDetailsPopup;
