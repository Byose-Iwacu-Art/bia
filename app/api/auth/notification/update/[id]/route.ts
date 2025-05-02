// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import client from '../../../../db'; // Adjust the path to your database client

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ message: "User ID is required." }, { status: 400 });
    }

    try {
        const result = await client.query("UPDATE notification SET view='Read' WHERE user_id = $1", [id]);

        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error retrieving notifications", error }, { status: 500 });
    }
}
