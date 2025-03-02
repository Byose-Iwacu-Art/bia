import { NextRequest, NextResponse } from "next/server";
import client from '../../db';

// Logout handler
export async function POST(req: NextRequest): Promise<NextResponse> {
    const { session_id: sessionId } = await req.json(); // Expecting the session ID from the client

    if (!sessionId) {
        return NextResponse.json({ message: "No session ID provided." }, { status: 400 });
    }

    try {
        // Update the session's logout date
        const updateSql = "UPDATE sessions SET logout_date = NOW() WHERE session_id = $1 RETURNING *";
        const result = await client.query(updateSql, [sessionId]);

        if (result.rowCount === 0) {
            return NextResponse.json({ message: "Session not found." }, { status: 404 });
        }

        return NextResponse.json({ message: "Logout successful." }, { status: 200 });
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { message: "Error: " + (error instanceof Error ? error.message : "Unknown error occurred.") },
            { status: 500 }
        );
    }
}
