import { NextRequest, NextResponse } from "next/server";
import client from '../../db';

// Register a new user
export async function POST(req: NextRequest): Promise<NextResponse> {
    const { country, province, district, sector, cell, village, street1, street2, id } = await req.json();

    // Input validation
    if (!country || !province || !district || !sector || !cell || !village || !street1) {
        return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    try {
        

       const billingaddress = country+" . "+province+" . "+district+" . "+sector+" . "+cell+" . "+village;

        // Insert user into the database
        const insertUserSql = `
            UPDATE users SET billingaddress = $1, street1 = $2, street2 = $3
            WHERE id = $4 
        `;
        const insertValues = [billingaddress, street1, street2, id];
        const result = await client.query(insertUserSql, insertValues);

        return NextResponse.json({ message: "User address saved successfully!", user: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error("Error during adding billng address:", error);
        return NextResponse.json({ message: "Error: " + (error instanceof Error ? error.message : "Unknown error") }, { status: 500 });
    }
}
