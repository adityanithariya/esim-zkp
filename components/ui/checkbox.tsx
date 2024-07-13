"use client";

import React from "react";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

const Checkbox = ({ value }: { value?: boolean }) => {
	return value ? (
		<MdCheckBox className="size-6 cursor-pointer" />
	) : (
		<MdCheckBoxOutlineBlank className="size-6 cursor-pointer" />
	);
};

export default Checkbox;

