import React from "react";
import AddSIM from "@components/AddSIM";
import RegisteredSIMs from "@components/RegisteredSIMs";
import { getServerSession } from "next-auth";
import type { eSIM } from "@type/index";
import authOptions from "@config/auth";
import ConnectWallet from "@components/providers/ConnectWallet";
import {
	AnchorProvider,
	Program,
	type Wallet,
	setProvider,
} from "@coral-xyz/anchor";
import idl from "@idl/esim_zkp.json";
import type { EsimZkp } from "@type/esim_zkp";
import { generatePhoneNumbers } from "@utils/utils";
import { Connection, clusterApiUrl } from "@solana/web3.js";

export const dynamic = "force-dynamic";

const ESIM = async () => {
	const phoneNumbers = await generatePhoneNumbers();
	const session = await getServerSession(authOptions);
	const SIMs: eSIM[] = [];
	if (session?.address) {
		const connection = new Connection(clusterApiUrl("devnet"));
		setProvider(new AnchorProvider(connection, {} as Wallet));
		const program = new Program<EsimZkp>(idl as EsimZkp);
		const accounts = await program.account.esim.all([
			{
				memcmp: {
					offset: 8,
					bytes: session.address,
				},
			},
		]);
		for (const data of accounts) {
			SIMs.push({
				phoneNumber: data.account.phoneNumber,
				active: data.account.active,
				gender: String.fromCharCode(data.account.gender) as "M" | "F",
				state: data.account.state,
				pincode: data.account.pincode,
				updatedAt: data.account.updatedAt.toNumber(),
				id: data.publicKey.toBase58(),
			});
		}
		console.log("sims:", SIMs);
	}
	return (
		<main className="flex items-center justify-center h-screen bg-[linear-gradient(to_right_bottom,rgba(0,0,0,0.8),rgba(0,0,0,0.8)),url(/background.jpg)] bg-cover bg-center">
			<div className="absolute top-5 right-5">
				<ConnectWallet />
			</div>
			<div className="bg-gradient-to-b from-[#ffffffb0] to-transparent p-[1px] rounded-2xl">
				<div className="*:mx-5 py-4 rounded-2xl w-[23rem] sm:w-[40rem] md:w-[50rem] bg-black overflow-hidden">
					<h1 className="font-semibold text-xl mb-4">Registered eSIMs</h1>
					<RegisteredSIMs SIMs={SIMs} />
					<AddSIM phoneNumbers={phoneNumbers} />
				</div>
			</div>
		</main>
	);
};

export default ESIM;
