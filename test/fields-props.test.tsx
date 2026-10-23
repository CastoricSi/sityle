import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { PasswordField, SelectField, TextAreaField, TextField } from "../src/si";

test("className and style go to the field around the control, native props to the control", () => {
	const { container } = render(
		<>
			<TextField label="诗名" className="mine" style={{ maxWidth: 300 }} name="title" />
			<TextAreaField label="注释" style={{ maxWidth: 400 }} name="notes" />
		</>,
	);
	const [one, two] = container.querySelectorAll<HTMLElement>(".si-field");
	expect(one!.classList.contains("mine")).toBe(true);
	expect(one!.style.maxWidth).toBe("300px");
	expect(two!.style.maxWidth).toBe("400px");
	expect(screen.getByLabelText("诗名").getAttribute("name")).toBe("title");
	expect(screen.getByLabelText("诗名").getAttribute("style")).toBeNull();
});

test("the caller's aria-describedby joins the hint instead of replacing it", () => {
	render(
		<>
			<p id="extra">另外的说明</p>
			<TextField label="页码" hint="填数字" aria-describedby="extra" />
			<SelectField label="体裁" hint="诗词曲" aria-describedby="extra" options={[{ value: "a", label: "诗" }]} />
		</>,
	);
	for (const el of [screen.getByLabelText("页码"), screen.getByRole("combobox")]) {
		const ids = el.getAttribute("aria-describedby")!.split(" ");
		expect(ids).toContain("extra");
		expect(ids.some((id) => id.endsWith("-hint"))).toBe(true);
	}
});

test("the strength bar gives no verdict before anything is typed", () => {
	const { container } = render(<PasswordField label="口令" strength />);
	expect(container.querySelector(".si-strength-label")!.textContent).toBe(" ");
});
