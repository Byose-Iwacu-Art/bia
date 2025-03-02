import { NextRequest, NextResponse } from "next/server";
import client from "../db"; // Assuming client is the database connection

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Extract the query parameter from the URL
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    // Validate that the query parameter is provided
    if (!query) {
      return NextResponse.json(
        { message: "Search query parameter 'q' is required" },
        { status: 400 }
      );
    }

    // SQL query to search for products matching the query
    const searchSql = `
      SELECT * 
      FROM products 
      WHERE LOWER(name) LIKE LOWER($1) OR LOWER(description) LIKE LOWER($1) OR LOWER(category) LIKE LOWER($1)  
    `;
    const searchValue = `%${query}%`;

    // Execute the query with the search value
    const result = await client.query(searchSql, [searchValue]);

    // If no products are found, return an empty array
    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "No results", products: [] },
        { status: 200 }
      );
    }

    // Return the found products
    return NextResponse.json(
      { message: "Success", products: result.rows },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during search:", error);
    return NextResponse.json(
      { message: `Error: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
