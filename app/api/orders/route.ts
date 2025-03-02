import { NextRequest, NextResponse } from 'next/server';
import client from '../db';
import { sendOrderPlacementEmail } from '../utils/config';

function generateUniqueId() {
    const min = 100000; // Minimum value (6 digits)
    const max = 999999; // Maximum value (6 digits)
  
    // Generate a random number between min and max
    const randomId = Math.floor(Math.random() * (max - min + 1)) + min;
  
    return randomId;
  }
  function formatDate(dateString: any) {
    // Convert the string to a Date object
    const date = new Date(dateString);
  
    // Array of month names
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
    // Extract parts of the date
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
  
    // Construct the formatted date
    return `${month}, ${day} ${year} ${hours}:${minutes}:${seconds}`;
  }
export async function POST(req: NextRequest) {
  // Extract JSON body
  const {
    user_id,
    payment_method,
    total_mount,
    delivery_allowed,
    billing_address,
    shipping_address,
    shipping_fee,
    discount,
    orderDetails,
    email, 
    name,
  } = await req.json();
  const uinumber = generateUniqueId();

  // Input validation: Check that the necessary fields are provided
  if (!user_id || !payment_method || !total_mount || !delivery_allowed || !billing_address) {
    return NextResponse.json({ message: "Required fields missing." }, { status: 400 });
  }

  try {
    // Begin transaction
    await client.query("BEGIN");

    // Insert order and retrieve its ID
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, payment_method, total_amount, delivery_allowed, billing_address, shipping_address, shipping_fee, discount, order_number)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
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
      ]
    );
    const order_id = orderResult.rows[0].order_id;

    const dateString = new Date()
    const time_date: any = formatDate(dateString);
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
    //send placement email
    await sendOrderPlacementEmail(email, name, uinumber.toString(), orderDetails.length, d, time_date, total_mount);

    // Send success response
    return NextResponse.json({ message: "Order saved successfully!", order: orderResult.rows[0] }, { status: 200 });
  } catch (error) {
    // Rollback transaction on error
    await client.query("ROLLBACK");
    console.error("Error saving order:", error);
    return NextResponse.json({ message: "Error saving order" }, { status: 500 });
  }
}
