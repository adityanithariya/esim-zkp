"use client";

import { LogInWithAnonAadhaar, useAnonAadhaar } from "@anon-aadhaar/react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@components/ui/select";
import { formatPhoneNumber } from "@utils/index";
import React, { useEffect, useState } from "react";
import Button from "./ui/button";
import { toast } from "react-toastify";
import { convertBigIntToByteArray } from "@anon-aadhaar/core";
import { useRouter } from "next/navigation";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import type { EsimZkp } from "@type/esim_zkp";
import { Program } from "@coral-xyz/anchor";
import idl from "@idl/esim_zkp.json";
import { hash } from "@utils/utils";

const AddSIM = ({ phoneNumbers }: { phoneNumbers: string[] }) => {
	const [open, setOpen] = useState(false);
	const { publicKey, connected } = useWallet();
	const { connection } = useConnection();
	const router = useRouter();
	const [anonAadhaar, setAnonAadhaar] = useAnonAadhaar();
	const [phoneNumber, setPhoneNumber] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const [addrHash, setAddrHash] = useState<string>("");

	useEffect(() => {
		(async () => {
			if (publicKey) setAddrHash(`0x${await hash(publicKey.toBase58())}`);
		})();
	}, [publicKey]);

	const registerESIM = async () => {
		if (!publicKey) return toast.error("Please connect wallet and try again!");
		if (!phoneNumber) return toast.error("Select a phone number!");
		if (anonAadhaar.status !== "logged-in")
			return toast.error("Aadhaar verification needed!");
		setIsLoading(true);
		const data = JSON.parse(anonAadhaar.anonAadhaarProofs[0].pcd);
		console.log(data);
		const age: Record<string, boolean> = {
			"1": true,
			"0": false,
		};
		if (!age[data.proof.ageAbove18])
			return toast.error("Age must be above 18!");
		const program = new Program<EsimZkp>(idl as EsimZkp);
		const txId = await program.methods
			.initialize(
				phoneNumber,
				data.proof.nullifier,
				true,
				Number(data.proof.gender),
				Number(data.proof.pincode),
				convertBigIntToByteArray(BigInt(data.proof.state))
					.toString()
					.split(",")
					.map((i) => String.fromCharCode(Number(i)))
					.reverse()
					.join(""),
			)
			.accounts({ user: publicKey })
			.rpc();
		console.log("txId: ", txId);
		await connection.confirmTransaction({
			signature: txId,
			...(await connection.getLatestBlockhash()),
		});
		setIsLoading(false);
		setOpen(false);
		toast.success("eSIM Registered!");
		setTimeout(() => toast.info("Activate eSIM to start using it!"), 1000);
		router.refresh();
	};
	return (
		<React.Fragment>
			{connected && (
				<Button className="px-16 py-2 mt-4" onClick={() => setOpen(true)}>
					Add eSIM
				</Button>
			)}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add eSIM</DialogTitle>
						<DialogDescription>Add new eSIM to your account</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-3">
						<Select value={phoneNumber} onValueChange={setPhoneNumber}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select Phone Number" />
							</SelectTrigger>
							<SelectContent>
								{phoneNumbers.map((phoneNumber) => (
									<SelectItem key={phoneNumber} value={phoneNumber}>
										{formatPhoneNumber(phoneNumber)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<div className="login-aadhaar-btn !p-0">
							{anonAadhaar.status === "logged-in" ? (
								<Button
									className="w-full"
									onClick={() => setAnonAadhaar({ type: "logout" })}
								>
									Logout
								</Button>
							) : (
								<LogInWithAnonAadhaar
									nullifierSeed={Number(process.env.NULLIFIER_SEED || 0)}
									fieldsToReveal={[
										"revealAgeAbove18",
										"revealGender",
										"revealPinCode",
										"revealState",
									]}
									signal={addrHash}
								/>
							)}
						</div>
						<Button
							onClick={registerESIM}
							disabled={isLoading}
							className="flex items-center justify-center"
						>
							{isLoading ? <div className="loader" /> : "Register eSIM"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</React.Fragment>
	);
};

export default AddSIM;
