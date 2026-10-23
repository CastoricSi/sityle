import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { Typography } from "../src/si";

test("each variant renders its element; `as` changes the element, not the look", () => {
	render(
		<>
			<Typography variant="h2">章节</Typography>
			<Typography variant="h3" as="h2">
				像三级的二级标题
			</Typography>
			<Typography>正文</Typography>
			<Typography variant="code">npm i</Typography>
		</>,
	);
	expect(["si-text", "v-h2"].every((c) => screen.getByRole("heading", { level: 2, name: "章节" }).classList.contains(c))).toBe(true);
	expect(["v-h3"].every((c) => screen.getByRole("heading", { level: 2, name: "像三级的二级标题" }).classList.contains(c))).toBe(true);
	expect(screen.getByText("正文").tagName).toBe("P");
	expect(screen.getByText("npm i").tagName).toBe("CODE");
});

test("tone, align and lines", () => {
	render(
		<>
			<Typography tone="muted" align="center" lines={1}>
				一行
			</Typography>
			<Typography lines={3}>三行</Typography>
		</>,
	);
	expect(["t-muted", "a-center", "is-truncate"].every((c) => screen.getByText("一行").classList.contains(c))).toBe(true);
	const three = screen.getByText("三行");
	expect(["is-clamp"].every((c) => three.classList.contains(c))).toBe(true);
	expect(three.style.getPropertyValue("-webkit-line-clamp")).toBe("3");
});
