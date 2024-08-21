"use client";

import { useCallback, useMemo, type ReactNode } from "react";
import { SessionProvider, getCsrfToken, signIn } from "next-auth/react";
import type { Session } from "next-auth";
import "@rainbow-me/rainbowkit/styles.css";
import { clusterApiUrl } from "@solana/web3.js";
import {
	type Adapter,
	WalletAdapterNetwork,
} from "@solana/wallet-adapter-base";
import {
	CoinbaseWalletAdapter,
	PhantomWalletAdapter,
	SolflareWalletAdapter,
	TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
	ConnectionProvider,
	WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import type { SolanaSignInInput } from "@solana/wallet-standard-features";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

type Props = {
	children: ReactNode;
	session?: Session;
};

const WalletProvider = ({ children, session }: Props) => {
	const network = WalletAdapterNetwork.Devnet;
	const endpoint = useMemo(
		() =>
			process.env.NETWORK === "localnet"
				? "http://localhost:8899"
				: clusterApiUrl(network),
		[network],
	);

	const wallets = useMemo(
		() => [
			new CoinbaseWalletAdapter(),
			new PhantomWalletAdapter(),
			new SolflareWalletAdapter({ network }),
			new TorusWalletAdapter(),
		],
		[network],
	);
	const autoSignIn = useCallback(
		async (adapter: Adapter): Promise<boolean> => {
			if (session?.address && adapter.connected) return true;
			if (!("signIn" in adapter)) return true;

			const nonce = await getCsrfToken();
			if (!nonce) return false;

			const input: SolanaSignInInput = {
				domain: window.location.host,
				statement: "Sign this message to sign in to eSIM DApp!",
				nonce,
			};

			const output = await adapter.signIn(input);
			const serializedOutput = {
				account: {
					publicKey: output.account.publicKey,
				},
				signature: output.signature,
				signedMessage: output.signedMessage,
			};

			console.log(input, serializedOutput);

			const result = await signIn("credentials", {
				message: JSON.stringify(input),
				signature: JSON.stringify(serializedOutput),
				redirect: false,
			});
			// if (result?.ok) throw new Error("Sign In verification failed!");
			console.log("is verified: ", result);

			return result?.status === 200;
		},
		[session],
	);
	return (
		<ConnectionProvider endpoint={endpoint}>
			<SolanaWalletProvider wallets={wallets} autoConnect={autoSignIn}>
				<WalletModalProvider>
					<SessionProvider refetchInterval={0} session={session}>
						{children}
					</SessionProvider>
				</WalletModalProvider>
			</SolanaWalletProvider>
		</ConnectionProvider>
	);
};

export default WalletProvider;
