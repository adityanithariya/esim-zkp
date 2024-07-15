import clsx from "clsx";
import React from "react";
import type { HTMLAttributes, MouseEventHandler, ReactNode } from "react";

const Button = ({
	children,
	disabled,
	onClick,
	className,
}: {
	children: ReactNode;
	disabled?: boolean;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	className?: HTMLAttributes<HTMLButtonElement>["className"];
}) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className={clsx(
				"bg-[#0e76fd] py-2.5 rounded-md hover:bg-[#0b60ce]",
				className
			)}
			disabled={disabled}
		>
			{children}
		</button>
	);
};

export default Button;
