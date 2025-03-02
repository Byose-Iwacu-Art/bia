"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Payments({ params }: { params: { tid: string } }) {
  const tidParts = params.tid.split("_");
  const a = tidParts[0];
  const b = tidParts[1];

  const [formData, setFormData] = useState({
    tid: a,
    account: b,
    status: "",
    name: "",
    email: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [decodedResp, setDecodedResp] = useState<Record<string, any> | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const searchParams = useSearchParams();
  const resp = searchParams.get("resp");

  // ✅ Load name & email first
  useEffect(() => {
    const userSession = JSON.parse(localStorage.getItem("userSession") || "{}");
    if (userSession?.email) {
      setFormData((prev) => ({
        ...prev,
        name: userSession.name || "",
        email: userSession.email,
      }));
    }
  }, []);

  // ✅ Process payment response & submit after email is set
  useEffect(() => {
    if (resp && formData.email) {
      try {
        const decoded = decodeURIComponent(resp);
        const parsed = JSON.parse(decoded);
        setDecodedResp(parsed);

        let status = "Pending";
        if (parsed.message.includes("Insufficient Fund")) {
          setResponseMessage("Insufficient Fund");
          status = "Failed";
        } else if (parsed.message.includes("Fetched")) {
          setResponseMessage("Payment successfully! Thank you");
          status = "Paid";
        } else if (parsed.message.includes("Verification pending")) {
          setResponseMessage("You canceled payment! Try again");
          status = "Canceled";
        } else {
          setResponseMessage("Failed, Try again!");
        }

        // ✅ Ensure `name` & `email` are included
        const updatedFormData = { ...formData, status };
        setFormData(updatedFormData);

        handleSubmit(updatedFormData);
      } catch (error) {
        console.error("Failed to decode or parse resp:", error);
      }
    }
  }, [resp, formData.email]); // ✅ Only run when `resp` & `email` exist

  // ✅ Handle form submission
  const handleSubmit = async (updatedFormData: typeof formData) => {
    try {
      const response = await fetch("/api/payments/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFormData),
      });

      if (response.ok) {
        console.log("Success");
        setIsSuccess(true);
      }

      try {
        const userSession = JSON.parse(localStorage.getItem("userSession") || "{}");
        const userId = userSession.id;
        const notifyData = {
          user_id: userId,
          event: "Order",
          content_text: `Your payment to Order [${b}] with transaction reference: [${a}]. ${
            updatedFormData.status === "Paid"
              ? "Has been paid successfully"
              : updatedFormData.status === "Failed"
              ? "Has failed"
              : "Is still pending, please complete your payment"
          }!`,
          action: updatedFormData.status === "Paid" ? "no" : "yes",
        };

        const notifyResponse = await fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notifyData),
        });

        if (notifyResponse.ok) {
          console.log("Notified");
        }
      } catch (error: any) {
        console.error("Notifying error:", error);
      }
    } catch (error: any) {
      setIsSuccess(false);
      console.error("Form submission failed:", error);
    }
  };

  return (
    <>
      <head>
        <title>Checkout Payment Results</title>
      </head>
      <div className="fixed flex justify-center items-center w-full h-full top-0 left-0 z-50 backdrop-blur-sm bg-opacity-50">
          <div className="bg-white px-8 py-5 w-[96%] max-w-[500px] md:w-[35vw] h-auto shadow-2xl flex flex-col space-y-3">

          {/* Payment details */}
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-3xl font-bold">Payments Results</h2>
            {/* Response Message */}
            {responseMessage && (
              <div
                className={`p-4 w-full text-center rounded-lg mt-4 ${
                  responseMessage.includes("success")
                    ? "bg-green-400  text-white font-semibold"
                    : "text-red-400 text-lg font-bold"
                }`}
              >
                <p>{responseMessage}</p>
              </div>
            )}
          </div>

          {/* Proceed Payment Button */}
          <Link
            href={`/dash/orders/${b}`}
            className="w-full py-3 px-6 text-center bg-teal-500 font-semibold rounded-lg shadow-lg hover:bg-pink-700 transition duration-300"
          >
            Go back <i className="bi bi-left-arrow"></i>
          </Link>
        </div>
      </div>
    </>
  );
}
