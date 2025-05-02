import { NextResponse } from "next/server";
import client from "../../../db";

// Handle GET request with dynamic userId
export async function GET(req: Request, { params }: { params: { userId: string } }) {
    const { userId } = params;

    if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    try {
        const query = `
            SELECT 
                p.payment_id,
                p.transaction_id,
                p.amount,
                p.payment_method,
                p.full_name,
                p.email,
                p.address,
                p.tx_ref,
                p.provider,
                p.account,
                p.currency,
                p.status,
                p.details,
                p.order_id,
                p.created_at,
                p.paid_at,
                p.flutter_response
            FROM payments p
            WHERE p.user_id = $1
            ORDER BY p.payment_id DESC;
        `;

        const { rows }: { rows: any[] } = await client.query(query, [userId]);

        if (rows.length === 0) {
            return NextResponse.json(
                { message: "No payments found for this user", success: false },
                { status: 404 }
            );
        }

        const paymentDetails = rows.map((row) => ({
            paymentId: row.payment_id,
            paymentDate: row.paid_at,
            amount: row.amount,
            paymentMethod: row.payment_method,
            account: row.account,
            orderNumber: row.order_id,
            status: row.status,
            name: row.full_name,
            email: row.email,
            provider: row.provider,
            address: row.address,
            tx_ref: row.tx_ref,
            details: row.details,
            currency: row.currency,
            createdAt: row.created_at,
            transactionId: row.transaction_id,
            flutter_response: row.flutter_response,
        }));
        
        return NextResponse.json({
            success: true,
            paymentDetails,
        });
        
    } catch (error) {
        console.error("Error fetching payment details:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
