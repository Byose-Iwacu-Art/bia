"use client"
import React, { useState, useEffect } from 'react';
import Pay from '../comps/payments/pay';
import AlertNotification from '../comps/nav/notify';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface CartItem {
  id: number;
  name: string;
  size: string;
  color: string;
  price: number;
  amount: number;
  image: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  phone: number;
  email: string;
  billingaddress: string;
  street1: string;
  street2: string;
}

interface CheckOutProps {
  onAddLocationClick: () => void;
}

const paymentMethods = [
  { name: "Mobile Money", icon: "/icons/mtn.png" },
  { name: "Airtel Money", icon: "/icons/airtel.jpeg" },
  { name: "Cards (Visa, MasterCard, American Express)", icon: "/icons/cards.png" },
];

const fmt = (n: number) => new Intl.NumberFormat("en-US").format(Math.round(Number(n)));

const Checkout = ({ onAddLocationClick }: CheckOutProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string>('Mobile Money');
  const [orderAdded, setOrderAdd] = useState<boolean>(false);
  const [isOn, setIsOn] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [details, setDetails] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOpenPayment = () => setIsPayModalOpen(true);
  const handleClosePayment = () => setIsPayModalOpen(false);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => { setError(null); setSuccess(null); }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setCartItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    if (userSession?.id) {
      fetch(`/api/auth/user/${userSession.id}`)
        .then(r => r.json())
        .then(data => setUser(data))
        .catch(err => setError("Error fetching user: " + err));
    }
  }, []);

  const handleRemoveItem = (id: number) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    const qty = Math.max(1, quantity);
    const updated = cartItems.map(item => item.id === id ? { ...item, amount: qty } : item);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const clearCart = () => localStorage.removeItem('cart');

  const calculateTotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.amount, 0).toFixed(2);

  const TAX_RATE = 0.18;
  const getTotal    = () => Number(calculateTotal());
  const getTax      = () => Math.round(getTotal() * TAX_RATE * 100) / 100;
  const getSubtotal = () => Math.round((getTotal() - getTax()) * 100) / 100;

  const splitData = (str: string): string | null => {
    if (str && str.includes(',')) return str.split(",")[0];
    return str || null;
  };

  const toggleSwitch = () => setIsOn(!isOn);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDetails(e.target.value);
  };

  const handleCheckout = async () => {
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    const userId = userSession.id;
    setLoading(true);

    if (!user) {
      setError("Your session has expired. Please sign in again.");
      setLoading(false);
      return;
    }
    if (!user.billingaddress) {
      setError("Please add a delivery address first.");
      setLoading(false);
      return;
    }

    const orderData = {
      user_id: userId,
      payment_method: selectedPayment,
      total_mount: calculateTotal(),
      delivery_allowed: isOn,
      details,
      billing_address: `${user.billingaddress}, ${user.street1} - ${user.street2}`,
      shipping_address: null,
      shipping_fee: 0.00,
      discount: 0.00,
      orderDetails: cartItems.map(item => ({
        product_id: item.id,
        unit_price: item.price,
        name: item.name,
        quantity: item.amount,
        size: item.size,
        color: item.color,
      })),
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (response.ok) {
        const data = await response.json();
        setOrderAdd(true);
        setSuccess("Order placed successfully!");
        setOrderNumber(data.order.order_number);
        setLoading(false);
        clearCart();
        handleOpenPayment();
      } else {
        const err = await response.json();
        setError("Error: " + err.message);
        setLoading(false);
      }
    } catch (err) {
      setError("Error placing order: " + err);
      setLoading(false);
    }
  };

  const handleButtonClick = async () => {
    if (cartItems.length > 0) {
      try { await handleCheckout(); }
      catch (err) { setError("" + err); }
    } else {
      setError("Add products to your cart before placing an order.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[22px] sm:text-2xl font-extrabold text-gray-900 tracking-tight">Checkout</h1>
          <span className="text-[13px] text-gray-400 font-medium">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">

          {/* ════ LEFT COLUMN ════ */}
          <div className="space-y-4">

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="bi bi-geo-alt text-gray-600 text-[14px]"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-[15px]">Delivery Address</h3>
                </div>
                {user?.billingaddress && (
                  <button
                    onClick={onAddLocationClick}
                    className="text-[12px] text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1"
                  >
                    <i className="bi bi-pencil text-[11px]"></i> Edit
                  </button>
                )}
              </div>

              {user?.billingaddress ? (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-[14px] font-semibold text-gray-800">{user.billingaddress}</p>
                  <p className="text-[13px] text-gray-400 mt-0.5">
                    {user.street1}{user.street2 ? ` — ${user.street2}` : ''}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <i className="bi bi-geo-alt text-gray-400 text-2xl"></i>
                  </div>
                  <p className="text-[14px] font-semibold text-gray-700 mb-1">No delivery address saved</p>
                  <p className="text-[13px] text-gray-400 mb-4">Add your address so we can deliver your order</p>
                  <button
                    onClick={onAddLocationClick}
                    className="bg-gray-900 hover:bg-gray-800 active:scale-[0.98] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-all"
                  >
                    Add Location
                  </button>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="bi bi-credit-card text-gray-600 text-[14px]"></i>
                </div>
                <h3 className="font-semibold text-gray-900 text-[15px]">Payment Method</h3>
              </div>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    onClick={() => setSelectedPayment(method.name)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${
                      selectedPayment === method.name
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}
                  >
                    <img src={method.icon} alt={method.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-gray-800 leading-tight">{method.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Easy and fast</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      selectedPayment === method.name ? 'border-gray-900' : 'border-gray-200'
                    }`}>
                      {selectedPayment === method.name && (
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="bi bi-bag text-gray-600 text-[14px]"></i>
                </div>
                <h3 className="font-semibold text-gray-900 text-[15px]">Order Items</h3>
                <span className="ml-auto text-[12px] text-gray-400">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
              </div>

              {cartItems.length === 0 ? (
                <p className="text-center text-gray-400 text-[14px] py-8">Your cart is empty</p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                        {(splitData(item.size) || splitData(item.color)) && (
                          <p className="text-[11px] text-gray-400 uppercase tracking-wider mt-0.5">
                            {splitData(item.size)}{splitData(item.color) ? ` · ${splitData(item.color)}` : ''}
                          </p>
                        )}
                        <p className="text-[13px] font-bold text-emerald-600 mt-1">{fmt(item.price)} RWF</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <i className="bi bi-trash3 text-[13px]"></i>
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.amount - 1)}
                            className="w-6 h-6 rounded-full bg-gray-900 text-white text-[13px] font-bold flex items-center justify-center hover:bg-gray-700 transition-colors"
                          >−</button>
                          <span className="text-[13px] font-semibold text-gray-700 w-5 text-center">{item.amount}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.amount + 1)}
                            className="w-6 h-6 rounded-full bg-gray-900 text-white text-[13px] font-bold flex items-center justify-center hover:bg-gray-700 transition-colors"
                          >+</button>
                        </div>
                        <p className="text-[12px] font-bold text-gray-700">{fmt(item.price * item.amount)} RWF</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ════ RIGHT COLUMN ════ */}
          <div className="space-y-4 lg:self-start lg:sticky lg:top-[calc(165px+8px)]">

            {/* Profile */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white text-[13px] font-extrabold flex-shrink-0">
                  {user ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() : '?'}
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-gray-900 truncate">{user?.first_name} {user?.last_name}</p>
                  <p className="text-[12px] text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
              {user?.billingaddress && (
                <p className="text-[12px] text-gray-400 mt-3 flex items-start gap-1">
                  <i className="bi bi-geo-alt flex-shrink-0 mt-0.5"></i>
                  <span className="line-clamp-2">{user.billingaddress}, {user.street1}</span>
                </p>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 text-[15px] mb-4">Order Summary</h3>

              <div className="space-y-2.5 mb-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-start gap-2">
                    <span className="text-[12px] text-gray-600 line-clamp-1 flex-1">{item.name} × {item.amount}</span>
                    <span className="text-[12px] font-medium text-gray-700 flex-shrink-0">{fmt(item.price * item.amount)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-2">
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-700 font-medium">{fmt(getSubtotal())} RWF</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500">Tax (18%)</span>
                  <span className="text-gray-700 font-medium">{fmt(getTax())} RWF</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-bold text-gray-900">Total</span>
                  <div className="text-right">
                    <span className="text-[20px] font-extrabold text-gray-900">{fmt(getTotal())}</span>
                    <span className="text-[12px] text-gray-400 ml-1">RWF</span>
                  </div>
                </div>
                <p className="text-[12px] text-gray-400 mt-1">Payment via {selectedPayment}</p>
              </div>
            </div>

            {/* Delivery Toggle + Notes */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold text-gray-800">Allow Delivery</p>
                  <p className="text-[12px] text-gray-400">1–15 days delivery</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={isOn} onChange={toggleSwitch} className="sr-only peer" />
                  <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-gray-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 after:shadow-sm"></div>
                </label>
              </div>

              <div>
                <label className="text-[13px] font-medium text-gray-700 mb-1.5 block">
                  Order Notes <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={details}
                  onChange={handleChange}
                  name="details"
                  placeholder="Any special instructions for your order..."
                  className="w-full border border-gray-200 outline-none px-4 py-3 resize-none text-[13px] text-gray-700 rounded-xl focus:border-gray-400 transition-colors placeholder:text-gray-300"
                  rows={3}
                />
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              onClick={handleButtonClick}
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-4 rounded-2xl text-[15px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20 active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Place Order <i className="bi bi-arrow-right"></i></>
              )}
            </button>
          </div>
        </div>
      </div>

      {success && <AlertNotification message={success} type="success" />}
      {error && <AlertNotification message={error} type="error" />}

      {isPayModalOpen && (
        <Pay
          orderNumber={orderNumber}
          amount={calculateTotal()}
          paymentMethod={selectedPayment}
          account={"" + user?.phone}
          address={"" + user?.billingaddress + ", " + user?.street1}
          user_id={"" + user?.id}
          currency="RWF"
          name={`${user?.first_name} ${user?.last_name}`}
          email={"" + user?.email}
          onClose={handleClosePayment}
        />
      )}
    </div>
  );
}

export default Checkout;
