import { NextRequest, NextResponse } from 'next/server';
import client from '../db';
import { sendInvoice } from '../utils/invoice';

async function generateCode(): Promise<string> {

    const result = await client.query("SELECT COUNT(*) FROM orders");
    const count = parseInt(result.rows[0].count, 10) + 1;
    const formattedCount = count.toString().padStart(3, "0");
    
    return `${formattedCount}`;
}

export async function POST(req: NextRequest) {
  // Extract JSON body
  const {
    user_id,
    payment_method,
    total_mount,
    delivery_allowed,
    details,
    billing_address,
    shipping_address,
    shipping_fee,
    discount,
    orderDetails,
    email, 
    name,
  } = await req.json();
  const uinumber = await generateCode();

  // Input validation: Check that the necessary fields are provided
  if (!user_id || !payment_method || !total_mount || !delivery_allowed || !billing_address) {
    return NextResponse.json({ message: "Required fields missing." }, { status: 400 });
  }

  try {
    // Begin transaction
    await client.query("BEGIN");

    // Insert order and retrieve its ID
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, payment_method, total_amount, delivery_allowed, billing_address, shipping_address, shipping_fee, discount, order_number, details)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        user_id,
        payment_method,
        total_mount,
        delivery_allowed,
        billing_address,
        shipping_address,
        shipping_fee,
        discount,
        uinumber,
        details,
      ]
    );
    const order_id = orderResult.rows[0].order_id;

    // Insert order details into orderdetails table
    const orderDetailPromises = orderDetails.map((detail: any) =>
      client.query(
        `INSERT INTO orderdetails (order_id, product_id, unit_price, quantity, size, color)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          order_id,
          detail.product_id,
          detail.unit_price,
          detail.quantity,
          detail.size,
          detail.color,
        ]
      )
    );
    await Promise.all(orderDetailPromises);

    // Commit transaction
    await client.query("COMMIT");
    let d = "";
    delivery_allowed ? d = "1 day to be delivered!" : d = "Delivery not allowed"; 

    const message = `Order with reference ${orderResult.rows[0].order_number} has been placed. Please process the payment to continue!`

    const notification = `INSERT INTO notification(content_text, user_id, event, system, view, action_required, admin, mailed, sms, created_at) VALUES($1, $2, $3, $4, $5, $6, $7, 'yes', 'no', NOW())`;
    await client.query(notification, [message, user_id, "Order", "true", "Unread", `/dash/orders/${orderResult.rows[0].order_number}`, "Unread"])
    
    //send placement email
    await sendInvoice(email, orderDetails, name, uinumber.toString(), total_mount);


    // Send success response
    return NextResponse.json({ message: "Order saved successfully!", order: orderResult.rows[0] }, { status: 200 });
  } catch (error) {
    // Rollback transaction on error
    await client.query("ROLLBACK");
    console.error("Error saving order:", error);
    return NextResponse.json({ message: "Error saving order" }, { status: 500 });
  }
}
