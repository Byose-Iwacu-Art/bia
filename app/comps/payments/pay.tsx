"use client"

import React, { useEffect, useState } from "react";
import AlertNotification from "../nav/notify";
import { redirect } from "next/navigation";

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
    const [messageType, setMessageType] = useState<'success' | 'error' | 'info' >('info');
    const [loading, setLoading] = useState<boolean>(false);
    const [name, setName] = useState(initialName);
    const [accountInput, setAccountInput] = useState(account);
    const [link, setLink] = useState("");

    if(account[2] !== "5"){
        account = "+250"+account;
    }
      // Clear the cart
  const clearCart = () => {
    localStorage.removeItem('cart'); // Clear from localStorage
  };
    const handlePayment = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderNumber,
                    amount,
                    paymentMethod,
                    account: accountInput,
                    currency,
                    email,
                    name,
                    user_id,
                    address,
                }),
            });

            const data = await response.json();

            if (data.message.includes('success')) {
                setMessageType('success');
                setResponseMessage(data.message + " Redirecting ...");
                setLink(data.redirect);
                clearCart();
                setLoading(false);
            } else {
                setResponseMessage(data.message);
                setMessageType('error');
                setLoading(false)
            }
        } catch (error) {
            console.error('Payment API error:', error);
            setResponseMessage('Something went wrong. Please try again later.'+error);
            setMessageType('error');
            setLoading(false)
        }
    };
    useEffect(() => {
        if(link !== ""){
            window.location.assign(link)
        }
    },[link])
    
    return (
        <>
         {/* Notify the response */}
         {responseMessage && (  <AlertNotification message={responseMessage} type={messageType}/>)}
                
        <div className="fixed flex justify-center items-center w-full h-full top-0 left-0 z-50 backdrop-blur-sm bg-opacity-50">
          <div className="bg-white px-8 py-5 w-[96%] max-w-[500px] md:w-[35vw] h-auto shadow-2xl flex flex-col space-y-3">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition duration-200">
                    <i className="bi bi-x-circle text-2xl" />
                </button>

                {/* Header */}
                <h2 className="text-3xl font-semibold text-gray-800 text-center">Complete Your Payment</h2>
                <p className="text-center text-gray-600">Review your order details below</p>

                <div className="space-y-3">
                    <div>
                        <label className="block text-gray-600 text-sm mb-2">Order Number</label>
                        <input 
                            type="text" 
                            value={orderNumber} 
                            disabled 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" 
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm mb-2">Amount</label>
                        <input 
                            type="text" 
                            value={amount} 
                            disabled 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" 
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm mb-2">Full Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm mb-2">Account</label>
                        <input 
                            type="text" 
                            value={accountInput} 
                            onChange={(e) => setAccountInput(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                </div>

               
                {/* Response Message */}
                {responseMessage && (
                    <div className={`px-4 py-2 text-sm rounded-lg text-white ${messageType === 'success' ? 'bg-green-400' : messageType === 'error' ? 'bg-red-400' : 'bg-yellow-400'}`}>
                        <p>{responseMessage}</p>
                    </div>
                )}
                {/* Proceed Payment Button */}
                <button
                    onClick={handlePayment}
                    className="w-full py-3 px-6 bg-pink-500 text-white font-semibold rounded-lg shadow-lg hover:bg-pink-700 transition duration-300"
                    disabled={loading}
                >
              {loading ? (
                <span className="loader border-t-2 border-r-2 border-white border-solid rounded-full h-5 w-5 animate-spin"></span>
              ) : (
                "Proceed to pay"
              )}
                </button>
            </div>
        </div>
        </>
    );
};

export default Pay;
