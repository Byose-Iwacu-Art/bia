import { NextResponse } from 'next/server';
import client from '@/app/api/db'; // Adjust this path based on your project structure

export async function GET(req: Request, { params }: { params: { userId: string } }) {
    const { userId } = params;

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    try {
        // Query to get the count of total orders by user
        const totalOrdersQuery = `
            SELECT COUNT(*) AS total_orders
            FROM orders
            WHERE user_id = $1;
        `;

        // Query to get the count of total payments by user
        const totalPaymentsQuery = `
            SELECT 
    COALESCE(SUM(p.amount::NUMERIC), 0) AS total_payments
FROM payments p
WHERE p.user_id = $1;

        `;

        // Query to get the count of pending orders
        const pendingOrdersQuery = `
            SELECT COUNT(*) AS pending_orders
            FROM orders
            WHERE user_id = $1 AND status = 'Pending';
        `;

        // Query to get the count of delivered orders
        const deliveredOrdersQuery = `
            SELECT COUNT(*) AS delivered_orders
            FROM orders
            WHERE user_id = $1 AND status = 'Delivered';
        `;

        // Query to get the total inboxes (example query, modify based on your schema)
        const inboxesQuery = `
            SELECT COUNT(*) AS total_inboxes
            FROM contact_messages
            WHERE email = $1;
        `;

        const [totalOrdersResult, totalPaymentsResult, pendingOrdersResult, deliveredOrdersResult, inboxesResult] = await Promise.all([
            client.query(totalOrdersQuery, [userId]),
            client.query(totalPaymentsQuery, [userId]),
            client.query(pendingOrdersQuery, [userId]),
            client.query(deliveredOrdersQuery, [userId]),
            client.query(inboxesQuery, [userId]),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                totalOrders: parseInt(totalOrdersResult.rows[0].total_orders, 10),
                totalPayments: parseInt(totalPaymentsResult.rows[0].total_payments, 10),
                pendingOrders: parseInt(pendingOrdersResult.rows[0].pending_orders, 10),
                deliveredOrders: parseInt(deliveredOrdersResult.rows[0].delivered_orders, 10),
                totalInboxes: parseInt(inboxesResult.rows[0].total_inboxes, 10),
            },
        });
    } catch (error) {
        console.error('Error fetching counts:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    } 
}
