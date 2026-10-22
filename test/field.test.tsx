import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { PasswordField, SiProvider } from "../src/si";

test("PasswordField lets the caller set autoComplete", () => {
	render(
		<SiProvider>
			<PasswordField label="密码" value="" onChange={() => {}} />
			<PasswordField label="新密码" value="" onChange={() => {}} autoComplete="new-password" />
		</SiProvider>,
	);
	expect(screen.getByLabelText("密码").getAttribute("autocomplete")).toBe("current-password");
	expect(screen.getByLabelText("新密码").getAttribute("autocomplete")).toBe("new-password");
});
