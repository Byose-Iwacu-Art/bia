// app/api/products/route.ts
import { NextResponse } from 'next/server';
import client from '../../db'; // Adjust the path to your database client

export async function GET() {
    try {
        // Query to select required fields from products and promotions
        const sql = `
            SELECT 
                products.id, 
                products.name, 
                products.image,
                products.price,
                products.hashed_id, 
                promotion.promotion AS discount, 
                promotion.promotion_type,
                promotion.product_id,
                promotion.status
            FROM 
                products
            JOIN 
                promotion
            ON 
               promotion.product_id = CAST(products.id AS TEXT)
            ORDER BY 
                products.id DESC
        `;
        const result = await client.query(sql);

        // Return products with promotions as JSON
        return NextResponse.json(result.rows);
    } catch (error) {
        // Handle errors
        if (error instanceof Error) {
            return NextResponse.json({ message: "Error retrieving products", error: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: "Unknown error occurred." }, { status: 500 });
    }
}
