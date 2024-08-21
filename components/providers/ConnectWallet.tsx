"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { signOut, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider, type Wallet, setProvider } from "@coral-xyz/anchor";

const ConnectWallet = () => {
	const { connection } = useConnection();
	const wallet = useAnchorWallet();
	const provider = new AnchorProvider(connection, wallet as Wallet, {});
	setProvider(provider);
	const { connected } = useWallet();
	const { data } = useSession();
	useEffect(() => {
		if (connected === false && data?.address) signOut({ redirect: false });
	}, [connected, data]);
	return (
		<WalletMultiButton className="wallet-button bg-[#0e76fd] py-2.5 rounded-md hover:bg-[#0b60ce]" />
	);
};

export default ConnectWallet;
