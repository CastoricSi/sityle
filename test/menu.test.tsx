import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";

import { Menu, SiProvider } from "../src/si";

function renderMenu(onSelect = vi.fn()) {
	render(
		<SiProvider>
			<Menu trigger={(p) => <button {...p}>更多</button>} items={[{ label: "编辑", onSelect }, "divider", { label: "删除", danger: true, onSelect }]} />
		</SiProvider>,
	);
	return onSelect;
}

test("Menu floats on <body>, arrows move, Escape closes and returns focus", async () => {
	vi.useFakeTimers({ shouldAdvanceTime: true });
	const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
	const onSelect = renderMenu();
	const trigger = screen.getByRole("button", { name: "更多" });
	await user.click(trigger);
	await act(() => vi.advanceTimersByTimeAsync(60));
	const menu = screen.getByRole("menu");
	expect(menu.parentElement).toBe(document.body);
	expect(document.activeElement?.textContent).toBe("编辑");
	await user.keyboard("{ArrowDown}");
	expect(document.activeElement?.textContent).toBe("删除");
	await user.keyboard("{Enter}");
	expect(onSelect).toHaveBeenCalledTimes(1);
	await user.click(trigger);
	await act(() => vi.advanceTimersByTimeAsync(60));
	await user.keyboard("{Escape}");
	expect(trigger.getAttribute("aria-expanded")).toBe("false");
	expect(document.activeElement).toBe(trigger);
	vi.useRealTimers();
});
