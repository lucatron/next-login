import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { sql } from '@vercel/postgres';



const handler = NextAuth({
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/login'
    },
    providers: [
        CredentialsProvider({
            credentials: {
                email: {},
                password: {}
            },
            async authorize(credentials, req) {
                try {
                    // Validate email and password
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error("Please provide both email and password.");
                    }

                    // Check if the email exists
                    const response = await sql`SELECT * FROM users WHERE email = ${credentials?.email}`;
                    const user = response.rows[0];

                    if (!user) {
                        throw new Error("User with this email does not exist.");
                    }

                    // Compare passwords
                    const passwordCorrect = await compare(credentials?.password || "", user.password);
                    if (!passwordCorrect) {
                        throw new Error("Incorrect password.");
                    }

                    return {
                        id: user.id,
                        email: user.email,
                    };
                } catch (error: any) {
                    // Handle any errors and return null
                    console.error("Authentication error:", error.message);
                    return null;
                }
            },
        }),
    ],
});
export { handler as GET, handler as POST }