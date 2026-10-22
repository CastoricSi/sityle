// @vitest-environment node
import { renderToString } from "react-dom/server";
import { expect, test } from "vitest";

import { Button, Dialog, IconButton, PasswordField, SelectField, SiProvider, Tooltip, themeScript } from "../src/si";

test("renders on the server", () => {
	const html = renderToString(
		<SiProvider>
			<Button>保存</Button>
			<Tooltip content="提示" open>
				<span>a</span>
			</Tooltip>
			<IconButton label="设置">x</IconButton>
			<PasswordField label="密码" value="x" onChange={() => {}} />
			<SelectField label="选" value="a" onChange={() => {}} options={[{ value: "a", label: "A" }]} />
			<Dialog open onClose={() => {}} title="t" />
		</SiProvider>,
	);
	expect(html).toContain("保存");
});

test("themeScript is a self-contained snippet", () => {
	expect(themeScript).toContain("si-theme");
	expect(() => new Function(themeScript)).not.toThrow();
});
