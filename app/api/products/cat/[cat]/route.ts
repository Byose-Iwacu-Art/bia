import { NextResponse } from "next/server";
import client from "../../../db"; // Adjust the path to your database client

export async function GET(req: Request, { params }: { params: { cat: string } }) {
  const { cat } = params;

  if (!cat) {
    return NextResponse.json({ message: "Product category is required." }, { status: 400 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const priceMin = Number(searchParams.get("priceMin")) || 0;
    const priceMax = Number(searchParams.get("priceMax")) || 500000;
    const size = searchParams.get("size") || "";
    const sort = searchParams.get("sortBy") || "";

    // Construct the base query
    let sql = "SELECT * FROM products WHERE category = $1";
    const queryParams: (string | number)[] = [cat];

    // Additional filtering
    if (priceMin || priceMax < 500000) {
      sql += ` AND price BETWEEN $${queryParams.length + 1} AND $${queryParams.length + 2}`;
      queryParams.push(priceMin, priceMax);
    }

    if (size && size !== "Any") {
      sql += ` AND sizes ILIKE '%' || $${queryParams.length + 1} || '%'`;
      queryParams.push(size);
    }

    // Sorting logic
    if (sort) {
      if (sort === "popular") {
        sql += " ORDER BY stock ASC";
      } else if (sort === "reviewed") {
        sql += " ORDER BY stock DESC";
      } else if (sort === "promoted") {
        sql += " ORDER BY discount DESC";
      } else {
        sql += " ORDER BY id DESC"; // Default sorting
      }
    } else {
      sql += " ORDER BY id DESC";
    }

    const result = await client.query(sql, queryParams);

    // Return the filtered products
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error retrieving products:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error retrieving products", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: "Unknown error occurred." }, { status: 500 });
  }
}
