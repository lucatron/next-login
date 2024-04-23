import { NextResponse } from "next/server";
import { hash } from 'bcrypt';
import { sql } from "@vercel/postgres";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        // validate email and password - you can use Zod library here

        console.log({ email, password });
        const hashedPassword = await hash(password, 10);

        const response = await sql`
            INSERT INTO users (email,password)
            VALUES (${email},${hashedPassword})`;

        return NextResponse.json({ message: "success" });
    } catch (error: any) {
        console.error(error);

        if (error.code === '23505') { // Unique constraint violation error code
            return NextResponse.json({ error: "Email address already exists." }, { status: 409 }); // HTTP status 409 for conflict
        } else {
            // Handle other errors
            return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 }); // Internal server error
        }
    }
}
