import { NextRequest, NextResponse } from "next/server";
import client from "../../db"; // Assuming client is the database connection

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Extract the query parameter from the URL
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("id");

    // Validate that the query parameter is provided
    if (!query) {
      return NextResponse.json(
        { message: "Product parameter is missing" },
        { status: 400 }
      );
    }

    // SQL query to search for products matching the query
    const searchSql = `
      UPDATE 
      products
      SET rates = rates + 1 WHERE id = $1 RETURNING rates 
    `;
    // Execute the query with the search value
    await client.query(searchSql, [query]);

    // Return the found products
    return NextResponse.json(
      { message: "Success" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: `Error: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    );
    
  }
}
