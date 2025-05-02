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

const formatNumber = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${month}, ${day} ${year} ${hours}:${minutes}:${seconds}`;
}

const statusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "failed":
    case "canceled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const PaymentDetailsPopup: React.FC<PaymentDetailsProps> = ({ payment, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-teal-400 to-cyan-500 text-white">
            <h2 className="text-lg font-semibold">Payment Details</h2>
            <button
              onClick={onClose}
              className="bg-white text-teal-500 rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-gray-100 transition"
            >
              &times;
            </button>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto px-6 py-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColor(payment.status)}`}>
              {payment.status}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div><strong>Payment ID:</strong> {payment.paymentId}</div>
              <div><strong>Transaction ID:</strong> {payment.transactionId}</div>
              <div><strong>Order Number:</strong> {payment.orderNumber}</div>
              <div><strong>Account:</strong> {payment.account}</div>
              <div><strong>Name:</strong> {payment.name}</div>
              <div><strong>Email:</strong> {payment.email}</div>
              <div><strong>Address:</strong> {payment.address}</div>
              <div><strong>Provider:</strong> {payment.provider}</div>
              <div><strong>Payment Method:</strong> {payment.paymentMethod}</div>
              <div><strong>Tx Ref:</strong> {payment.tx_ref}</div>
              <div><strong>Amount:</strong> {formatNumber(payment.amount)} {payment.currency}</div>
              <div><strong>Details:</strong> {payment.details || "N/A"}</div>
              <div><strong>Payment Date:</strong> {formatDate(payment.paymentDate)}</div>
              <div><strong>Created At:</strong> {formatDate(payment.createdAt)}</div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t flex justify-end bg-gray-50">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition"
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
