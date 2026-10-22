import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { expect, test, vi } from "vitest";

import { Button, Dialog, SiProvider, TextField } from "../src/si";

function Form() {
	const [open, setOpen] = useState(true);
	const [v, setV] = useState("");
	return (
		<>
			<button>trigger</button>
			<Dialog open={open} onClose={() => setOpen(false)} title="Name" actions={<Button>OK</Button>}>
				<TextField label="名字" value={v} onChange={(e) => setV(e.target.value)} />
			</Dialog>
		</>
	);
}

test("typing in a dialog keeps focus in the field (inline onClose)", async () => {
	vi.useFakeTimers({ shouldAdvanceTime: true });
	const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
	render(
		<SiProvider>
			<Form />
		</SiProvider>,
	);
	await act(() => vi.advanceTimersByTimeAsync(50));
	const field = screen.getByLabelText("名字");
	await user.click(field);
	await user.keyboard("abc");
	await act(() => vi.advanceTimersByTimeAsync(50));
	expect(document.activeElement).toBe(field);
	expect((field as HTMLInputElement).value).toBe("abc");
	vi.useRealTimers();
});
