import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";
import type { AuthOptions, JWT, Session } from "next-auth";
import type {
	SolanaSignInInput,
	SolanaSignInOutput,
} from "@solana/wallet-standard-features";
import { verifySignIn } from "@solana/wallet-standard-util";
import { PublicKey } from "@solana/web3.js";

const providers = [
	CredentialsProvider({
		name: "Solana",
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
				const input = JSON.parse(credentials?.message || "{}");
				const output = JSON.parse(credentials?.signature || "{}");
				const publicKey = new PublicKey(
					new Uint8Array(Object.values(output.account.publicKey)),
				);
				output.account.publicKey = publicKey.toBytes();
				output.signature = new Uint8Array(output.signature.data);
				output.signedMessage = new Uint8Array(output.signedMessage.data);

				const result = verifySignIn(input, output);

				if (result && publicKey.toBase58()) {
					return {
						id: publicKey.toBase58(),
					};
				}
				return null;
			} catch (e) {
				console.log(e);
				return null;
			}
		},
	}),
];

const authOptions: AuthOptions = {
	providers,
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async session({ session, token }: { session: Session; token: JWT }) {
			if (!session.user) session.user = {};
			session.address = token.sub as string;
			// session.user.name = token.sub as string;
			return session;
		},
	},
};

export default authOptions;
