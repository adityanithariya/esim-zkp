import CredentialsProvider from "next-auth/providers/credentials"
import { getCsrfToken } from "next-auth/react"
import { SiweMessage } from "siwe"
import type { AuthOptions, JWT, Session } from "next-auth"

const providers = [
    CredentialsProvider({
        name: "Ethereum",
        credentials: {
            message: {
                label: "Message",
                type: "text",
                placeholder: "0x0",
            },
            signature: {
                label: "Signature",
                type: "text",
                placeholder: "0x0",
            },
        },
        async authorize(credentials, req) {
            try {
                const message = JSON.parse(credentials?.message || "{}")
                const siwe = new SiweMessage(message)
                const nextAuthUrl = new URL(message.uri)

                const result = await siwe.verify({
                    signature: credentials?.signature || "",
                    domain: nextAuthUrl.host,
                    nonce: await getCsrfToken({ req }),
                })

                if (result.success) {
                    return {
                        id: siwe.address,
                    }
                }
                return null
            } catch (e) {
                return null
            }
        },
    }),
]


const authOptions: AuthOptions = {
    providers,
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session, token }: { session: Session; token: JWT }) {
            if (!session.user) session.user = {}
            session.address = token.sub as string
            session.user.name = token.sub as string
            return session
        },
    },
}

export default authOptions