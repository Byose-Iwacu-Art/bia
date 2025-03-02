"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface OrderItem {
  productId: number;
  productName: string;
  productImage: string;
  productCategory: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
 
}

interface Order {
  orderNumber: string;
  createdAt: string;
  totalAmount: number;
  paymentMethod: string;
  status: string; 
  payment_status: string;
  flutter_response: JSON;
  items: OrderItem[];
}

const Order = ({ params }: { params: { orderNumber: string } }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.orderNumber}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order data");
        }
        const data: { success: boolean; order: Order } = await response.json();
        setOrder(data.order);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.orderNumber) {
      fetchOrder();
    }
  }, [params.orderNumber]);

  const flutterData = order?.flutter_response 
  ? typeof order.flutter_response === "string" 
    ? JSON.parse(order.flutter_response) 
    : order.flutter_response 
  : null;

  if (loading) {
    return <p className="text-gray-500 text-sm text-center w-full">Loading order...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-sm text-center w-full">{error}</p>;
  }

  if (!order) {
    return <p className="text-gray-500 text-sm text-center w-full">Order not found</p>;
  }
  
  return (
    <div className="ml-[60px] sm:ml-[200px] mt-[80px] py-8 bg-slate-50">
      <head>
        <title>Order Details </title>
      </head>
      <div className="px-8 pb-4">
        <h4 className="font-semibold text-sm mb-4 text-gray-700">Order Detail #{order.orderNumber}</h4>
        <div className="flex justify-between">
          {/* Order Items */}
          <div className="overflow-x-auto bg-white rounded-md p-4 w-[55vw]">
            <div className="head">
              <h4 className="font-semibold text-sm mb-4 text-gray-700">Order Items</h4>
            </div>
            <div className="details">
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between border border-b-0 rounded-lg space-x-2 items-center p-2"
                >
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-md bg-slate-50 p-2 mr-2">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <Link href={`/products/${item.productId}`} className="text-base mb-2">
                        {item.productName}
                      </Link>
                      <span className="text-slate-400 text-sm">
                        {item.productCategory} | {item.color} | {item.size}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 font-medium text-sm">
                      RF{item.price} x {item.quantity}
                    </span>
                    <h4 className="font-semibold">RF {item.price * item.quantity}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-lg bg-white p-5 space-y-2 w-[23vw] h-max">
            <h4 className="font-semibold text-sm mb-4 text-gray-700">Order Summary</h4>
            <div>
              <ul className="space-y-3">
                <li className="flex justify-between items-center">
                  <h4 className="text-slate-500">Order Number: </h4>
                  <span className="">#{order.orderNumber}</span>
                </li>
                <li className="flex justify-between items-center">
                  <h4 className="text-slate-500">Total Items: </h4>
                  <span className="font-medium">{order.items.length}</span>
                </li>
                <li className="flex justify-between items-center">
                  <h4 className="text-slate-500">Total Amount: </h4>
                  <span className="font-medium">RF {order.totalAmount}</span>
                </li>
                <li className="flex justify-between items-center">
                  <h4 className="text-slate-500">Status: </h4>
                  <span
                    className={`py-1 px-2 rounded-md text-sm ${
                      order.status === "Pending"
                        ? "bg-orange-100 text-orange-500"
                        : "bg-green-100 text-green-500"
                    }`}
                  >
                    {order.status}
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <h4 className="text-slate-500">Payment tatus: </h4>
                  <span
                    className={`py-1 px-2 rounded-md text-sm ${
                      order.payment_status === "Paid"
                        ? "bg-teal-100 text-teal-500"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {order.payment_status}
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <h4 className="text-slate-500">Payment Method: </h4>
                  <span className="text-teal-300 text-sm">{order.paymentMethod}</span>
                </li>
              </ul>
              {order.payment_status !== "Paid" && (
                <div className="w-full text-center p-2 rounded-lg my-2 bg-sky-400 text-white">
                  <a href={flutterData.meta.authorization.redirect} target="_blank" rel="noopener noreferrer">Pay Now</a>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
