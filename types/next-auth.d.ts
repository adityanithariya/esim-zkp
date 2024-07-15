import NextAuth, { type DefaultSession } from "next-auth"

declare module "next-auth" {

    // Extend session to hold the access_token
    interface Session extends DefaultSession {
        address?: string
    }

    // Extend token to hold the access_token before it gets put into session
    interface JWT extends Record<string, unknown>, DefaultJWT {

    }
}