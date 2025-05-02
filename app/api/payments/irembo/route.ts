import { NextRequest, NextResponse } from "next/server";
import client from "../../db";
import { sendOrderPaymentsEmail } from "../../utils/config";

const IremboPay = require("@irembo/irembopay-node-sdk").default;
const iPay = new IremboPay(process.env.IPAY_SECRET_KEY,process.env.IPAY_ENVIRONMENT)


interface Customer {
  email: string;
  phoneNumber: string;
  name: string;
}

interface PaymentItem {
  unitAmount: number;
  quantity: number;
  code: string;
}

interface InvoiceData {
  transactionId: string;
  paymentAccountIdentifier: string;
  customer: Customer;
  paymentItems: PaymentItem[];
  description: string;
  expiryAt: string;
  language: string;
  callBackUrl: string;
}


function generateUniqueId(): number {
  const min = 1000000000; // Minimum value (10 digits)
  const max = 9999999999; // Maximum value (10 digits)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDate(date: Date): string {
  date.setHours(date.getHours() + 24); // Add 24 hours

  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const pad = (num: number) => String(num).padStart(2, "0");

  const hoursOffset = pad(Math.floor(Math.abs(offset) / 60));
  const minutesOffset = pad(Math.abs(offset) % 60);

  return `${date.toISOString().slice(0, 19)}${sign}${hoursOffset}:${minutesOffset}`;
}

function isValidPhoneNumber(phone: string): boolean {
  const pattern = /^(078|079|072|073)\d{6}$/;
  return pattern.test(phone);
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
      phone,
      name,
      user_id,
      address,
    } = await req.json();

    const customer = {
      email: email,
      phoneNumber: phone,
      name: name,
    };

    const paymentItem = [
        {
      unitAmount: amount,
      quantity: 1,
      code: "PC-c6d002caca",
      },
    ];

    // Generate references and initialize Flutterwave
    const transaction_id = generateUniqueId();
    const details = "Order Cart Items Payment";
    const tax = amount * 0.05;
    const provider = "IremboPay";
    const created_at = new Date();

    //data object to pass to irembo pay
    const data: InvoiceData = {
      transactionId: transaction_id.toString(),
      paymentAccountIdentifier: "DEVMOMO",
      customer: customer,
      paymentItems: paymentItem,
      description: details,
      expiryAt: formatDate(created_at),
      language: "EN",
      callBackUrl: "https://biafricantouch.com"
    };

    const response = await iPay.invoice.createInvoice(JSON.stringify(data));

    const invoiceNumber = response.data.invoiceNumber;
    const paymentLink = response.data.paymentLinkUrl;

    
    console.log(response);

    if (response.success) {
      const status = "Pending";
      const insertUserSql = `
        INSERT INTO payments (
          transaction_id, tx_ref, full_name, account, amount, currency, order_id, user_id, 
          payment_method, email, address, details, status, created_at, paid_at, tax_amount, provider, flutter_response
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) 
        RETURNING *
      `;
      const message = "Your payment has been initiated successfully. Complete payment with redirect link(URL) on IremboPay.";

      const insertValues = [
        transaction_id,
        invoiceNumber,
        name,
        account,
        amount,
        currency,
        orderNumber,
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
      const invoice = `INSERT INTO invoices (user_id, order_number, transaction_id, status, created_at) VALUES(
      $1, $2, $3, $4, $5)`;
      await client.query(insertUserSql, insertValues);

      await client.query(invoice, [Number(user_id), Number(orderNumber), transaction_id, "Unpaid", created_at]);

      const notification = `INSERT INTO notification(content_text, user_id, event, system, view, action_required, admin, created_at, mailed, sms) VALUES($1, $2, $3, $4, $5, $6, $7, NOW(), 'yes', 'no')`;
      await client.query(notification, [message, user_id, "Payment", "true", "Unread", paymentLink, "Unread"])

      await sendOrderPaymentsEmail(invoiceNumber, email, status, name, orderNumber, amount, message);
 
      return NextResponse.json({message: "Payment initiated successfully. Redirecting...", paymentLinkUrl: paymentLink}, { status: 200 });
      
    } else {
      console.log(response)
      return NextResponse.json( response.message , { status: 400 });
    }


  } catch (error) {
    console.error("Error during payments:", error);
    return NextResponse.json(
      { message: `Error: ${error instanceof Error ? error : "Unknown"}` },
      { status: 500 }
    );
  }
}
