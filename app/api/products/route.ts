// app/api/products/route.ts
import { NextResponse } from "next/server";
import client from "../db"; // Adjust the path to your database client

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "";
    const priceMin = Number(searchParams.get("priceMin")) || 0;
    const priceMax = Number(searchParams.get("priceMax")) || 500000;
    const size = searchParams.get("size") || "";
    const sort = searchParams.get("sortBy") || "";

    let sql = "SELECT * FROM products";
    const params: (string | number)[] = [];

    // Filtering logic
    const conditions: string[] = [];

    if (priceMin || priceMax < 500000) {
      conditions.push(`price BETWEEN $${params.length + 1} AND $${params.length + 2}`);
      params.push(priceMin, priceMax);
    }

    if (category) {
      conditions.push(`category ILIKE '%' || $${params.length + 1} || '%'`);
      params.push(category);
    }

    if (size && size !== "Any") {
      conditions.push(`sizes ILIKE '%' || $${params.length + 1} || '%'`);
      params.push(size);
    }

    // Combine conditions if any
    if (conditions.length) {
      sql += " WHERE status = 'Active' AND " + conditions.join(" AND ");
    }

    sql += " ORDER BY id DESC";
    
    const result = await client.query(sql, params);

    // Return products as JSON
    return NextResponse.json(result.rows);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error retrieving products", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: "Unknown error occurred." }, { status: 500 });
  }
}
