import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";

import { Button, ListItem, NavItem } from "../src/si";

test("href turns Button, NavItem and ListItem into real links", () => {
	render(
		<>
			<Button href="/new">新建</Button>
			<NavItem href="/inbox" label="收件箱" current />
			<ListItem href="/a" title="静夜思" />
			<ListItem title="只读" />
		</>,
	);
	expect(screen.getByRole("link", { name: "新建" }).getAttribute("href")).toBe("/new");
	const nav = screen.getByRole("link", { name: "收件箱" });
	expect(nav.getAttribute("aria-current")).toBe("page");
	expect(screen.getByRole("link", { name: /静夜思/ }).getAttribute("href")).toBe("/a");
	expect(screen.queryByRole("button")).toBeNull();
	expect(screen.getByText("只读").closest("div")?.className).toContain("is-static");
});

test("as renders the app's router link", () => {
	const RouterLink = ({ href, ...p }: { href: string } & React.ComponentProps<"a">) => <a data-router="1" href={`#${href}`} {...p} />;
	render(
		<Button href="/x" as={RouterLink}>
			去
		</Button>,
	);
	const a = screen.getByRole("link");
	expect(a.dataset.router).toBe("1");
	expect(a.getAttribute("href")).toBe("#/x");
});

test("a disabled link drops its href and ignores clicks", async () => {
	const onClick = vi.fn();
	render(
		<Button href="/x" disabled onClick={onClick}>
			去
		</Button>,
	);
	const a = screen.getByText("去").closest("a")!;
	expect(a.hasAttribute("href")).toBe(false);
	expect(a.getAttribute("aria-disabled")).toBe("true");
	await userEvent.click(a);
	expect(onClick).not.toHaveBeenCalled();
});
