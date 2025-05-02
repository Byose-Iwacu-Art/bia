import { NextRequest, NextResponse } from "next/server";
import client from "../db";
import { sendOrderPaymentsEmail } from "../utils/config";
import { sendInvoice } from "../utils/invoice";
const Flutterwave = require("flutterwave-node-v3");

// Helper function to hash the password using SHA-256
async function hashTransaction(txt: string): Promise<string> {
  const textEncoder = new TextEncoder();
  const encoded = textEncoder.encode(txt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

function generateUniqueId(): number {
  const min = 1000000000; // Minimum value (10 digits)
  const max = 9999999999; // Maximum value (10 digits)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const {
      orderNumber,
      amount,
      paymentMethod,
      account,
      currency,
      email,
      name,
      user_id,
      address,
    } = await req.json();
    
    // Validate required fields
   

    // Generate references and initialize Flutterwave
    const tx_ref = await hashTransaction(orderNumber);
    const transaction_id = generateUniqueId();
    const details = "Order Cart Items Payment";
    const tax = amount * 0.035;
    const provider = "Flutterwave";
    const created_at = new Date();
    const flw = new Flutterwave(
      process.env.FLW_PUBLIC_KEY,
      process.env.FLW_SECRET_KEY
    );
    const redirect = transaction_id+"_"+orderNumber;
    const payload = {
      tx_ref,
      order_id: transaction_id.toString(),
      amount: Number(amount),
      currency,
      redirect_url: `https://biafricantouch.com/checkout/${redirect}`,
      email,
      phone_number: account,
      fullname: name,
    };

    const response = await flw.MobileMoney.rwanda(payload);

    if (response.message === "Charge initiated") {
      const status = "Pending";
      const insertUserSql = `
        INSERT INTO payments (
          transaction_id, tx_ref, full_name, account, amount, currency, order_id, user_id, 
          payment_method, email, address, details, status, created_at, paid_at, tax_amount, provider, flutter_response
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) 
        RETURNING *
      `;
      const message = "Your payment has been initiated successfully, Please follow the instruction to complete the payment";

      const insertValues = [
        transaction_id,
        tx_ref,
        name,
        account,
        amount,
        currency,
        Number(orderNumber),
        Number(user_id),
        paymentMethod,
        email,
        address,
        details,
        status,
        created_at,
        created_at,
        tax,
        provider,
        response
      ];

      if (!client) {
        throw new Error("Database client is not initialized.");
      }
      
      const result = await client.query(insertUserSql, insertValues);

      await sendInvoice(email, status, name, orderNumber, amount);
      await sendOrderPaymentsEmail(Number(tx_ref), email, status, name, orderNumber, amount, message);

      return NextResponse.json(
        {
          message: "Payment initiated successfull! Check OTP sent on SMS and complete payment!",
          user: result.rows[0],
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { response },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error during payments:", error);
    return NextResponse.json(
      { message: `Error: ${error instanceof Error ? error.message : "Unknown"}` },
      { status: 500 }
    );
  }
}
