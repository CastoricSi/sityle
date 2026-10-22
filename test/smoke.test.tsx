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
