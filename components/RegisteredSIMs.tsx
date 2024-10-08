"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { IoWalletOutline } from "react-icons/io5";
import { VscDebugDisconnect } from "react-icons/vsc";
import { AiOutlineDelete } from "react-icons/ai";
import { PiPlugsConnectedThin } from "react-icons/pi";
import React, { useEffect, useState } from "react";
import type { eSIM } from "@type/index";
import { formatPhoneNumber } from "@utils/index";
import clsx from "clsx";
import { deleteDoc, doc } from "firebase/firestore";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@components/ui/dialog";
import Button from "./ui/button";
import { toast } from "react-toastify";
import { eSIMs } from "@firebase/config";
import { useRouter } from "next/navigation";
// import { watchAccount } from "@wagmi/core";
import { useSession } from "next-auth/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program } from "@coral-xyz/anchor";
import idl from "@idl/esim_zkp.json";
import type { EsimZkp } from "@type/esim_zkp";

const RegisteredSIMs = ({ SIMs }: { SIMs: eSIM[] }) => {
	// const { isConnected } = useAccount();
	const { openConnectModal } = useConnectModal();
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { data } = useSession();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [deleteSIM, setDeleteSIM] = useState<eSIM | null>(null);
	const { connection } = useConnection();
	const program = new Program<EsimZkp>(idl as EsimZkp);

	const setActive = async (phoneNumber: string, status: boolean) => {
		if (!publicKey) return;
		setIsLoading(true);
		try {
			const txId = await program.methods
				.setStatus(phoneNumber, status)
				.accounts({ user: publicKey })
				.rpc();
			await connection.confirmTransaction({
				signature: txId,
				...(await connection.getLatestBlockhash()),
			});
			router.refresh();
		} catch (e) {
			console.log(e);
		} finally {
			setIsLoading(false);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: Router is updated at mount
	useEffect(() => {
		if (isAuthenticated && data?.address) router.refresh();
	}, [isAuthenticated, data]);

	const { publicKey } = useWallet();

	useEffect(() => {
		(async () => {
			if (publicKey) router.refresh();
		})();
	}, [publicKey, router]);

	// useEffect(() => {
	// 	const unwatch = watchAccount(WagmiConfig, {
	// 		onChange(account) {
	// 			if (account.isConnected) setIsAuthenticated(true);
	// 		},
	// 	});
	// 	return () => unwatch();
	// }, []);
	const { connected } = useWallet();

	return connected ? (
		<div className="flex flex-col gap-2">
			{SIMs.length === 0 ? (
				<div className="h-[40vh] bg-white/10 flex items-center gap-2 justify-center rounded-md w-full text-sm">
					Register eSIM to view here!
				</div>
			) : null}
			{SIMs.map((SIM) => (
				<div
					key={SIM.id}
					className="bg-white/10 border border-transparent hover:border-white/30 px-3 py-2 rounded-md group"
				>
					<div className="flex justify-between">
						<div className="flex items-center gap-3">
							<div>{formatPhoneNumber(SIM.phoneNumber)}</div>
							<div
								className={clsx(
									"px-1 text-xs h-fit rounded",
									SIM.active ? "bg-green-400" : "bg-red-400",
								)}
							>
								{SIM.active ? "Active" : "Inactive"}
							</div>
						</div>
						<div className="flex sm:gap-3 gap-0">
							{SIM.active ? (
								<abbr title="Deactivate">
									<button
										type="button"
										className="hover:bg-white/15 p-1 rounded md:opacity-0 sm:opacity-100 opacity-100 group-hover:opacity-100"
										onClick={() => setActive(SIM.phoneNumber, false)}
										disabled={isLoading}
									>
										{isLoading ? (
											<div className="loader" />
										) : (
											<VscDebugDisconnect className="text-red-500 size-6" />
										)}
									</button>
								</abbr>
							) : (
								<abbr title="Activate">
									<button
										type="button"
										className="hover:bg-white/15 p-1 rounded md:opacity-0 sm:opacity-100 opacity-100 group-hover:opacity-100"
										onClick={() => setActive(SIM.phoneNumber, true)}
										disabled={isLoading}
									>
										{isLoading ? (
											<div className="loader" />
										) : (
											<PiPlugsConnectedThin className="text-green-500 size-6" />
										)}
									</button>
								</abbr>
							)}
							<abbr title="Delete">
								<button
									type="button"
									className="hover:bg-white/15 p-1 rounded md:opacity-0 sm:opacity-100 opacity-100 group-hover:opacity-100"
									onClick={() => {
										setDeleteSIM(SIM);
										setOpenDeleteDialog(true);
									}}
								>
									<AiOutlineDelete className="text-red-500 size-6" />
								</button>
							</abbr>
						</div>
					</div>
					<abbr
						className="no-underline flex w-fit mb-2"
						title={new Intl.DateTimeFormat("en-US", {
							year: "numeric",
							month: "short",
							day: "numeric",
							hour: "numeric",
							minute: "numeric",
							timeZone: "Asia/Kolkata",
							hour12: true,
						}).format(new Date(SIM.updatedAt))}
					>
						<div className="text-white/45 text-xs">
							{new Date(SIM.updatedAt).toLocaleString("en-US", {
								day: "2-digit",
								month: "long",
								year: "numeric",
							})}
						</div>
					</abbr>
				</div>
			))}
			<Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							Delete eSIM with phone number{" "}
							{deleteSIM?.phoneNumber &&
								formatPhoneNumber(deleteSIM.phoneNumber)}
							?
						</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently delete your
							eSIM and remove your data from our servers.
						</DialogDescription>
					</DialogHeader>
					<div className="flex gap-2">
						<Button
							className="w-full"
							onClick={async () => {
								if (!deleteSIM || !publicKey) return;
								try {
									const txId = await program.methods
										.delete(deleteSIM.phoneNumber)
										.accounts({ user: publicKey })
										.rpc();
									await connection.confirmTransaction({
										signature: txId,
										...(await connection.getLatestBlockhash()),
									});
									toast.success("eSIM deleted successfully");
									router.refresh();
								} catch (e) {
									console.log(e);
								} finally {
									setOpenDeleteDialog(false);
								}
								// await deleteDoc(doc(eSIMs, deleteSIM?.id));
							}}
						>
							Delete
						</Button>
						<Button
							className="!bg-transparent hover:!bg-white/10 w-full"
							onClick={() => setOpenDeleteDialog(false)}
						>
							Cancel
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	) : (
		<button
			type="button"
			className="h-[50vh] bg-white/10 flex items-center gap-2 justify-center rounded-md w-card"
			onClick={openConnectModal}
		>
			<IoWalletOutline className="size-7" />
			<div>Connect Wallet to view eSIMs</div>
		</button>
	);
};

export default RegisteredSIMs;
