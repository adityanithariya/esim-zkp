import clsx from "clsx";
import React from "react";
import type { HTMLAttributes, MouseEventHandler, ReactNode } from "react";

const Button = ({
	children,
	onClick,
	className,
}: {
	children: ReactNode;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	className?: HTMLAttributes<HTMLButtonElement>["className"];
}) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className={clsx("bg-[#0e76fd] py-2.5 rounded-md hover:bg-[#0b60ce]", className)}
		>
			{children}
		</button>
	);
};

export default Button;
