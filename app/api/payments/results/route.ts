import { NextRequest, NextResponse } from "next/server";
import client from '../../db';
import { stat } from "fs";
import { sendOrderPaymentsEmail } from "../../utils/config";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body = await req.json();
        console.log("Received body:", body);

        const { tid, account, status, email, name } = body;
        if (!tid || !account || !status) {
            console.error("Validation failed. Missing fields:", { tid, account, status });
            return NextResponse.json({ message: "Failed" }, { status: 400 });
        }
        const message = status === "Paid" ? "Your payment has been received successfully. Your order is now being processed." : status === "Failed" ? `Your payment has been failed due to Insufficient Fund. Please add enough money on your account, and click on view order button below to complete your payment.`: "Your payment has been failed. Try again";

        const created_at = new Date();
        const query =
            status === "Paid"
                ? `UPDATE payments SET status = $1, paid_at = $2 WHERE transaction_id = $3 AND order_id = $4 RETURNING *`
                : `UPDATE payments SET status = $1, created_at = $2 WHERE transaction_id = $3 AND order_id = $4 RETURNING *`;

        const values = [status, created_at, tid, account];
        const result = await client.query(query, values);
        await sendOrderPaymentsEmail(email, status, name, account, result.rows[0].amount, message)
        return NextResponse.json({ message: "success", data: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ message: "Server Error", error }, { status: 500 });
    }
}
