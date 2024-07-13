"use client";

import { AnonAadhaarProvider } from "@anon-aadhaar/react";
import React, { type ReactNode } from "react";

const AnonProvider = ({ children }: Readonly<{ children: ReactNode }>) => {
	return <AnonAadhaarProvider>{children}</AnonAadhaarProvider>;
};

export default AnonProvider;
