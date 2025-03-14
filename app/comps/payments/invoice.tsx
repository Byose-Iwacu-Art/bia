import React from "react";

interface InvoiceProps {
  orderId: string;
  customerName: string;
  customerEmail: string;
  companyName: string;
  companyAddress: string;
  items: { name: string; price: number; quantity: number }[];
  total: number;
  paymentStatus: string;
}

const Invoice: React.FC<InvoiceProps> = ({
  orderId,
  customerName,
  customerEmail,
  companyName,
  companyAddress,
  items,
  total,
  paymentStatus,
}) => {
  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold mb-2">Invoice</h2>
      <p className="text-sm">Order ID: {orderId}</p>
      <hr className="my-2" />

      <h3 className="font-semibold">Customer Details:</h3>
      <p>{customerName}</p>
      <p className="text-sm text-gray-600">{customerEmail}</p>

      <h3 className="font-semibold mt-4">Company Details:</h3>
      <p>{companyName}</p>
      <p className="text-sm text-gray-600">{companyAddress}</p>

      <h3 className="font-semibold mt-4">Order Details:</h3>
      <table className="w-full text-sm mt-2 border-collapse border">
        <thead>
          <tr className="border">
            <th className="p-2 text-left">Item</th>
            <th className="p-2 text-right">Qty</th>
            <th className="p-2 text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border">
              <td className="p-2">{item.name}</td>
              <td className="p-2 text-right">{item.quantity}</td>
              <td className="p-2 text-right">${item.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-right font-semibold mt-2">Total: ${total.toFixed(2)}</p>
      <p className={`text-right font-semibold mt-2 ${paymentStatus === "Paid" ? "text-green-500" : "text-red-500"}`}>
        Status: {paymentStatus}
      </p>
    </div>
  );
};

export default Invoice;
