import { act } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { expect, test } from "vitest";

import { Button, IconButton, SiProvider } from "../src/si";

test("hydrates without mismatches when a theme is remembered", async () => {
	const app = (
		<SiProvider>
			<Button>保存</Button>
			<IconButton label="设置">x</IconButton>
		</SiProvider>
	);
	const html = renderToString(app);
	localStorage.setItem("si-theme", "dark");
	const root = document.createElement("div");
	root.innerHTML = html;
	document.body.appendChild(root);
	const errors: unknown[] = [];
	await act(async () => {
		hydrateRoot(root, app, { onRecoverableError: (e) => errors.push(e) });
	});
	expect(errors).toEqual([]);
	expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
	localStorage.clear();
});
