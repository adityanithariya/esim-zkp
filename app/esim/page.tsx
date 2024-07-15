import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import AddeSIM from "@components/AddeSIM";
import { getDocs, query, where } from "firebase/firestore";
import { eSIMs } from "@firebase/config";
import RegisteredSIMs from "@components/RegisteredSIMs";
import { getServerSession } from "next-auth";
import type { eSIM } from "@type/index";
import authOptions from "@config/auth";

const ESIM = async () => {
	const generatePhoneNumbers = async () => {
		function generatePhoneNumber() {
			const randomNumber =
				Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) +
				1000000000;
			return `91${randomNumber.toString()}`;
		}

		const phoneNumbers: string[] = [];
		for (let i = 0; i < 5; i++) {
			const phoneNumber = generatePhoneNumber();
			const q = query(eSIMs, where("phoneNumber", "==", phoneNumber));
			const querySnapshot = await getDocs(q);
			if (querySnapshot.empty) phoneNumbers.push(phoneNumber);
			else i--;
		}
		return phoneNumbers;
	};
	const phoneNumbers = await generatePhoneNumbers();
	const session = await getServerSession(authOptions);
	const SIMs: eSIM[] = [];
	console.log("session:", session);
	if (session?.address) {
		console.log(session);
		const q = query(eSIMs, where("address", "==", session?.address));
		const querySnapshot = await getDocs(q);
		for (const doc of querySnapshot.docs) {
			SIMs.push({ ...(doc.data() as eSIM), id: doc.id });
		}
	}
	return (
		<main className="flex items-center justify-center h-screen bg-[linear-gradient(to_right_bottom,rgba(0,0,0,0.8),rgba(0,0,0,0.8)),url(/background.jpg)] bg-cover bg-center">
			<div className="absolute top-5 right-5">
				<ConnectButton />
			</div>
			<div className="bg-gradient-to-b from-[#ffffffb0] to-transparent p-[1px] rounded-2xl">
				<div className="*:mx-5 py-4 rounded-2xl w-[23rem] sm:w-[40rem] md:w-[50rem] bg-black overflow-hidden">
					<h1 className="font-semibold text-xl mb-4">
						Registered eSIMs
					</h1>
					<RegisteredSIMs SIMs={SIMs} />
					<AddeSIM phoneNumbers={phoneNumbers} />
				</div>
			</div>
		</main>
	);
};

export default ESIM;
