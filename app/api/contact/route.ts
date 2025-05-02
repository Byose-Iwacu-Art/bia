import { NextRequest, NextResponse } from "next/server";
import client from '../db';
import { sendContactUsEmail } from "../utils/config";

// Register a new user
export async function POST(req: NextRequest): Promise<NextResponse> {
    const {name, email, phone, message} = await req.json();

    // Input validation
    if (!name || !email || !phone || !message) {
        return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    try {
        

        const status = "Unread";
        const created_at = new Date();
        // Insert user into the database
        const insertUserSql = `
           INSERT INTO contact_messages (name, email, phone, message, created_at, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
        `;
        const insertValues = [name, email, phone, message, created_at, status];
        const result = await client.query(insertUserSql, insertValues);
        await sendContactUsEmail (email, name, phone, message);
        return NextResponse.json({ message: "Message sent", user: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error("Error during sending:", error);
        return NextResponse.json({ message: "Error: " + (error instanceof Error ? error.message : "Unknown error") }, { status: 500 });
    }
}
