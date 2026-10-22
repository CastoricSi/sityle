import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";

import { Button } from "../src/si";

test("a loading button ignores clicks (no double submit)", async () => {
	const onClick = vi.fn();
	const { rerender } = render(
		<Button loading onClick={onClick}>
			保存
		</Button>,
	);
	const btn = screen.getByRole("button");
	await userEvent.click(btn);
	await userEvent.click(btn);
	expect(onClick).not.toHaveBeenCalled();
	expect(btn.getAttribute("aria-busy")).toBe("true");
	rerender(<Button onClick={onClick}>保存</Button>);
	await userEvent.click(btn);
	expect(onClick).toHaveBeenCalledTimes(1);
});
