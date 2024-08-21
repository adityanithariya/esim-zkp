import type { PublicKey } from "@solana/web3.js";
import type BN from "bn.js";
import type { Timestamp } from "firebase/firestore";

export interface eSIM {
    phoneNumber: string;
    active: boolean;
    gender: "M" | "F";
    state: string;
    pincode: number;
    updatedAt: number;
    id: string;
}