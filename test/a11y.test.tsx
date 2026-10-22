import { act, render } from "@testing-library/react";
import axe from "axe-core";
import { expect, test } from "vitest";

import {
	Avatar,
	Button,
	Card,
	Checkbox,
	Chip,
	CopyButton,
	Dialog,
	IconButton,
	ListItem,
	Menu,
	NavItem,
	Note,
	PasswordField,
	Radio,
	RadioCard,
	RadioGroup,
	SearchField,
	Segmented,
	SelectField,
	SiProvider,
	Slider,
	Steps,
	Switch,
	TabPanel,
	Tabs,
	Tag,
	TextAreaField,
	TextField,
} from "../src/si";

test("no axe violations across the components", async () => {
	const { container } = render(
		<SiProvider>
			<main>
				<Card title="卡片" description="说明">
					<Button>保存</Button>
					<Button href="/x" tone="azure">
						链接
					</Button>
					<IconButton label="设置">⚙</IconButton>
					<CopyButton value="x" />
					<TextField label="诗名" hint="提示" />
					<TextAreaField label="批注" />
					<PasswordField label="密码" defaultValue="abc" strength />
					<SelectField label="体裁" defaultValue="a" options={[{ value: "a", label: "诗" }]} />
					<SearchField label="搜索" />
					<Switch label="拼音" description="标注读音" />
					<Checkbox label="标点" />
					<RadioGroup label="速度" defaultValue="a">
						<Radio value="a" label="慢" />
						<Radio value="b" label="快" />
					</RadioGroup>
					<RadioCard name="layout" checked onChange={() => {}} title="竖排" description="从右到左" />
					<Slider label="音量" defaultValue={30} />
					<Segmented
						label="视图"
						options={[
							{ value: "a", label: "列表" },
							{ value: "b", label: "卡片" },
						]}
					/>
					<Tabs
						id="tabs"
						label="分区"
						options={[
							{ value: "a", label: "原文" },
							{ value: "b", label: "译文" },
						]}
					/>
					<TabPanel tabs="tabs" value="a">
						内容
					</TabPanel>
					<Chip selected onClick={() => {}}>
						唐诗
					</Chip>
					<Tag tone="gold">待复习</Tag>
					<Avatar name="李白" />
					<nav aria-label="侧栏">
						<NavItem label="收件箱" href="/inbox" current />
					</nav>
					<ListItem title="静夜思" description="李白" onClick={() => {}} />
					<Steps current={1} total={3} label="第 1 步，共 3 步" />
					<Note tone="danger">注意</Note>
					<Menu trigger={(p) => <button {...p}>更多</button>} items={[{ label: "编辑", onSelect: () => {} }]} />
				</Card>
			</main>
			<Dialog open onClose={() => {}} title="对话框" actions={<Button>好</Button>}>
				正文
			</Dialog>
		</SiProvider>,
	);
	await act(() => new Promise((r) => setTimeout(r, 50)));
	const result = await axe.run(document.body, { rules: { "color-contrast": { enabled: false }, region: { enabled: false } } });
	expect(result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html).join(" | ")}`)).toEqual([]);
	expect(container).toBeTruthy();
});
