import { NextResponse } from 'next/server';
import client from '../../../db'; // Adjust path to your database client

export async function GET(req: Request, { params }: { params: { id: number } }) {
    const { id } = params;

    try {
        // First, fetch the product to get category, price, and name
        const productResult = await client.query('SELECT category, price, name FROM products WHERE id = $1', [id]);
        
        if (productResult.rows.length === 0) {
            return NextResponse.json({ message: "Product not found." }, { status: 404 });
        }

        const { category, price, name } = productResult.rows[0];
        let result;

        // 1. Search for similar products by category
        result = await client.query(
            `SELECT id, name, price, category, image, hashed_id 
             FROM products 
             WHERE category = $1 
             AND id != $2`, [category, id]
        );

        // 2. If no products are found by category, search by price
        if (result.rows.length < 12) {
            const priceRange = 0.8; // Define price range e.g., 20% range
            result = await client.query(
                `SELECT id, name, price, category, image, hashed_id 
                 FROM products 
                 WHERE price BETWEEN $1 AND $2
                 AND id != $3 ORDER BY price ASC`, 
                 [price * (1 - priceRange), price * (1 + priceRange), id]
            );
        }

        // 3. If no products are found by price, search by name similarity
        if (result.rows.length < 12) {
            result = await client.query(
                `SELECT id, name, price, category, image, hashed_id 
                 FROM products 
                 WHERE name ILIKE '%' || $1 || '%' OR  description ILIKE '%' || $1 || '%' 
                 AND id != $2`, [name, id]
            );
        }

        // If still no results, return a 404
        if (result.rows.length === 0) {
            return NextResponse.json({ message: "No similar products found." }, { status: 404 });
        }

        // Return similar products
        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error retrieving similar products", error }, { status: 500 });
    }
}
