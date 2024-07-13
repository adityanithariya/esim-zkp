"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { type State, WagmiProvider } from "wagmi";

import WagmiConfig from "@config/wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

type Props = {
	children: ReactNode;
	initialState?: State;
};

const queryClient = new QueryClient();

const WalletProvider = ({ children, initialState }: Props) => {
	return (
		<WagmiProvider config={WagmiConfig} initialState={initialState}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider>{children}</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
};

export default WalletProvider;
