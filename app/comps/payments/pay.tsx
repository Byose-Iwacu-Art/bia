"use client"

import React, { useEffect, useState } from "react";
import AlertNotification from "../nav/notify";
import 'bootstrap-icons/font/bootstrap-icons.css';

interface PayProps {
    orderNumber: string;
    amount: string;
    paymentMethod: string;
    account: string;
    currency: string;
    email: string;
    name: string;
    user_id: string;
    address: string;
    onClose: () => void;
}

const fmt = (n: number) => new Intl.NumberFormat("en-US").format(Math.round(n));

const Pay: React.FC<PayProps> = ({
    orderNumber,
    amount,
    paymentMethod,
    account,
    currency,
    email,
    name: initialName,
    user_id,
    address,
    onClose,
}) => {
    const [responseMessage, setResponseMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
    const [loading, setLoading] = useState<boolean>(false);
    const [name, setName] = useState(initialName);
    const [accountInput, setAccountInput] = useState(account);
    const [link, setLink] = useState<string | null>(null);

    useEffect(() => {
        if (responseMessage) {
            const timer = setTimeout(() => setResponseMessage(null), 10000);
            return () => clearTimeout(timer);
        }
    }, [responseMessage]);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const response: any = await fetch('/api/payments/irembo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderNumber, amount, paymentMethod,
                    account: accountInput, currency, email, name, user_id, address,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessageType('success');
                setResponseMessage(data.message);
                setLink(data.paymentLinkUrl);
            } else {
                setResponseMessage(data.message);
                setMessageType('error');
            }
        } catch (error) {
            setResponseMessage('Something went wrong. Please try again later.' + error);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (link) window.location.assign("" + link);
    }, [link]);

    const methodIcon: Record<string, string> = {
        MTN: 'bi-phone-fill',
        Airtel: 'bi-phone',
        Card: 'bi-credit-card',
    };

    return (
        <>
            {responseMessage && <AlertNotification message={responseMessage} type={messageType} />}

            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]"
                onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            >
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[460px] overflow-hidden">

                    {/* Dark header */}
                    <div className="bg-gray-900 px-6 py-5 relative">
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                        >
                            <i className="bi bi-x-lg text-[12px]"></i>
                        </button>

                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                <i className="bi bi-lock-fill text-emerald-400 text-[14px]"></i>
                            </div>
                            <div>
                                <p className="text-white font-bold text-[16px] leading-tight">Complete Payment</p>
                                <p className="text-gray-400 text-[12px] mt-0.5">Order #{orderNumber}</p>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-5 space-y-5">

                        {/* Amount card */}
                        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 text-center">
                            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-1">Amount Due</p>
                            <p className="text-[36px] font-extrabold text-emerald-600 leading-none">
                                {fmt(Number(amount))}
                            </p>
                            <p className="text-[12px] text-gray-400 font-medium mt-1">{currency}</p>
                        </div>

                        {/* Payment method pill */}
                        <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                            <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                                <i className={`bi ${methodIcon[paymentMethod] ?? 'bi-credit-card'} text-white text-[11px]`}></i>
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-400 leading-none mb-0.5">Payment Method</p>
                                <p className="text-[13px] font-semibold text-gray-800">{paymentMethod} MoMo</p>
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="space-y-3">
                            <div>
                                <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Account Number</label>
                                <div className="relative">
                                    <i className="bi bi-phone absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[13px] pointer-events-none"></i>
                                    <input
                                        type="text"
                                        value={accountInput}
                                        onChange={(e) => setAccountInput(e.target.value)}
                                        placeholder="e.g. 0781234567"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-[14px] outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[12px] font-medium text-gray-500 mb-1.5">Full Name</label>
                                <div className="relative">
                                    <i className="bi bi-person absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[13px] pointer-events-none"></i>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your full name"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-[14px] outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Inline error/success */}
                        {responseMessage && (
                            <div className={`flex items-start gap-2 px-4 py-2.5 rounded-xl text-[13px] border ${
                                messageType === 'success'
                                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                    : messageType === 'error'
                                    ? 'bg-red-50 border-red-100 text-red-600'
                                    : 'bg-gray-50 border-gray-100 text-gray-600'
                            }`}>
                                <i className={`bi ${messageType === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'} flex-shrink-0 mt-0.5`}></i>
                                <span>{responseMessage}</span>
                            </div>
                        )}

                        {/* CTA */}
                        <button
                            onClick={handlePayment}
                            disabled={loading}
                            className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-4 rounded-2xl text-[15px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20 active:scale-[0.98]"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <><i className="bi bi-shield-check"></i> Confirm Payment</>
                            )}
                        </button>

                        <p className="text-center text-[12px] text-gray-400">
                            <i className="bi bi-lock mr-1"></i>
                            Secured by Irembo Pay
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Pay;
