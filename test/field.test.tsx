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

import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { vi } from "vitest";

import { Dialog, SelectField } from "../src/si";

const OPTIONS = [
	{ value: "a", label: "甲" },
	{ value: "b", label: "乙" },
];

function Picker({ inDialog }: { inDialog?: boolean }) {
	const [v, setV] = useState("a");
	const [open, setOpen] = useState(true);
	const field = <SelectField label="选" name="pick" value={v} onChange={setV} options={OPTIONS} />;
	return (
		<form data-testid="form">
			{inDialog ? (
				<Dialog open={open} onClose={() => setOpen(false)} title="t">
					{field}
				</Dialog>
			) : (
				field
			)}
		</form>
	);
}

test("SelectField submits its value with the form", async () => {
	render(
		<SiProvider>
			<Picker />
		</SiProvider>,
	);
	const form = screen.getByTestId("form") as HTMLFormElement;
	expect(new FormData(form).get("pick")).toBe("a");
	await userEvent.click(screen.getByRole("combobox"));
	await userEvent.click(screen.getByRole("option", { name: "乙" }));
	expect(new FormData(form).get("pick")).toBe("b");
});

test("SelectField list floats on <body> and Escape closes it, not the dialog", async () => {
	vi.useFakeTimers({ shouldAdvanceTime: true });
	const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
	render(
		<SiProvider>
			<Picker inDialog />
		</SiProvider>,
	);
	await act(() => vi.advanceTimersByTimeAsync(50));
	await user.click(screen.getByRole("combobox"));
	const list = screen.getByRole("listbox");
	expect(list.parentElement).toBe(document.body);
	await user.keyboard("{Escape}");
	expect(screen.getByRole("combobox").getAttribute("aria-expanded")).toBe("false");
	expect(screen.getByRole("dialog")).toBeTruthy();
	vi.useRealTimers();
});

import { passwordStrength } from "../src/si";

test("passwordStrength sees through repeats, runs and well-known passwords", () => {
	expect(passwordStrength("short")).toBe(0);
	expect(passwordStrength("aaaaaaaaaaaa")).toBe(1);
	expect(passwordStrength("abcdefgh1234")).toBe(1);
	expect(passwordStrength("password123!")).toBe(1);
	expect(passwordStrength("Tr0ub4dor&3")).toBeGreaterThanOrEqual(3);
	expect(passwordStrength("correct horse battery staple")).toBe(4);
});

import { fireEvent } from "@testing-library/react";

import { TextAreaField } from "../src/si";

test("TextAreaField scrolls below its label; a press on the box's padding focuses the text", () => {
	render(<TextAreaField label="注释" defaultValue="春江" />);
	const ta = screen.getByLabelText("注释");
	const box = ta.parentElement!;
	expect(box.classList.contains("is-multiline")).toBe(true);
	fireEvent.mouseDown(box);
	expect(document.activeElement).toBe(ta);
});

test("SelectField plain: no floating label, the label names the box, picking still works", async () => {
	const onChange = vi.fn();
	const user = userEvent.setup();
	render(<SelectField plain label="地点" value="a" onChange={onChange} options={OPTIONS} />);
	const box = screen.getByRole("combobox", { name: "地点" });
	expect(box.closest(".si-field")?.classList.contains("is-plain")).toBe(true);
	expect(document.querySelector(".si-field label")).toBeNull();
	await user.click(box);
	await user.click(screen.getByRole("option", { name: "乙" }));
	expect(onChange).toHaveBeenCalledWith("b");
});
