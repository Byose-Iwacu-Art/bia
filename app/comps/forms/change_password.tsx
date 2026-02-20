"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import AlertNotification from "../nav/notify";

type PasswordChangeProps = {
  onClose: () => void;
};

export const PasswordChangeModal = ({ onClose }: PasswordChangeProps) => {
  const [prevPass, setPrevPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChangePassword = async () => {
    if (newPass !== confirmPass) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const userSession = JSON.parse(localStorage.getItem("userSession") || "{}");
      if (userSession?.id) {
        const response = await fetch("/api/auth/update/change_password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prevPassword: prevPass, password: newPass, id: userSession.id }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to change password");
        }

        setSuccess("Password updated successfully! Redirecting...");
        setTimeout(() => {
          window.location.assign("/dash/profile");
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full py-3 px-4 border border-gray-200 rounded-xl text-[13px] text-gray-700 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all placeholder:text-gray-400";

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gray-900 px-6 py-5 text-white flex justify-between items-center">
          <div>
            <h2 className="text-[16px] font-bold">Change Password</h2>
            <p className="text-[12px] text-gray-400 mt-0.5">Enter your current and new password</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <i className="bi bi-x-lg text-[12px] text-white"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && <AlertNotification message={error} type="error" />}
          {success && <AlertNotification message={success} type="success" />}

          <div>
            <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">Current Password</label>
            <input
              type="password"
              value={prevPass}
              onChange={(e) => setPrevPass(e.target.value)}
              placeholder="Enter current password"
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">New Password</label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Enter new password"
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-gray-500 mb-1.5 block">Confirm Password</label>
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Confirm new password"
              className={inputClass}
            />
          </div>

          <button
            onClick={handleChangePassword}
            disabled={loading}
            className={`w-full py-3 bg-gray-900 hover:bg-gray-800 text-white text-[13px] font-bold rounded-xl transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
