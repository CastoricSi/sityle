import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";

import { Checkbox, PasswordField, Radio, RadioGroup, SelectField, SiProvider, Slider, Switch, Tabs } from "../src/si";

test("form controls work uncontrolled and submit with a plain <form>", async () => {
	const onSwitch = vi.fn();
	render(
		<SiProvider>
			<form data-testid="f">
				<Switch name="notify" label="通知" defaultChecked onChange={onSwitch} />
				<Checkbox name="agree" label="同意" />
				<RadioGroup name="size" label="大小" defaultValue="m">
					<Radio value="s" label="小" />
					<Radio value="m" label="中" />
				</RadioGroup>
				<Slider name="vol" label="音量" defaultValue={30} />
				<SelectField
					name="city"
					label="城市"
					defaultValue="bj"
					options={[
						{ value: "bj", label: "北京" },
						{ value: "sh", label: "上海" },
					]}
				/>
				<PasswordField name="pw" label="密码" defaultValue="abc" />
			</form>
			<Tabs
				label="t"
				defaultValue="b"
				options={[
					{ value: "a", label: "A" },
					{ value: "b", label: "B" },
				]}
			/>
		</SiProvider>,
	);
	const data = () => Object.fromEntries(new FormData(screen.getByTestId("f") as HTMLFormElement));
	expect(data()).toEqual({ notify: "on", size: "m", vol: "30", city: "bj", pw: "abc" });

	await userEvent.click(screen.getByRole("switch"));
	await userEvent.click(screen.getByRole("checkbox"));
	await userEvent.click(screen.getByLabelText("小"));
	await userEvent.click(screen.getByRole("combobox"));
	await userEvent.click(screen.getByRole("option", { name: "上海" }));
	expect(data()).toEqual({ agree: "on", size: "s", vol: "30", city: "sh", pw: "abc" });
	expect(onSwitch).toHaveBeenCalledWith(false);

	expect(screen.getByRole("tab", { name: "B" }).getAttribute("aria-selected")).toBe("true");
	await userEvent.click(screen.getByRole("tab", { name: "A" }));
	expect(screen.getByRole("tab", { name: "A" }).getAttribute("aria-selected")).toBe("true");
});
