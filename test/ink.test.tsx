import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import { Button, ListItem, NavItem, Segmented } from "../src/si";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const press = (el: Element, pointerType: string) => fireEvent.pointerDown(el, { pointerType, button: 0, clientX: 10, clientY: 10 });

test("a mouse press inks at once", () => {
	render(<Button>按</Button>);
	press(screen.getByRole("button"), "mouse");
	expect(document.querySelectorAll(".si-ink")).toHaveLength(1);
});

test("touch waits: a finger that starts scrolling leaves no ink", () => {
	render(<Button>按</Button>);
	press(screen.getByRole("button"), "touch");
	expect(document.querySelectorAll(".si-ink")).toHaveLength(0);
	fireEvent.pointerMove(window, { clientX: 10, clientY: 60 });
	act(() => void vi.advanceTimersByTime(200));
	expect(document.querySelectorAll(".si-ink")).toHaveLength(0);
});

test("touch: a quick tap still inks when it lifts, a resting finger inks after a moment", () => {
	render(<Button>按</Button>);
	const btn = screen.getByRole("button");
	press(btn, "touch");
	fireEvent.pointerUp(window);
	expect(document.querySelectorAll(".si-ink")).toHaveLength(1);
	press(btn, "touch");
	act(() => void vi.advanceTimersByTime(100));
	expect(document.querySelectorAll(".si-ink")).toHaveLength(2);
});

test("rows and segmented controls press like buttons, without ink", () => {
	render(
		<>
			<ListItem title="静夜思" onClick={() => {}} />
			<NavItem label="收件箱" onClick={() => {}} />
			<Segmented
				label="视图"
				options={[
					{ value: "a", label: "甲" },
					{ value: "b", label: "乙" },
				]}
			/>
		</>,
	);
	for (const el of [screen.getByRole("button", { name: /静夜思/ }), screen.getByRole("button", { name: "收件箱" }), screen.getByRole("radio", { name: "乙" })]) press(el, "mouse");
	expect(document.querySelectorAll(".si-ink")).toHaveLength(0);
});
