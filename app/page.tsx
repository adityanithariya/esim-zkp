"use client";

import { LogInWithAnonAadhaar, useAnonAadhaar } from "@anon-aadhaar/react";
import Checkbox from "@components/ui/checkbox";
import { Switch } from "@components/ui/switch";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { type FieldKey, convertBigIntToByteArray } from "@anon-aadhaar/core";
import clsx from "clsx";

export type RevealState = {
	id: FieldKey;
	title: string;
	optional: boolean;
	state: boolean;
	data?: string;
};

const Home = () => {
	const { address, isConnected } = useAccount();
	const { openConnectModal } = useConnectModal();
	const [anonAadhaar, anonAadharCall] = useAnonAadhaar();
	const [testMode, setTestMode] = useState(true);
	const [revealFields, setRevealFields] = useState<RevealState[]>([
		{
			id: "revealAgeAbove18",
			title: "Age Above 18",
			optional: false,
			state: true,
		},
		{
			id: "revealGender",
			title: "Gender",
			optional: false,
			state: true,
		},
		{
			id: "revealPinCode",
			title: "Pin Code",
			optional: true,
			state: true,
		},
		{
			id: "revealState",
			title: "State",
			optional: true,
			state: true,
		},
	]);
	useEffect(() => {
		if (anonAadhaar.status === "logged-in") {
			const data = JSON.parse(anonAadhaar.anonAadhaarProofs[0].pcd);
			const age: Record<string, string> = {
				"1": "Yes",
				"0": "No",
			};
			const fields = [
				data.proof.ageAbove18 && age[data.proof.ageAbove18],
				data.proof.gender,
				data.proof.pincode,
				convertBigIntToByteArray(BigInt(data.proof.state)),
			];
			setRevealFields((revealFields) => [
				...revealFields.map((field, index) => ({
					...field,
					data: field.state ? fields[index] : null,
				})),
			]);
		}
	}, [anonAadhaar]);
	return (
		<main className="flex items-center justify-center h-screen bg-[linear-gradient(to_right_bottom,rgba(0,0,0,0.8),rgba(0,0,0,0.8)),url(/background.jpg)] bg-cover bg-center">
			<div className="absolute top-5 right-5">
				<ConnectButton />
			</div>
			<div className="bg-gradient-to-b from-[#ffffffb0] to-transparent p-[1px] rounded-2xl">
				<div className="*:px-5 pt-4 rounded-2xl w-[26rem] bg-black overflow-hidden">
					<div className="flex justify-between items-center mb-6">
						<h1 className="font-semibold text-xl">Aadhaar ZKP</h1>
						{anonAadhaar.status === "logged-out" && (
							<div className="flex w-fit items-center justify-center gap-2 group">
								<div className="text-sm group-hover:opacity-100 opacity-0 transition-all">
									Test Mode
								</div>
								<Switch
									id="mode"
									checked={testMode}
									onCheckedChange={(checked) =>
										setTestMode(checked)
									}
								/>
							</div>
						)}
					</div>
					<div className="flex flex-col gap-2">
						{revealFields.map((field, index) =>
							anonAadhaar.status === "logged-in" ? (
								field.state && (
									<div key={field.id} className="flex">
										<div className="text-sm text-white/45 w-[40%]">
											{field.title}:{" "}
										</div>
										<div className="text-white">
											{field.data}
										</div>
									</div>
								)
							) : (
								<button
									type="button"
									key={field.id}
									onClick={() =>
										anonAadhaar.status === "logged-out" &&
										field.optional &&
										setRevealFields([
											...revealFields.slice(0, index),
											{
												...field,
												state: !field.state,
											},
											...revealFields.slice(index + 1),
										])
									}
									className={clsx(
										"w-full border rounded-md px-3 py-2 flex items-center justify-start gap-3",
										field.state
											? "border-gray-500 text-white"
											: "border-black text-white/45"
									)}
								>
									<Checkbox value={field.state} />
									<div>
										{field.title}
										{!field.optional && (
											<span className="text-red-500 ml-0.5">
												*
											</span>
										)}
									</div>
								</button>
							)
						)}
					</div>
					{isConnected ? (
						<div className="login-with-anon !p-0">
							{["logged-out", "logging-in"].includes(
								anonAadhaar.status
							) && (
								<LogInWithAnonAadhaar
									useTestAadhaar={testMode}
									nullifierSeed={Math.floor(
										Math.random() * 1983248
									)}
									fieldsToReveal={revealFields
										.filter((field) => field.state)
										.map((field) => field.id)}
									signal={address}
								/>
							)}
							{anonAadhaar.status === "logged-in" && (
								<button
									type="button"
									onClick={() =>
										anonAadharCall({
											type: "logout",
										})
									}
								>
									Logout
								</button>
							)}
						</div>
					) : (
						<button
							type="button"
							className="w-full py-2.5 mt-7 bg-[#0e76fd] text-white font-semibold"
							onClick={() => openConnectModal?.()}
						>
							Connect Wallet
						</button>
					)}
				</div>
			</div>
		</main>
	);
};

export default Home;
