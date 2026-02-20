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
  hashed_id: string;
}

interface Order {
  orderNumber: string;
  details: string;
  createdAt: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  payment_status: string;
  flutter_response: JSON;
  items: OrderItem[];
}

const formatNumber = (amount: number): string =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const statusBadge = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "delivered" || s === "approved") return "bg-emerald-50 text-emerald-600";
  if (s === "pending" || s === "processing") return "bg-amber-50 text-amber-600";
  return "bg-red-50 text-red-600";
};

const paymentBadge = (status: string) => {
  if (status?.toLowerCase() === "paid") return "bg-emerald-50 text-emerald-600";
  return "bg-amber-50 text-amber-600";
};

const SkeletonDetail = () => (
  <div className="min-h-screen animate-pulse">
    <div className="h-5 bg-gray-200 rounded w-32 mb-6"></div>
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-xl"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-100 rounded w-3/4"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-3 bg-gray-100 rounded w-24"></div>
            <div className="h-3 bg-gray-100 rounded w-20"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Order = ({ params }: { params: { orderNumber: string } }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.orderNumber}`);
        if (!response.ok) throw new Error("Failed to fetch order data");
        const data: { success: boolean; order: Order } = await response.json();
        setOrder(data.order);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (params.orderNumber) fetchOrder();
  }, [params.orderNumber]);

  const flutterData = order?.flutter_response
    ? typeof order.flutter_response === "string"
      ? JSON.parse(order.flutter_response)
      : order.flutter_response
    : null;

  if (loading) return <SkeletonDetail />;

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <i className="bi bi-exclamation-circle text-red-300 text-3xl"></i>
          <p className="text-[13px] text-red-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <i className="bi bi-bag-x text-gray-200 text-3xl"></i>
          <p className="text-[13px] text-gray-400 mt-2">Order not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <title>Order #{order.orderNumber}</title>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dash/orders"
          className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <i className="bi bi-chevron-left text-[14px] text-gray-600"></i>
        </Link>
        <div>
          <h1 className="text-[18px] font-bold text-gray-900">Order #{order.orderNumber}</h1>
          <p className="text-[12px] text-gray-400">
            {new Date(order.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
        {/* Order Items */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-[14px] font-bold text-gray-900">
              Order Items
              <span className="text-gray-400 font-normal ml-1.5">({order.items.length})</span>
            </h2>
            {order.details && (
              <p className="text-[12px] text-gray-400 mt-1">{order.details}</p>
            )}
          </div>

          <div className="divide-y divide-gray-50">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-gray-50 p-1.5 flex-shrink-0">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/products/${item.hashed_id}`}
                      className="text-[13px] font-medium text-gray-900 hover:text-gray-600 transition-colors truncate block"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {item.productCategory}
                      {item.color && ` · ${item.color}`}
                      {item.size && ` · ${item.size}`}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-[12px] text-gray-400">
                    {formatNumber(item.price)} x {item.quantity}
                  </p>
                  <p className="text-[14px] font-bold text-gray-900">
                    {formatNumber(item.price * item.quantity)}
                    <span className="text-[10px] text-gray-400 ml-0.5">RWF</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-max space-y-4">
          <h2 className="text-[14px] font-bold text-gray-900">Order Summary</h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-gray-400">Order Number</span>
              <span className="text-[13px] font-semibold text-gray-900">#{order.orderNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-gray-400">Total Items</span>
              <span className="text-[13px] font-medium text-gray-700">{order.items.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-gray-400">Payment Method</span>
              <span className="text-[13px] font-medium text-gray-700">{order.paymentMethod}</span>
            </div>

            <div className="border-t border-gray-100 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-gray-400">Status</span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium ${statusBadge(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[13px] text-gray-400">Payment Status</span>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium ${paymentBadge(order.payment_status)}`}>
                {order.payment_status}
              </span>
            </div>

            <div className="border-t border-gray-100 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-gray-400">Total Amount</span>
                <span className="text-[18px] font-extrabold text-gray-900">
                  {formatNumber(order.totalAmount)}
                  <span className="text-[11px] font-medium text-gray-400 ml-0.5">RWF</span>
                </span>
              </div>
            </div>
          </div>

          {order.payment_status !== "Paid" && flutterData?.data?.paymentLinkUrl && (
            <a
              href={flutterData.data.paymentLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 bg-gray-900 hover:bg-gray-800 text-white text-[13px] font-bold rounded-2xl transition-colors"
            >
              Pay Now
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
