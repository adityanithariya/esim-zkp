"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { type State, WagmiProvider } from "wagmi";

import WagmiConfig from "@config/wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { RainbowKitSiweNextAuthProvider } from "@rainbow-me/rainbowkit-siwe-next-auth";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import "@rainbow-me/rainbowkit/styles.css";

type Props = {
	children: ReactNode;
	initialState?: State;
	session?: Session;
};

const queryClient = new QueryClient();

const WalletProvider = ({ children, initialState, session }: Props) => {
	return (
		<WagmiProvider config={WagmiConfig} initialState={initialState}>
			<SessionProvider refetchInterval={0} session={session}>
				<QueryClientProvider client={queryClient}>
					<RainbowKitSiweNextAuthProvider
						getSiweMessageOptions={() => ({
							statement: "Sign in to eSIM DApp!",
						})}
					>
						<RainbowKitProvider>{children}</RainbowKitProvider>
					</RainbowKitSiweNextAuthProvider>
				</QueryClientProvider>
			</SessionProvider>
		</WagmiProvider>
	);
};

export default WalletProvider;
