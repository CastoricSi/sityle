import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test } from "vitest";

import { Button, Card, Checkbox, Chip, NavItem, Note, Slider, SiProvider, Switch, Tabs, Tag, TextField } from "../src/si";

test("components pass through className, data-* and ref", () => {
	const btn = createRef<HTMLButtonElement>();
	const sw = createRef<HTMLInputElement>();
	const field = createRef<HTMLInputElement>();
	render(
		<SiProvider>
			<Button ref={btn} className="mine" data-testid="b">
				b
			</Button>
			<Switch ref={sw} checked={false} onChange={() => {}} label="s" name="notify" className="sw" data-testid="sw" />
			<Checkbox checked={false} onChange={() => {}} name="agree" data-testid="cb" required>
				c
			</Checkbox>
			<Slider label="v" value={1} onChange={() => {}} name="vol" data-testid="sl" />
			<TextField ref={field} label="t" className="tf" />
			<Card data-testid="card" className="c" />
			<Tag data-testid="tag">t</Tag>
			<Chip selected={false} onClick={() => {}} data-testid="chip">c</Chip>
			<NavItem label="n" data-testid="nav" />
			<Note data-testid="note">n</Note>
			<Tabs value="a" onChange={() => {}} options={[{ value: "a", label: "A" }]} label="tabs" data-testid="tabs" />
		</SiProvider>,
	);
	expect(btn.current).toBe(screen.getByTestId("b"));
	expect(screen.getByTestId("b").classList.contains("mine")).toBe(true);
	expect(sw.current?.name).toBe("notify");
	expect(screen.getByTestId("sw")).toBe(sw.current);
	expect(sw.current?.closest("label")?.classList.contains("sw")).toBe(true);
	expect((screen.getByTestId("cb") as HTMLInputElement).required).toBe(true);
	expect((screen.getByTestId("sl") as HTMLInputElement).name).toBe("vol");
	expect(field.current?.tagName).toBe("INPUT");
	for (const id of ["card", "tag", "chip", "nav", "note", "tabs"]) expect(screen.getByTestId(id)).toBeTruthy();
});

test("Slider survives min === max and reads out the formatted value", () => {
	render(<Slider label="v" value={3} min={3} max={3} onChange={() => {}} format={(v) => `${v} 号`} />);
	const input = screen.getByRole("slider");
	expect(input.getAttribute("aria-valuetext")).toBe("3 号");
	expect(input.style.getPropertyValue("--p")).toBe("0%");
});
