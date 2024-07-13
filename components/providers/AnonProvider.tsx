"use client";

import { AnonAadhaarProvider } from "@anon-aadhaar/react";
import React, { useEffect, useState, type ReactNode } from "react";

const AnonProvider = ({ children }: Readonly<{ children: ReactNode }>) => {
	const [ready, setReady] = useState(false);
	useEffect(() => {
		setReady(true);
	}, []);
	return ready && <AnonAadhaarProvider>{children}</AnonAadhaarProvider>;
};

export default AnonProvider;
