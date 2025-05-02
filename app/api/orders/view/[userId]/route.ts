import { NextResponse } from "next/server";
import client from "../../../db";

// Handle GET request with dynamic userId
export async function GET(req: Request, { params }: { params: { userId: string } }) {
    const { userId } = params;

    if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    try {
       
        // Query to fetch orders for the given userId
        const query = `
            SELECT 
                o.created_at,
                o.order_id,
                o.order_number, 
                o.payment_method, 
                o.total_amount, 
                o.delivery_allowed, 
                o.status,
                o.details, 
                pd.payment_id,
                pd.status as payment_status
            FROM orders o
            LEFT JOIN payments pd ON CAST(o.order_number AS INTEGER) = pd.order_id
            WHERE o.user_id = $1
            ORDER BY o.order_id DESC;
        `;

        const { rows } = await client.query(query, [userId]);

        return NextResponse.json({
            success: true,
            orders: rows,
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    } 
}
