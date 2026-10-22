import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { BrushSpinner, ConfirmDialog, CopyButton, en, InkBars, PasswordField, SearchField, SiProvider } from "../src/si";

test("messages switch every built-in text; props still win", () => {
	render(
		<SiProvider messages={en}>
			<CopyButton value="x" />
			<InkBars />
			<BrushSpinner label="Working" />
			<SearchField label="Search" defaultValue="q" />
			<PasswordField label="Password" defaultValue="abc" strength />
			<ConfirmDialog open title="Delete?" confirmLabel="Delete" onConfirm={() => {}} onCancel={() => {}} />
		</SiProvider>,
	);
	expect(screen.getAllByRole("button", { name: "Copy" })).toHaveLength(2);
	expect(screen.getByRole("status", { name: "Loading" })).toBeTruthy();
	expect(screen.getByRole("status", { name: "Working" })).toBeTruthy();
	expect(screen.getByRole("button", { name: "Clear" })).toBeTruthy();
	expect(screen.getByRole("button", { name: "Show" })).toBeTruthy();
	expect(screen.getByText("Too short")).toBeTruthy();
	expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
});

test("without a provider the texts are Chinese", () => {
	render(<InkBars />);
	expect(screen.getByRole("status", { name: "加载中" })).toBeTruthy();
});
