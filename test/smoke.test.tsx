import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { Button, SiProvider } from "../src/si";

test("renders a button inside the provider", () => {
	render(
		<SiProvider>
			<Button>保存</Button>
		</SiProvider>,
	);
	expect(screen.getByRole("button", { name: "保存" })).toBeTruthy();
});

test("the shared SVG is added once, however many providers", () => {
	render(
		<>
			<SiProvider>
				<SiProvider>
					<Button>a</Button>
				</SiProvider>
			</SiProvider>
			<SiProvider>
				<Button>b</Button>
			</SiProvider>
		</>,
	);
	expect(document.querySelectorAll("#si-bleed")).toHaveLength(1);
	expect(document.querySelectorAll("#si-stroke")).toHaveLength(1);
});
