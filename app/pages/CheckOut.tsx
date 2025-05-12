"use client"
import React, { useState, useEffect, useTransition } from 'react';
import Pay from '../comps/payments/pay';
import AlertNotification from '../comps/nav/notify';

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
  {name: "Mobile Money", icon: "/icons/mtn.png"},
  {name: "Airtel Money", icon: "/icons/airtel.jpeg"},
  {name: "Cards (Visa, MasterCard, American Express)", icon: "/icons/cards.png"},
]
const Checkout = ({ onAddLocationClick}: CheckOutProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string>('Mobile Money');
  const [orderAdded, setOrderAdd] = useState<boolean>(false);
  const [isOn, setIsOn] = useState(true);
  const [user, setUser] = useState<User | null>(null);  // Single user object instead of array
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [details, setDetails] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOpenPayment = () => {
      setIsPayModalOpen(true);
  };
  
  const handleClosePayment = () => {
      setIsPayModalOpen(false);
  };
   // Function to clear messages after a few seconds
 useEffect(() => {
  if (error || success) {
    const timer = setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 10000); // Hide after 4 seconds
    return () => clearTimeout(timer);
  }
}, [error, success]);

  useEffect(() => {
    const storedCartItems = localStorage.getItem('cart');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  const handleRemoveItem = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };



  const handleQuantityChange = (id: number, quantity: number) => {
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, amount: quantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    localStorage.removeItem('cart'); // Clear from localStorage
  };

  const calculateTotal = () => {
    let total = cartItems.reduce((acc, item) => acc + item.price * item.amount, 0).toFixed(2);
    //setTotalPrice(""+total);
    return total;
  };

  const splitData = (str: string): string | null => {
    if (str && str.includes(',')) {
      return str.split(",")[0];
    }
    return null;
  };

  const toggleSwitch = () => {
    setIsOn(!isOn);
  };

  useEffect(() => {
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    if (userSession && userSession.id) {
      const userId = userSession.id;
      
      // Fetch user data once when the user session is available
      const fetchUser = async () => {
        try {
          const response = await fetch(`/api/auth/user/${userId}`);
          const data = await response.json();
          setUser(data);  // Directly set the user data
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Error occured: "+error);
        }
      };

      fetchUser();
    }else{
      window.location.assign("/auth/login")
    }
  }, []); // Only run once on component mount
  function getLast(text: string): string {
    return text.slice(-3);
  }
  function removePrefix(email: string): string {
    const atIndex = email.indexOf('@'); // Find the index of the '@' symbol
    if (atIndex === -1) return email; // If no '@' is found, return the email as is
    
    // Get the part before and including the '@', and remove the first 3 characters before it
    const domainPart = email.slice(atIndex - 3); // Take the last 3 characters before '@' and everything after '@'
    return domainPart;
  }
  
      const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const { name, value } = e.target;
          setDetails(value);
      };


// Add this function inside the Checkout component
const handleCheckout = async () => {
  const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
  const userId = userSession.id;
  setLoading(true);
  if (!user) {
    setError("Your login session has expired! Sign in to proceed with checkout.");
    setLoading(false)
    return;
  }

  if(user.billingaddress === "" || !user.billingaddress){
    setError("Please add billing address");
    return;
  }

  const orderData = {
    user_id: userId,
    payment_method: selectedPayment,
    total_mount: calculateTotal(),
    delivery_allowed: isOn,
    details,
    billing_address: user.billingaddress + ", " + user.street1 + " - " + user.street2,
    shipping_address: null,
    shipping_fee: 0.00,
    discount: 0.00,
    orderDetails: cartItems.map((item) => ({
      product_id: item.id,
      unit_price: item.price,
      name: item.name,
      quantity: item.amount,
      size: item.size,
      color: item.color,
    })),
    email: user.email,
    name: user.first_name + " "+ user.last_name
  };

  const notifyData = {
    user_id: userId,
    event: "Order",
    content_text: `Dear customer, Your Order [${orderNumber}] has been successfully added! Your next step is to pay in order to boost delivery!`,
    action: "yes"
  }

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      setOrderAdd(true);
      setSuccess("Order added successfully")
      const data = await response.json();
      setOrderNumber(data.order.order_number);
      setLoading(false)
      clearCart();
      //handle payments
      handleOpenPayment();
    } else {
      const errorData = await response.json(); // Get the error message from the response
      setError("Error occured. "+errorData.message);
      setLoading(false);
    }

    if(orderAdded){
      try {
        const response = await fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notifyData),
        });
        if (response.ok) {console.log("Notification sent!")}
        setError(null);
      } catch (error) {
        setError("Error occured: "+error);
      }
    }
  } catch (error) {
   console.error("Error placing order:", error);
   setError("Error occured: "+error)
   setLoading(false);
  }
};


