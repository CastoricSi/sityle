import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { NavItem } from "../src/si";

test("NavItem wrap: the row may grow with its label; without it the label ends in …", () => {
	render(
		<>
			<NavItem wrap label="很长很长的目录标题" onClick={() => {}} />
			<NavItem label="收件箱" onClick={() => {}} />
		</>,
	);
	expect(screen.getByRole("button", { name: "很长很长的目录标题" }).classList.contains("is-wrap")).toBe(true);
	expect(screen.getByRole("button", { name: "收件箱" }).classList.contains("is-wrap")).toBe(false);
});
