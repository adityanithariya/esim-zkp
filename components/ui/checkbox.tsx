"use client";

import React, { useState } from "react";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

const Checkbox = () => {
	const [checked, setChecked] = useState(true);
	return checked ? (
		<MdCheckBox className="size-6" onClick={() => setChecked(false)} />
	) : (
		<MdCheckBoxOutlineBlank
			className="size-6"
			onClick={() => setChecked(true)}
		/>
	);
};

export default Checkbox;