const handleButtonClick = async () => {
  if(cartItems.length > 0){
   try {
    
    await handleCheckout(); // Ensure handleCheckout completes successfully
   } catch (error) {
    setError(""+error);
   }
  } else {
    setError("Please add products to your cart to be able to place order");
  }
};
  
  return  (
    <div className="bg-slate-100 min-h-screen">
      <div className="checkout-page mx-auto px-4 sm:px-8 py-5">
        <h2 className="text-xl font-semibold mb-4 mt-5">Checkout</h2>
        <div className="flex flex-col sm:flex-row">
          {/* Left Side: Address, Payment, and Cart Items */}
          <div className="details flex flex-col-reverse w-full sm:w-4/6 lg:w-4/6 sm:flex-col" >
            <div className="flex flex-col sm:flex-row mb-3">
              {/* Address Box */}
              <div className="flex flex-col items-center justify-center text-center bg-white p-6 rounded-xl shadow-sm sm:w-1/2 mb-4 sm:mr-0 md:mr-0 lg:mr-3">
                <div className="p-3 rounded-full bg-slate-100 w-12 h-12 flex justify-center items-center">
                  <i className="bi bi-geo-alt text-2xl text-slate-600"></i>
                </div>
                {user && (user.billingaddress && user.billingaddress !== '') ? (
                  <div className="text-red-400">
                    <span className="text-sm font-bold text-black">Saved address</span>
                    <h4>{user.billingaddress}</h4>
                  </div>
                 ) : (
                  <div>
                    <span className="text-sm font-bold">No address saved</span>
                    <p className="m-0 text-slate-300 text-sm">Add an address so we can track your delivery!</p>
                    <button 
                     onClick={onAddLocationClick}
                     className="bg-red-300 text-white py-2 px-5 rounded-lg my-2"
                    >
                     Add new location
                    </button>
                  </div>
                )}

              </div>
              
              {/* Payment Method */}
              <div className="bg-white p-4 rounded-xl shadow-sm sm:w-1/2 mb-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-slate-700">Choose how to pay</h3>
                  <button className="text-red-500 font-medium cursor-no-drop" disabled>
                    <i className="bi bi-plus mr-2"></i>
                    Add new method
                  </button>
                </div>
                <div className="space-y-3 py-4">
                  {paymentMethods.map((method, i) => (
                    <div className="flex justify-between items-center" key={i}>
                      <label htmlFor="paymentMethod" className="flex items-center">
                        <div className="bg-slate-100 h-10 w-10 rounded-full mr-2">
                         {/** <i className="bi bi-paypal text-blue-500"></i> */}
                          <img src={method.icon} alt="" className='w-full h-full rounded-full object-cover'/>
                        </div>
                        <div>
                          <span className="font-medium text-sm">{method.name} <span className="ml-2"></span></span>
                          <p className="text-xs text-slate-300">Easy and fast</p>
                        </div>
                      </label>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.name}
                        checked={selectedPayment === method.name}
                        onChange={() => setSelectedPayment(method.name)}
                        className="form-radio h-5 w-5 text-red-600"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
  
            {/* Cart Items Section */}
            <div className="cartitems w-full bg-white p-6 rounded-xl shadow-sm mb-3">
              <h3 className="text-lg font-semibold mb-4">Cart Items ({cartItems.length})</h3>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 border-gray-200 pb-2">
                    <div className="bg-slate-100 w-16 h-16 rounded-md shadow-sm">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex justify-between w-full border-b py-2">
                      <div>
                        <h4 className="text-gray-800 font-medium my-1">{item.name}</h4>
                        <p className="text-sm text-gray-400 uppercase">{splitData(item.size)} - {splitData(item.color)}</p>
                        <p className="text-sm text-gray-800 font-semibold mt-1">RF {new Intl.NumberFormat("en-US").format(Number(item.price))} <span className="font-normal text-slate-400 text-xs">Per item</span></p>
                      </div>
                      <div className="flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <div className="bg-slate-100 flex justify-between items-center w-[70px] rounded-full py-[2px]">
                            <button onClick={() => handleQuantityChange(item.id, item.amount - 1)} className="bg-white rounded-full text-red-700 h-6 w-6 shadow text-center font-bold hover:bg-gray-100 transition">-</button>
                            <span>{item.amount}</span>
                            <button onClick={() => handleQuantityChange(item.id, item.amount + 1)} className="bg-white rounded-full text-red-700 h-6 w-6 shadow text-center font-bold hover:bg-gray-100 transition">+</button>
                          </div>
                          <button onClick={() => handleRemoveItem(item.id)} className="bi bi-trash text-red-600 hover:underline transition mx-2"></button>
                        </div>
                        <div className="total font-semibold">
                          RF {new Intl.NumberFormat("en-US").format(Number(item.price * item.amount))}.00
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
  
          {/* Right Side: Summary and Discount Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm w-full sm:w-2/6 h-max ml-0 sm:ml-3">
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            <div className="mb-3 border-b">
              <h4 className="mb-3 flex items-center font-semibold text-slate-900 bg-slate-50 rounded-md p-1">
                <i className="bi bi-person w-10 h-10 leading-9 text-center text-2xl text-sky-400 bg-sky-100 rounded-full mr-3"></i>
                Your profile
              </h4>
              <div className="flex justify-between mb-1 mx-2">
                <span className="text-gray-600">Name: </span>
                <span className="text-slate-400 text-sm text-right max-w-[80%]">{user?.first_name + " " + user?.last_name}</span>
              </div>
              <div className="flex justify-between mb-1 mx-2">
                <span className="text-gray-600">Email: </span>
                <span className="text-slate-400 text-sm text-right max-w-[80%]">{user?.email}</span>
              </div>
              <div className="flex justify-between mb-1 mx-2">
                <span className="text-gray-600">Address: </span>
                <span className="text-slate-500 text-xs text-right max-w-[70%]">{user?.billingaddress+", "+user?.street1+" - "+user?.street2}</span>
              </div>
            </div>
            <div className="flex justify-between py-6 border-b">
              <div className="flex items-center">
                <i className="bi bi-truck w-10 h-10 flex justify-center items-center text-center text-2xl text-sky-400 bg-sky-100 rounded-full mr-3"></i>
                <label>
                  <span className="font-medium">Allow Delivery</span>
                  <p className="text-xs text-slate-300"><i className="bi bi-fire"></i> We support delivery within 1 to 15 days</p>
                </label>
              </div>
              <button 
                onClick={toggleSwitch} 
                style={{
                  marginLeft: '10px',
                  padding: '10px 20px',
                  backgroundColor: isOn ? '#fca5a5' : '#ccc',
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: isOn ? 'flex-end' : 'flex-start',
                  width: '50px',
                  height: '24px',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    height: '20px',
                    width: '20px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    position: 'absolute',
                    transition: 'all 0.3s',
                    left: isOn ? '25px' : '5px',
                  }}
                />
              </button>
            </div>
            <div className="flex justify-between py-6 border-b">
              <div className="flex ">
                <i className="bi bi-info-circle w-10 h-10 flex justify-center items-center text-center text-2xl text-sky-400 bg-sky-100 rounded-full mr-3"></i>
                <label>
                  <span className="font-medium">Make it special</span>
                  <p className="text-xs text-slate-300"><i className="bi bi-fire"></i>Describe the details of your order in text - not required</p>
                  <textarea value={details} onChange={handleChange} name="details" id="details" placeholder='Enter details here' className='mr-10 border outline-none w-full mt-2 px-4 py-2 resize-y text-sm text-neutral-600 rounded-md'></textarea>
                </label>
                
              </div>
            </div>
            <div className="border-b">
              <h4 className="flex items-center shadow-sm py-2 my-2 rounded-md">
                <i className="bi bi-cart w-10 h-10 flex justify-center items-center text-center text-2xl text-sky-400 bg-sky-100 rounded-full mr-3"></i>
                <span>Order</span>
              </h4>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Total Items:</span>
                <span className="text-slate-700 font-bold">{cartItems.length}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Tax :</span>
                <span className="text-green-500">RF 0.00</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Shipping:</span>
                <span className="text-green-500">Free</span>
              </div>
            </div>
  
            <h4 className="text-lg font-semibold text-gray-800 flex justify-between">Total: <span className="text-right">RF {new Intl.NumberFormat("en-US").format(Number(calculateTotal()))}</span></h4>
            <div className="flex justify-between items-center my-2">
                <span className="text-gray-300">Payment Method:</span>
                <span className="text-sky-500 font-semibold">{selectedPayment}</span>
            </div>
            
            <button 
             onClick={handleButtonClick}
             className="mt-4 w-full bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-red-400 transition flex justify-center items-center"
             disabled={loading}
            >
              {loading && ( 
                <div className="w-5 h-5 border-2 mr-2 border-white border-dashed rounded-full animate-spin"></div>    
              )}
              Check Out
            </button>
          </div>
        </div>
      </div>

      {success && (<AlertNotification message={success} type="success" />)}
      {error && (<AlertNotification message={error} type="error" />)}

      {isPayModalOpen && (
      <Pay 
          orderNumber= {orderNumber}
          amount =  {calculateTotal()}
          paymentMethod = {selectedPayment}
          account ={""+user?.phone}
          address ={""+user?.billingaddress+", "+user?.street1}
          user_id ={""+user?.id}
          currency ='RWF'
          name = {user?.first_name + " "+ user?.last_name}
          email= {""+user?.email}
          onClose = {handleClosePayment} 
      />
    )}
    </div>
    
  );
}  
export default Checkout;
