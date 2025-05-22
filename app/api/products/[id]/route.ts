import { NextResponse } from 'next/server';
import client from "../../db"; // Adjust the path to your database client

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ message: "Product ID is required." }, { status: 400 });
    }

    try {
        // Fetch product details
        const productResult = await client.query(`SELECT p.*, pr.promotion FROM products p LEFT JOIN promotion pr ON pr.product_id = p.id::text WHERE hashed_id = $1`, [id]);
        // Fetch relational images
        const img_id = productResult.rows[0].id;
        const imagesResult = await client.query(
            `SELECT image_url AS images FROM product_relational_images WHERE product_id = $1`, 
            [img_id]
        );

        if (productResult.rows.length === 0) {
            return NextResponse.json({ message: "Product not found." }, { status: 404 });
        }

        // Combine product data with relational images
        const product = productResult.rows[0];
        product.images = imagesResult.rows.map((row: { images: any; }) => row.images);

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error("Error retrieving product:", error);
        return NextResponse.json({ message: "Error retrieving product", error: (error as Error).message }, { status: 500 });
    }
}
