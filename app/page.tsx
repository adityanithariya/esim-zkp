"use client";

import Checkbox from "@components/ui/checkbox";
import { Switch } from "@components/ui/switch";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import React from "react";
import { useAccount } from "wagmi";
import { MdCheckBox } from "react-icons/md";

const Home = () => {
	const { address, isConnected } = useAccount();
	const { openConnectModal } = useConnectModal();
	return (
		<main className="flex items-center justify-center h-screen">
			<div className="absolute top-5 right-5">
				<ConnectButton />
			</div>
			<div className="border border-gray-400 px-5 py-4 rounded-2xl w-96">
				<div className="flex justify-between items-center mb-4">
					<h1 className="font-semibold text-xl">Aadhaar ZKP</h1>
					<div className="flex w-fit items-center justify-center gap-2 group">
						<div className="text-sm group-hover:opacity-100 opacity-0 transition-all">
							Test Mode
						</div>
						<Switch id="mode" />
					</div>
				</div>
				<div className="flex flex-col">
					<div className="w-full border border-gray-500 rounded-md px-3 py-2 flex items-center justify-start gap-3">
						<Checkbox />
						<div>Age above 18</div>
					</div>
				</div>
				{!isConnected && (
					<button
						type="button"
						className="w-full py-2 mt-6 bg-white text-black rounded-xl hover:scale-105 transition-all"
						onClick={() => openConnectModal?.()}
					>
						Connect
					</button>
				)}
			</div>
		</main>
	);
};

export default Home;
