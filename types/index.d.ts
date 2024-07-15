import type { Timestamp } from "firebase/firestore";

export interface eSIM {
    phoneNumber: string;
    address: string;
    active: boolean;
    gender: "M" | "F";
    state: string;
    pincode: string;
    // biome-ignore lint/suspicious/noExplicitAny: data.proof is variable and just stored to have the identity of the aadhaar
    proof: any;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    id: string;
}