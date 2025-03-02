import { NextResponse } from "next/server";
import client from "../../db";

interface OrderDetailRow {
    product_id: number;
    product_name: string;
    product_image: string;
    product_category: string;
    color: string;
    size: string;
    quantity: number;
    unit_price: number;
    order_number: string;
    created_at: string;
    total_amount: number;
    payment_method: string;
    status: string;
    payment_status: string;
    flutter_response: string;
}

// Handle GET request with dynamic orderNumber
export async function GET(req: Request, { params }: { params: { orderNumber: string } }) {
    const { orderNumber } = params;

    if (!orderNumber) {
        return NextResponse.json({ message: "Order number is required" }, { status: 400 });
    }

    try {
        const query = `
            SELECT 
                o.order_number,
                o.created_at,
                o.total_amount,
                o.payment_method,
                o.status,
                od.product_id,
                od.color,
                od.size,
                od.quantity,
                od.unit_price,
                p.name AS product_name,
                p.category AS product_category,
                p.image AS product_image,
                py.flutter_response,
                py.status AS payment_status
            FROM orders o
            JOIN orderdetails od ON o.order_id = od.order_id
            JOIN products p ON od.product_id = p.id
            JOIN payments py ON CAST(py.order_id AS text) = $1
            WHERE o.order_number = $1
            ORDER BY od.product_id;
        `;

        const { rows }: { rows: OrderDetailRow[] } = await client.query(query, [orderNumber]);

        if (rows.length === 0) {
            return NextResponse.json(
                { message: "Order not found", success: false },
                { status: 404 }
            );
        }

        const order = {
            orderNumber: rows[0].order_number,
            createdAt: rows[0].created_at,
            totalAmount: rows[0].total_amount,
            paymentMethod: rows[0].payment_method,
            status: rows[0].status,
            payment_status: rows[0].payment_status,
            flutter_response: rows[0].flutter_response,
            items: rows.map((row) => ({
                productId: row.product_id,
                productName: row.product_name,
                productImage: row.product_image,
                productCategory: row.product_category,
                color: row.color,
                size: row.size,
                quantity: row.quantity,
                price: row.unit_price,
            })),
        };

        return NextResponse.json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Error fetching order details:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
