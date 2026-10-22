import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";

import { Avatar, Menu, Seal, Segmented, SiProvider, Steps, TabPanel, Tabs, Tooltip } from "../src/si";

const OPTS = [
	{ value: "a", label: "甲" },
	{ value: "b", label: "乙" },
	{ value: "c", label: "丙" },
];

test("Tabs: one Tab stop, arrows / Home / End choose, tabs control their panels", async () => {
	render(
		<>
			<Tabs id="t" label="诗" defaultValue="a" options={OPTS} />
			<TabPanel tabs="t" value="a">
				内容
			</TabPanel>
		</>,
	);
	const [a, b, c] = screen.getAllByRole("tab");
	expect([a, b, c].map((t) => t!.tabIndex)).toEqual([0, -1, -1]);
	await userEvent.tab();
	expect(document.activeElement).toBe(a);
	await userEvent.keyboard("{ArrowRight}");
	expect(document.activeElement).toBe(b);
	expect(b!.getAttribute("aria-selected")).toBe("true");
	await userEvent.keyboard("{End}");
	expect(document.activeElement).toBe(c);
	await userEvent.keyboard("{ArrowRight}");
	expect(document.activeElement).toBe(a);
	expect(a!.getAttribute("aria-controls")).toBe("t-panel-a");
	expect(screen.getByRole("tabpanel").getAttribute("aria-labelledby")).toBe(a!.id);
});

test("Segmented as a radio group moves with arrows", async () => {
	render(<Segmented label="视图" defaultValue="b" options={OPTS} />);
	const radios = screen.getAllByRole("radio");
	expect(radios.map((r) => r.tabIndex)).toEqual([-1, 0, -1]);
	radios[1]!.focus();
	await userEvent.keyboard("{ArrowLeft}");
	expect(radios[0]!.getAttribute("aria-checked")).toBe("true");
});

test("Menu: Home / End, typeahead, Tab closes, ArrowUp on the trigger opens at the end", async () => {
	vi.useFakeTimers({ shouldAdvanceTime: true });
	const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
	const noop = () => {};
	render(
		<SiProvider>
			<Menu trigger={(p) => <button {...p}>更多</button>} items={[{ label: "Edit", onSelect: noop }, { label: "Share", onSelect: noop }, "divider", { label: "Delete", onSelect: noop }]} />
		</SiProvider>,
	);
	const trigger = screen.getByRole("button", { name: "更多" });
	trigger.focus();
	await user.keyboard("{ArrowUp}");
	await act(() => vi.advanceTimersByTimeAsync(60));
	expect(document.activeElement?.textContent).toBe("Delete");
	await user.keyboard("{Home}");
	expect(document.activeElement?.textContent).toBe("Edit");
	await user.keyboard("s");
	expect(document.activeElement?.textContent).toBe("Share");
	await user.keyboard("{Tab}");
	expect(trigger.getAttribute("aria-expanded")).toBe("false");
	vi.useRealTimers();
});

test("Tooltip describes its child; Avatar, Seal and Steps have names", async () => {
	render(
		<SiProvider>
			<Tooltip content="保存到本地">
				<button>存</button>
			</Tooltip>
			<Avatar name="招商银行" />
			<Seal label="已删除">删</Seal>
			<Steps current={2} total={3} label="第 2 步，共 3 步" />
		</SiProvider>,
	);
	const btn = screen.getByRole("button", { name: "存" });
	await userEvent.hover(btn);
	const tip = await screen.findByRole("tooltip");
	expect(btn.getAttribute("aria-describedby")).toBe(tip.id);
	expect(screen.getByRole("img", { name: "招商银行" })).toBeTruthy();
	expect(screen.getByRole("img", { name: "已删除" })).toBeTruthy();
	expect(screen.getByRole("progressbar", { name: "第 2 步，共 3 步" }).getAttribute("aria-valuenow")).toBe("2");
});
