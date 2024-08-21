import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function hash(address: string): Promise<string> {
	if (!address) return "";
	const msgBuffer = new TextEncoder().encode(address);
	const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

	const hashArray = Array.from(new Uint8Array(hashBuffer));

	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	return hashHex;
}

export const generatePhoneNumbers = async () => {
	function generatePhoneNumber() {
		const randomNumber =
			Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000;
		return `91${randomNumber.toString()}`;
	}

	const phoneNumbers: string[] = [];
	for (let i = 0; i < 5; i++) {
		const phoneNumber = generatePhoneNumber();
		// const q = query(eSIMs, where("phoneNumber", "==", phoneNumber));
		// const querySnapshot = await getDocs(q);
		// if (querySnapshot.empty)
		phoneNumbers.push(phoneNumber);
		// else i--;
	}
	return phoneNumbers;
};
