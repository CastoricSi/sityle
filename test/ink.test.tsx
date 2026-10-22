import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import { Button, Segmented } from "../src/si";

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

test("Segmented inks inside its own layer (the sliding pill stays unclipped)", () => {
	render(
		<Segmented
			label="视图"
			options={[
				{ value: "a", label: "甲" },
				{ value: "b", label: "乙" },
			]}
		/>,
	);
	const btn = screen.getByRole("radio", { name: "乙" });
	press(btn, "mouse");
	expect(btn.querySelector(":scope > .si-ink-layer > .si-ink")).toBeTruthy();
	expect(btn.classList.contains("si-ink-host")).toBe(false);
});
