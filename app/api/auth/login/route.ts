import { NextRequest, NextResponse } from "next/server";
import client from '../../db';
import crypto from 'crypto';
import { sendActivityEmail } from "../../utils/config";

// Helper function to hash the password using SHA-256
async function hashPassword(password: string): Promise<string> {
    const textEncoder = new TextEncoder();
    const encoded = textEncoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
}

// Helper function to generate a secure session ID
function generateSessionId(): string {
    return crypto.randomBytes(16).toString('hex');
}

// Login handler
export async function POST(req: NextRequest): Promise<NextResponse> {
    const { userName, password } = await req.json();

    // Input validation
    if (!userName || !password) {
        return NextResponse.json({ message: "Both fields are required." }, { status: 400 });
    }

    try {
        // Query user by email or phone
        const sql = "SELECT * FROM users WHERE email = $1 OR phone = $1";
        const result = await client.query(sql, [userName]);
        const user = result.rows[0];

        // If user does not exist or password is incorrect, return a general error message
        if (!user || (await hashPassword(password)) !== user.password) {
            return NextResponse.json({ message: "Invalid login credentials." }, { status: 400 });
        }

        // Generate a session ID and save it
        const sessionId = generateSessionId();
        const insertSql = "INSERT INTO sessions (user_id, session_id) VALUES ($1, $2) RETURNING *";
        await client.query(insertSql, [user.id, sessionId]);

        let deviceInfo = 'unknown device';
if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
  deviceInfo = `${navigator.platform}, ${navigator.userAgent}`;
}
        const message = `New login detected at ${(new Date()).toLocaleString()} from device: ${deviceInfo}. \nIf it was not you please change password`;
        
        const notification = `INSERT INTO notification(content_text, user_id, event, system, view, action_required, admin, mailed, sms, created_at) VALUES($1, $2, $3, $4, $5, $6, $7, 'yes', 'no', NOW())`;
        await client.query(notification, [message, user.id, "Security and Privacy", "true", "Unread", `/dash/profile`, "Unread"])

        await sendActivityEmail(user.email, user.first_name, message);
        // Send response with user data and session ID
        return NextResponse.json({
            message: "Login successful!",
            user: {
                id: user.id,
                name: user.first_name + " " + user.last_name,
                email: user.email,
                session_id: sessionId,
            }
        }, { status: 200 });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ message: "Error: " + (error instanceof Error ? error.message : "Unknown error occurred.") }, { status: 500 });
    }
}
