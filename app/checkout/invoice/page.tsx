"use client"
import React, { useRef } from "react";
import Invoice from "@/app/comps/payments/invoice";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const InvoicePage: React.FC = () => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (invoiceRef.current) {
      const canvas = await html2canvas(invoiceRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
      pdf.save("invoice.pdf");
    }
  };

  // Sample Data
  const invoiceData = {
    orderId: "123456",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    companyName: "Bia eCommerce",
    companyAddress: "Kigali, Rwanda",
    items: [
      { name: "Handwoven Basket", price: 25, quantity: 2 },
      { name: "Traditional Fabric", price: 40, quantity: 1 },
    ],
    total: 90,
    paymentStatus: "Paid",
  };

  return (
    <div className="p-6">
      <div ref={invoiceRef}>
        <Invoice {...invoiceData} />
      </div>

      <div className="mt-4 flex gap-4">
        <button onClick={handleDownloadPDF} className="bg-green-600 text-white px-4 py-2 rounded">
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;
