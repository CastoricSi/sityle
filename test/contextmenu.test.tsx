import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { expect, test, vi } from "vitest";

import { ContextMenu, SiProvider, type ContextMenuPoint } from "../src/si";

test("ContextMenu: right-click opens it at the pointer on <body>; headings, arrows, Enter picks, Escape hands focus back", async () => {
	const user = userEvent.setup();
	const cut = vi.fn();
	const remove = vi.fn();
	render(
		<SiProvider>
			<button>别处</button>
			<ContextMenu
				label="块操作"
				items={[
					{ label: "剪切", kbd: "Ctrl+X", onSelect: cut },
					"divider",
					{ heading: "转换为" },
					{ label: "叙述", disabled: true, onSelect: () => {} },
					{ label: "删除", danger: true, onSelect: remove },
				]}
			>
				<div tabIndex={0}>内容块</div>
			</ContextMenu>
		</SiProvider>,
	);
	const block = screen.getByText("内容块");
	block.focus();
	fireEvent.contextMenu(block, { clientX: 120, clientY: 80 });
	const menu = await screen.findByRole("menu", { name: "块操作" });
	expect(menu.parentElement).toBe(document.body);
	expect(menu.style.left).toBe("120px");
	expect(menu.style.top).toBe("80px");
	expect(screen.getByText("转换为").getAttribute("role")).toBe("presentation");
	await waitFor(() => expect(document.activeElement?.textContent).toContain("剪切"));
	// the disabled item is skipped
	await user.keyboard("{ArrowDown}");
	expect(document.activeElement?.textContent).toBe("删除");
	await user.keyboard("{Enter}");
	expect(remove).toHaveBeenCalledTimes(1);
	// (jsdom never finishes motion's exit animation, so the closed panel isn't checked for removal)
	expect(document.activeElement).toBe(block);

	block.focus();
	fireEvent.contextMenu(block, { clientX: 10, clientY: 10 });
	await waitFor(() => expect(document.activeElement?.textContent).toContain("剪切"));
	await user.keyboard("{Escape}");
	expect(document.activeElement).toBe(block);
	expect(cut).not.toHaveBeenCalled();
});

test("ContextMenu: the child's own onContextMenu runs first and can keep it closed", () => {
	render(
		<SiProvider>
			<ContextMenu items={[{ label: "甲", onSelect: () => {} }]}>
				<div onContextMenu={(e) => e.preventDefault()}>区域</div>
			</ContextMenu>
		</SiProvider>,
	);
	fireEvent.contextMenu(screen.getByText("区域"), { clientX: 5, clientY: 5 });
	expect(screen.queryByRole("menu")).toBeNull();
});

test("ContextMenu controlled: at + onClose; a press outside closes; near the edge it opens leftwards and upwards", async () => {
	const width = vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(200);
	const height = vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(150);
	const closed = vi.fn();
	function Host() {
		const [at, setAt] = useState<ContextMenuPoint | null>(null);
		return (
			<SiProvider>
				<div onContextMenu={(e) => (e.preventDefault(), setAt({ x: e.clientX, y: e.clientY }))}>表</div>
				<button>外面</button>
				<ContextMenu at={at} onClose={() => (closed(), setAt(null))} items={[{ label: "甲", onSelect: () => {} }]} />
			</SiProvider>
		);
	}
	render(<Host />);
	const vw = document.documentElement.clientWidth || innerWidth;
	fireEvent.contextMenu(screen.getByText("表"), { clientX: vw - 20, clientY: innerHeight - 10 });
	const menu = await screen.findByRole("menu");
	expect(menu.style.left).toBe(`${vw - 20 - 200}px`);
	expect(menu.style.top).toBe(`${innerHeight - 10 - 150}px`);
	expect(menu.style.visibility).toBe("");
	fireEvent.pointerDown(screen.getByText("外面"));
	expect(closed).toHaveBeenCalledTimes(1);
	width.mockRestore();
	height.mockRestore();
});
