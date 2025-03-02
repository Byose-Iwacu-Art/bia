// app/api/products/route.ts
import { NextResponse } from 'next/server';
import client from '../../../db'; // Adjust the path to your database client

export async function GET(req: Request, { params }: { params: { limit: string } }) {
    const { limit } = params;

    if (!limit) {
        return NextResponse.json({ message: "Error with limit." }, { status: 400 });
    }
    if(limit === "any"){
        try {
        
            const result = await client.query("SELECT * FROM categories WHERE avatar != '' AND products > 0 LIMIT 14");
    
            // Return products as JSON
            return NextResponse.json(result.rows);
        } catch (error) {
            // Handle errors
            if (error instanceof Error) {
                return NextResponse.json({ message: "Error retrieving products", error: error.message }, { status: 500 });
            }
            return NextResponse.json({ message: "Unknown error occurred." }, { status: 500 });
        }
    }
    try {
        
        const result = await client.query("SELECT * FROM categories WHERE avatar != '' ORDER BY id DESC LIMIT $1", [limit]);

        // Return products as JSON
        return NextResponse.json(result.rows);
    } catch (error) {
        // Handle errors
        if (error instanceof Error) {
            return NextResponse.json({ message: "Error retrieving products", error: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: "Unknown error occurred." }, { status: 500 });
    }
}
