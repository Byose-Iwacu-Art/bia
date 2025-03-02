import { NextRequest, NextResponse } from 'next/server';
import client from '../db';

export async function POST(req: NextRequest) {
  // Extract JSON body
  const {
    user_id,
    event,
    action,
    content_text
  } = await req.json();
  const created_at = new Date();
  const status = "Unread";
  const mailed = "no";
  const sms = "no";
  const sym = "yes";

  // Input validation: Check that the necessary fields are provided
  if (!user_id || !event || !action || !content_text) {
    return NextResponse.json({ message: "Required fields missing." }, { status: 400 });
  }

  try {
    // Begin transaction
    await client.query("BEGIN");

    // Insert order and retrieve its ID
    const orderResult = await client.query(
      `INSERT INTO notification (user_id, content_text, action_required, event, sms, mailed, system, view, admin, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        user_id,
        content_text,
        action,
        event,
        sms,
        mailed,
        sym,
        status,
        status,
        created_at
      ]
    );

    // Commit transaction
    await client.query("COMMIT");

    // Send success response
    return NextResponse.json({ message: "Notification saved successfully!", notify: orderResult.rows[0] }, { status: 200 });
  } catch (error) {
    // Rollback transaction on error
    await client.query("ROLLBACK");
    console.error("Error saving notification:", error);
    return NextResponse.json({ message: "Error saving notification: " + error}, { status: 500 });
  }
}
