import { NextRequest, NextResponse } from "next/server";
import client from '../../db';
import { sendAccountCreationEmail, sendVerificationCodeEmail } from "../../utils/config";

// Helper function to hash the password using SHA-256
async function hashPassword(password: string): Promise<string> {
    const textEncoder = new TextEncoder();
    const encoded = textEncoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
}

  function generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  
// Register a new user
export async function POST(req: NextRequest): Promise<NextResponse> {
    const { firstName, lastName, email, phone, nationality, password } = await req.json();

    // Input validation
    if (!firstName || !lastName || !email || !phone || !nationality || !password) {
        return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    try {
        // Check for existing users with the same phone or email
        const checkUserSql = `
            SELECT * FROM users WHERE phone = $1 OR email = $2
        `;
        const existingUserResult = await client.query(checkUserSql, [phone, email]);

        if (existingUserResult.rows.length > 0) {
            return NextResponse.json({ message: "Phone or email already exists." }, { status: 400 });
        }

        // Set default values for new user
        const account_type = "customer";
        const role = 'user';
        const status = 'Pending';
        const reference = '';
        const photo = "";
        const createdAt = new Date();
        const updated_at = null;
        const verification_code = generateVerificationCode();

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Insert user into the database
        const insertUserSql = `
            INSERT INTO users (first_name, last_name, email, phone, nationality, password, account_type, role, created_at, updated_at, status, reference, photo, verification_code)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *
        `;

        const insertValues = [firstName, lastName, email, phone, nationality, hashedPassword, account_type, role, createdAt, updated_at, status, reference, photo, verification_code];
        const result = await client.query(insertUserSql, insertValues);

        await sendAccountCreationEmail(email, firstName+" "+lastName);
        const deviceInfo = `${navigator.platform}, ${navigator.userAgent}`;
        
        const message = `Welcome to BIA The African touch. Your account has been successfully created at ${(new Date()).toLocaleString()} from device: ${deviceInfo}. \nPlease verify your account. \nEnjoy the home of made in Rwanda fashions and craftsmanship`;
        
        const notification = `INSERT INTO notification(content_text, user_id, event, system, view, action_required, admin, mailed, sms, created_at) VALUES($1, $2, $3, $4, $5, $6, $7, 'yes', 'no', NOW())`;
        await client.query(notification, [message, result.rows[0].id, "Account", "true", "Unread", `/dash/profile`, "Unread"])
        
        await sendVerificationCodeEmail(email, firstName, verification_code);

        return NextResponse.json({ message: "User registered successfully!", user: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error("Error during registration:", error);
        return NextResponse.json({ message: "Error: " + (error instanceof Error ? error.message : "Unknown error") }, { status: 500 });
    }
}
