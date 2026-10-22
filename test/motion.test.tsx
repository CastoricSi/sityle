import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

import { Button, Dialog, SiProvider, type MotionChoice } from "../src/si";

// the system asks for reduced motion
const systemReduces = () =>
	vi.spyOn(window, "matchMedia").mockImplementation(
		(q: string) =>
			({
				matches: q.includes("reduced-motion"),
				media: q,
				onchange: null,
				addEventListener() {},
				removeEventListener() {},
				addListener() {},
				removeListener() {},
				dispatchEvent: () => false,
			}) as MediaQueryList,
	);
afterEach(() => vi.restoreAllMocks());

const inks = (motion?: MotionChoice) => {
	const { unmount } = render(
		<SiProvider motion={motion}>
			<Button>按</Button>
		</SiProvider>,
	);
	fireEvent.pointerDown(screen.getByRole("button"), { pointerType: "mouse", button: 0, clientX: 5, clientY: 5 });
	const n = document.querySelectorAll(".si-ink").length;
	unmount();
	return n;
};

test("motion is on by default, whatever the system says", () => {
	systemReduces();
	expect(inks()).toBe(1);
	expect(inks("on")).toBe(1);
});

test('motion="reduce" and "system" (when the system reduces) stop the ink', () => {
	expect(inks("reduce")).toBe(0);
	expect(inks("system")).toBe(1);
	systemReduces();
	expect(inks("system")).toBe(0);
});

test("the setting is on <html> for the CSS, and goes with the provider", () => {
	const { unmount } = render(<SiProvider motion="reduce">x</SiProvider>);
	expect(document.documentElement.getAttribute("data-si-motion")).toBe("reduce");
	unmount();
	expect(document.documentElement.hasAttribute("data-si-motion")).toBe(false);
});

test("a dialog keeps the page where it is: the scroll lock pads by exactly what the scrollbar took", () => {
	const html = document.documentElement;
	// a zoomed page: the scrollbar is 15.4px wide; hiding it widens the page by that
	vi.spyOn(html, "getBoundingClientRect").mockImplementation(() => ({ width: html.style.overflow === "hidden" ? 1280 : 1264.6 }) as DOMRect);
	const { unmount } = render(<Dialog open onClose={() => {}} title="t" />);
	expect(html.style.overflow).toBe("hidden");
	expect(parseFloat(html.style.getPropertyValue("--si-scrollbar"))).toBeCloseTo(15.4);
	unmount();
	expect(html.style.overflow).toBe("");
	expect(html.style.paddingRight).toBe("");
	expect(html.style.getPropertyValue("--si-scrollbar")).toBe("");
});
