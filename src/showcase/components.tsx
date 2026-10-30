import {
	Bookmark,
	BookOpen,
	Check,
	ChevronDown,
	ClipboardPaste,
	Copy,
	ExternalLink,
	Feather,
	Folder,
	FolderInput,
	Heart,
	Inbox,
	LayoutGrid,
	List,
	Pencil,
	Plus,
	Save,
	Scissors,
	Settings,
	Share2,
	SlidersHorizontal,
	Smartphone,
	Table2,
	Trash2,
	Users,
	Volume2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import {
	AutoHeight,
	Avatar,
	AvatarStack,
	BrushSpinner,
	BrushStroke,
	Button,
	Card,
	Checkbox,
	Chip,
	ConfirmDialog,
	ContextMenu,
	CopyButton,
	Dialog,
	Fab,
	Group,
	GroupRow,
	IconBadge,
	IconButton,
	InkBars,
	InkDrop,
	InkWash,
	Input,
	ListItem,
	Menu,
	NavItem,
	Note,
	PasswordField,
	Radio,
	RadioCard,
	RadioGroup,
	SearchField,
	Seal,
	Segmented,
	Select,
	SelectField,
	Skeleton,
	Slider,
	Steps,
	StrengthMeter,
	Switch,
	TabPanel,
	Tabs,
	Tag,
	TextArea,
	TextAreaField,
	TextField,
	Tooltip,
	Typography,
} from "@si";
import { CATALOGUE } from "./catalogue";
import { useL } from "./lang";
import { Category, cmpId, Head, Spec, VERSION } from "./ui";

/* ── 组件：按用途分组，每个组件一张卡：做什么用、可以点的演示、常用写法 ── */
export function Components() {
	const L = useL();
	return (
		<section className="sc-section" id="components" aria-labelledby="h-components">
			<Head id="components" title="组件" en="Components">
				{L(
					"按用途分组。每张卡写着这个组件做什么用，下面的演示都可以直接点，最后是最常用的写法。完整的 props 和用法见文档。",
					"Grouped by what they are for. Each card says what the component does; the demo works, try it; the code is the usual way to write it. All the props and more are in the documentation.",
				)}
			</Head>
			<Index />
			<Buttons />
			<Inputs />
			<Choice />
			<Display />
			<LayoutGroup />
			<Overlays />
			<Feedback />
			<Ink />
			<Forms />
		</section>
	);
}

/** Every export, by group; each name jumps to its card. */
function Index() {
	const L = useL();
	const count = CATALOGUE.reduce((n, g) => n + g.items.length, 0);
	return (
		<Card
			title={L(`全部组件 · ${count}`, `All components · ${count}`)}
			description={L(`sityle ${VERSION}。点名字跳到它的卡片。`, `sityle ${VERSION}. Click a name to jump to its card.`)}
			className="sc-directory"
		>
			<dl>
				{CATALOGUE.map((g) => (
					<div key={g.id}>
						<dt>
							<a href={`#cat-${g.id}`}>{L(g.zh, g.en)}</a>
						</dt>
						<dd>
							{g.items.map((e) => (
								<a key={e.name} href={`#${cmpId(e.name)}`}>
									<code>{e.name}</code>
								</a>
							))}
						</dd>
					</div>
				))}
			</dl>
		</Card>
	);
}

/** The group's heading and its line on what it is for, from the catalogue. */
function Cat({ id, children }: { id: string; children: React.ReactNode }) {
	const L = useL();
	const g = CATALOGUE.find((c) => c.id === id)!;
	return (
		<Category id={id} title={g.zh} en={g.en} what={L(g.whatZh, g.whatEn)}>
			{children}
		</Category>
	);
}

/* ── 按钮 ── */
function Buttons() {
	const L = useL();
	const [saving, setSaving] = useState<"idle" | "busy" | "done">("idle");
	const [loved, setLoved] = useState(false);
	const save = () => {
		if (saving !== "idle") return;
		setSaving("busy");
		setTimeout(() => setSaving("done"), 1200);
		setTimeout(() => setSaving("idle"), 2800);
	};
	return (
		<Cat id="buttons">
			<Spec
				names={["Button"]}
				wide
				code={`<Button>${L("保存", "Save")}</Button>
<Button variant="flat" tone="danger" icon={<Trash2 />}>${L("删除", "Delete")}</Button>
<Button loading={saving}>${L("保存", "Save")}</Button>
<Button href="/help" variant="light">${L("帮助", "Help")}</Button>`}
			>
				<div className="sc-stack">
					<Labelled label="variant">
						<Button>solid</Button>
						<Button variant="shadow">shadow</Button>
						<Button variant="flat">flat</Button>
						<Button variant="bordered">bordered</Button>
						<Button variant="light">light</Button>
						<Button variant="ghost">ghost</Button>
					</Labelled>
					<Labelled label="tone">
						<Button>jade</Button>
						<Button tone="azure">azure</Button>
						<Button variant="flat" tone="gold">
							gold
						</Button>
						<Button variant="flat" tone="danger" icon={<Trash2 />}>
							danger
						</Button>
					</Labelled>
					<Labelled label="size · pill · iconOnly · disabled">
						<Button size="sm">sm</Button>
						<Button>md</Button>
						<Button size="lg">lg</Button>
						<Button pill icon={<Plus />}>
							{L("新建", "New")}
						</Button>
						<Button variant="bordered" iconOnly icon={<Plus />} aria-label={L("新建", "New")} />
						<Button disabled>{L("不可用", "Disabled")}</Button>
					</Labelled>
					<Labelled label="loading · href">
						<Button icon={saving === "done" ? <Check /> : <Save />} loading={saving === "busy"} onClick={save} style={{ minWidth: 120 }}>
							{saving === "done" ? L("已保存", "Saved") : L("点我保存", "Save me")}
						</Button>
						<Button href="#sample" variant="light" icon={<BookOpen />}>
							{L("一个链接", "A link")}
						</Button>
					</Labelled>
				</div>
			</Spec>
			<Spec names={["IconButton"]} code={`<IconButton label="${L("收藏", "Bookmark")}" active={on} onClick={toggle}>\n  <Heart />\n</IconButton>`}>
				<div className="sc-row">
					<IconButton label={loved ? L("取消收藏", "Remove bookmark") : L("收藏", "Bookmark")} active={loved} onClick={() => setLoved((v) => !v)}>
						<Heart fill={loved ? "currentColor" : "none"} />
					</IconButton>
					<IconButton label={L("设置", "Settings")}>
						<Settings />
					</IconButton>
					<IconButton label={L("朗读", "Read aloud")}>
						<Volume2 />
					</IconButton>
					<span className="sc-muted">{L("悬停看提示；第一个可以切换", "Hover for the tooltip; the first one toggles")}</span>
				</div>
			</Spec>
			<Spec names={["CopyButton"]} code={`<CopyButton value={text} />`}>
				<div className="sc-row">
					<code className="sc-inline-code">#2c7a58</code>
					<CopyButton value="#2c7a58" />
				</div>
			</Spec>
			<Spec names={["Fab"]} code={`<Fab icon={<Plus />} label="${L("新建", "New")}" onClick={create} />`}>
				<div className="sc-fab-box">
					<span className="sc-muted">{L("真正用时固定在屏幕右下角", "In an app it is fixed at the bottom right of the screen")}</span>
					<Fab icon={<Plus />} label={L("新建", "New")} onClick={() => {}} style={{ position: "absolute", right: 16, bottom: 16 }} />
				</div>
			</Spec>
		</Cat>
	);
}

/** A row of examples with what they vary written above. */
function Labelled({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="sc-labelled">
			<span>{label}</span>
			<div className="sc-row">{children}</div>
		</div>
	);
}

/* ── 输入 ── */
function Inputs() {
	const L = useL();
	const [title, setTitle] = useState(L("春江花月夜", "A Moonlit Night on the Spring River"));
	const [page, setPage] = useState(L("一二七", "one-two-seven"));
	const [pw, setPw] = useState("chunjiang-huayue-ye");
	const [notes, setNotes] = useState(
		L("张若虚，扬州人，与贺知章、张旭、包融并称「吴中四士」。", 'Zhang Ruoxu of Yangzhou, one of the "Four Scholars of Wuzhong" with He Zhizhang, Zhang Xu and Bao Rong.'),
	);
	const [form, setForm] = useState("shi");
	const formOptions = [
		{ value: "", label: L("不限", "Any") },
		{ value: "shi", label: L("诗", "Shi (regulated verse)") },
		{ value: "ci", label: L("词", "Ci (lyrics)") },
		{ value: "qu", label: L("曲", "Qu (songs)") },
	];
	const [search, setSearch] = useState("");
	const [plain, setPlain] = useState("tang");
	const [trial, setTrial] = useState("chunxiao");
	const pageOk = /^\d+$/.test(page);
	return (
		<Cat id="inputs">
			<Spec
				names={["TextField"]}
				code={`<TextField
  label="${L("诗名", "Title")}"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  hint="${L("会显示在列表里", "Shown in the list")}"
  end={<CopyButton value={title} />}
/>`}
			>
				<div className="sc-stack">
					<TextField label={L("诗名", "Title")} value={title} onChange={(e) => setTitle(e.target.value)} end={<CopyButton value={title} />} />
					<TextField
						label={L("页码", "Page")}
						value={page}
						onChange={(e) => setPage(e.target.value)}
						hint={L("填数字就不报错了", "Type digits and the error goes")}
						error={pageOk ? undefined : L("页码只能填数字，如 127", "Digits only, like 127")}
					/>
				</div>
			</Spec>
			<Spec names={["PasswordField"]} code={`<PasswordField label="${L("口令", "Passphrase")}" value={pw} onChange={(e) => setPw(e.target.value)} strength />`}>
				<PasswordField label={L("口令", "Passphrase")} value={pw} onChange={(e) => setPw(e.target.value)} strength />
			</Spec>
			<Spec names={["TextAreaField"]} code={`<TextAreaField label="${L("注释", "Notes")}" value={notes} onChange={(e) => setNotes(e.target.value)} />`}>
				<TextAreaField label={L("注释", "Notes")} value={notes} onChange={(e) => setNotes(e.target.value)} />
			</Spec>
			<Spec
				names={["SelectField"]}
				code={`<SelectField
  label="${L("体裁", "Form")}"
  value={form}
  onChange={setForm}
  options={[
    { value: "shi", label: "${L("诗", "Shi")}" },
    { value: "ci", label: "${L("词", "Ci")}" },
  ]}
/>
// ${L("筛选栏里：和搜索框一样高，没有浮动标签", "In a filter row: as tall as a search box, no floating label")}
<SelectField plain label="${L("体裁", "Form")}" … />`}
			>
				<div style={{ display: "grid", gap: 12 }}>
					<SelectField label={L("体裁", "Form")} value={form} onChange={setForm} options={formOptions} />
					<div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 8 }}>
						<SearchField value={search} onChange={setSearch} label={L("搜索", "Search")} />
						<SelectField plain label={L("体裁", "Form")} value={form} onChange={setForm} options={formOptions} />
					</div>
				</div>
			</Spec>
			<Spec names={["SearchField"]} code={`<SearchField label="${L("搜索", "Search")}" value={q} onChange={setQ} />`}>
				<SearchField value={search} onChange={setSearch} label={L("搜索诗名或作者", "Search titles or poets")} />
			</Spec>
			<Spec
				names={["Input", "TextArea", "Select"]}
				code={`<label htmlFor="q">${L("关键词", "Keywords")}</label>
<Input id="q" placeholder="${L("如：思乡", "e.g. homesick")}" />`}
			>
				<div className="sc-stack" style={{ gap: 10 }}>
					<label htmlFor="plain-input" className="sc-muted">
						{L("关键词（标签自己写在框外）", "Keywords (the label is yours, outside the box)")}
					</label>
					<Input id="plain-input" placeholder={L("如：思乡、送别、边塞", "e.g. homesick, farewell, frontier")} />
					<TextArea rows={2} placeholder={L("写下你的批注", "Write a note")} aria-label={L("批注", "Note")} />
					<Select value={plain} onChange={(e) => setPlain(e.target.value)} aria-label={L("朝代", "Dynasty")}>
						<option value="tang">{L("唐", "Tang")}</option>
						<option value="song">{L("宋", "Song")}</option>
						<option value="yuan">{L("元", "Yuan")}</option>
					</Select>
				</div>
			</Spec>
			<Spec names={["StrengthMeter"]} code={`<Input value={pw} onChange={…} />\n<StrengthMeter value={pw} />`}>
				<div className="sc-stack" style={{ gap: 8 }}>
					<Input mono value={trial} onChange={(e) => setTrial(e.target.value)} aria-label={L("试一个口令", "Try a passphrase")} />
					<StrengthMeter value={trial} />
				</div>
			</Spec>
		</Cat>
	);
}

/* ── 选择 ── */
function Choice() {
	const L = useL();
	const [pinyin, setPinyin] = useState(true);
	const [notes, setNotes] = useState(false);
	const [punct, setPunct] = useState(true);
	const [trad, setTrad] = useState(false);
	const [pace, setPace] = useState("mid");
	const [layout, setLayout] = useState<"v" | "h">("v");
	const [lines, setLines] = useState(12);
	const [view, setView] = useState<"list" | "table" | "cards">("list");
	const [tab, setTab] = useState<"text" | "plain" | "note">("text");
	const chipNames = [L("唐诗", "Tang"), L("宋词", "Song"), L("元曲", "Yuan"), L("乐府", "Yuefu")];
	const [chips, setChips] = useState<Set<string>>(new Set([chipNames[0]!]));
	const panels = {
		text: "春江潮水连海平，海上明月共潮生。",
		plain: L(
			"春天的江潮浩浩荡荡，与大海连成一片；一轮明月从海上升起，像是随着潮水一同涌出。",
			"The spring tide runs level with the sea; the bright moon rises out of it, as if carried in on the tide.",
		),
		note: L("全篇以月为线索，由景入情。", "The moon threads the whole poem, from scene to feeling."),
	};
	return (
		<Cat id="choice">
			<Spec names={["Switch"]} code={`<Switch label="${L("显示拼音", "Show pinyin")}" checked={on} onChange={setOn} />`}>
				<div className="sc-stack">
					<Switch checked={pinyin} onChange={setPinyin} label={L("显示拼音", "Show pinyin")} description={L("在每个字上方标注读音", "Pronunciation above each character")} />
					<Switch checked={notes} onChange={setNotes} label={L("显示注释", "Show notes")} />
				</div>
			</Spec>
			<Spec names={["Checkbox"]} code={`<Checkbox label="${L("标点", "Punctuation")}" checked={on} onChange={setOn} />`}>
				<div className="sc-row" style={{ gap: 20 }}>
					<Checkbox checked={punct} onChange={setPunct} label={L("标点", "Punctuation")} />
					<Checkbox checked={trad} onChange={setTrad} label={L("繁体", "Traditional")} />
				</div>
			</Spec>
			<Spec
				names={["RadioGroup", "Radio"]}
				code={`<RadioGroup label="${L("朗读速度", "Reading speed")}" value={pace} onChange={setPace}>
  <Radio value="slow" label="${L("慢", "Slow")}" />
  <Radio value="fast" label="${L("快", "Fast")}" />
</RadioGroup>`}
			>
				<RadioGroup label={L("朗读速度", "Reading speed")} value={pace} onChange={setPace}>
					<Radio value="slow" label={L("慢", "Slow")} />
					<Radio value="mid" label={L("适中", "Medium")} />
					<Radio value="fast" label={L("快", "Fast")} />
				</RadioGroup>
			</Spec>
			<Spec
				names={["RadioCard"]}
				code={`<RadioCard name="layout" checked={v === "v"} onChange={() => setV("v")}
  icon={<BookOpen />} title="${L("竖排", "Vertical")}" description="…" />`}
			>
				<div className="sc-stack" style={{ gap: 10 }}>
					<RadioCard
						name="layout"
						checked={layout === "v"}
						onChange={() => setLayout("v")}
						icon={<BookOpen />}
						title={L("竖排（推荐）", "Vertical (recommended)")}
						description={L("从右到左，像翻一本线装书。", "Right to left, like a thread-bound book.")}
					/>
					<RadioCard
						name="layout"
						checked={layout === "h"}
						onChange={() => setLayout("h")}
						icon={<List />}
						title={L("横排", "Horizontal")}
						description={L("从左到右，适合在手机上读。", "Left to right, easy on a phone.")}
					/>
				</div>
			</Spec>
			<Spec names={["Slider"]} code={`<Slider label="${L("每页行数", "Lines per page")}" value={n} onChange={setN} min={4} max={24} />`}>
				<Slider label={L("每页行数", "Lines per page")} value={lines} min={4} max={24} onChange={setLines} format={(v) => L(`${v} 行`, `${v} lines`)} />
			</Spec>
			<Spec
				names={["Segmented"]}
				code={`<Segmented label="${L("视图", "View")}" value={view} onChange={setView} options={[
  { value: "list", icon: <List />, label: "${L("列表", "List")}" },
  { value: "table", icon: <Table2 />, label: "${L("表格", "Table")}" },
]} />`}
			>
				<Segmented
					label={L("视图", "View")}
					value={view}
					onChange={setView}
					options={[
						{ value: "list", icon: <List />, label: L("列表", "List") },
						{ value: "table", icon: <Table2 />, label: L("表格", "Table") },
						{ value: "cards", icon: <LayoutGrid />, label: L("卡片", "Cards") },
					]}
				/>
			</Spec>
			<Spec
				names={["Tabs", "TabPanel"]}
				code={`<Tabs id="read" label="${L("阅读", "Reading")}" value={tab} onChange={setTab} options={[…]} />
<TabPanel tabs="read" value={tab}>…</TabPanel>`}
			>
				<div>
					<Tabs
						id="read-tabs"
						label={L("阅读", "Reading")}
						value={tab}
						onChange={setTab}
						options={[
							{ value: "text", label: L("原文", "Original") },
							{ value: "plain", label: L("译文", "Translation") },
							{ value: "note", label: L("赏析", "Notes") },
						]}
					/>
					<TabPanel tabs="read-tabs" value={tab}>
						<motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
							{panels[tab]}
						</motion.div>
					</TabPanel>
				</div>
			</Spec>
			<Spec names={["Chip"]} code={`<Chip selected={on} onClick={toggle}>${L("唐诗", "Tang")}</Chip>`}>
				<div className="sc-row">
					{chipNames.map((c) => (
						<Chip
							key={c}
							selected={chips.has(c)}
							onClick={() =>
								setChips((s) => {
									const n = new Set(s);
									if (n.has(c)) n.delete(c);
									else n.add(c);
									return n;
								})
							}
						>
							{c}
						</Chip>
					))}
				</div>
			</Spec>
		</Cat>
	);
}

/* ── 展示 ── */
function Display() {
	const L = useL();
	const [current, setCurrent] = useState(0);
	const poets = [
		{ name: L("李白", "Li Bai"), works: L("静夜思 · 将进酒", "Quiet Night Thoughts · Bring the Wine") },
		{ name: L("杜甫", "Du Fu"), works: L("春望 · 登高", "Spring View · Climbing High") },
	];
	return (
		<Cat id="display">
			<Spec
				names={["Typography"]}
				wide
				code={`<Typography variant="h2">${L("江月何年初照人", "When did the moon first shine?")}</Typography>
<Typography variant="h3" as="h2">${L("看着像 h3 的二级标题", "An h2 that looks like h3")}</Typography>
<Typography tone="muted" lines={2}>${L("最多两行，多的变成…", "Two lines at most, then …")}</Typography>`}
			>
				<div className="sc-stack">
					<Typography variant="h2">{L("江月何年初照人", "When did the moon first shine on us?")}</Typography>
					<Typography>
						{L("正文用 body。行内的", "Body text is body. Inline")} <Typography variant="code">--si-type-h2</Typography>{" "}
						{L("用 code，字号跟着周围的字走。", "uses code, sized with the text around it.")}
					</Typography>
					<div className="sc-row" style={{ gap: 16 }}>
						<Typography tone="muted">tone="muted"</Typography>
						<Typography tone="faint">"faint"</Typography>
						<Typography tone="jade">"jade"</Typography>
						<Typography tone="azure">"azure"</Typography>
						<Typography tone="gold">"gold"</Typography>
						<Typography tone="danger">"danger"</Typography>
					</div>
					<Typography lines={1} tone="muted" style={{ maxWidth: 360 }}>
						{L("lines={1}：春江潮水连海平，海上明月共潮生。滟滟随波千万里，何处春江无月明。", "lines={1}: The spring river's tide runs level with the sea, and with the tide the bright moon rises.")}
					</Typography>
					<Typography variant="quote">{L("床前明月光，疑是地上霜。", "Bright moonlight before my bed — I took it for frost on the ground.")}</Typography>
					<Typography variant="caption">{L("全部字号见上方「字体」。", "The whole scale is under Type, above.")}</Typography>
				</div>
			</Spec>
			<Spec names={["Card"]} code={`<Card title="${L("阅读设置", "Reading settings")}" description="…">…</Card>`}>
				<Card title={L("阅读设置", "Reading settings")} description={L("卡片里还能放卡片，只是很少需要。", "A card can hold a card; it is rarely needed.")} style={{ boxShadow: "var(--si-e2)" }}>
					<Button size="sm" variant="flat">
						{L("打开", "Open")}
					</Button>
				</Card>
			</Spec>
			<Spec names={["Tag"]} code={`<Tag tone="azure">${L("盛唐", "High Tang")}</Tag>`}>
				<div className="sc-row">
					<Tag icon={<Check />}>{L("已背诵", "Learned")}</Tag>
					<Tag tone="azure">{L("盛唐", "High Tang")}</Tag>
					<Tag tone="gold">{L("待复习", "To review")}</Tag>
					<Tag tone="danger">{L("有异文", "Variants")}</Tag>
				</div>
			</Spec>
			<Spec
				names={["Avatar", "AvatarStack"]}
				code={`<Avatar name="${L("李白", "Li Bai")}" />
<AvatarStack>
  <Avatar name="${L("杜甫", "Du Fu")}" tone="azure" />
  <Avatar name="${L("王维", "Wang Wei")}" tone="gold" />
</AvatarStack>`}
			>
				<div className="sc-row" style={{ gap: 24 }}>
					<Avatar name={L("李白", "Li Bai")} size={48} />
					<AvatarStack>
						<Avatar name={L("李白", "Li Bai")} />
						<Avatar name={L("杜甫", "Du Fu")} tone="azure" />
						<Avatar name={L("王维", "Wang Wei")} tone="gold" />
						<Avatar name={L("苏轼", "Su Shi")} tone="danger" />
					</AvatarStack>
				</div>
			</Spec>
			<Spec names={["Seal"]} code={`<Seal>祀</Seal>\n<Seal size={40} outline>青</Seal>`}>
				<div className="sc-row" style={{ gap: 14 }}>
					<Seal>祀</Seal>
					<Seal size={40}>丹</Seal>
					<Seal size={40} outline>
						青
					</Seal>
					<Seal size={52}>删</Seal>
				</div>
			</Spec>
			<Spec names={["IconBadge"]} code={`<IconBadge><Feather /></IconBadge>`}>
				<div className="sc-row" style={{ gap: 14 }}>
					<IconBadge>
						<Feather />
					</IconBadge>
					<div>
						<Typography variant="h4" as="div">
							{L("还没有诗", "No poems yet")}
						</Typography>
						<Typography variant="body-sm" tone="muted">
							{L("空状态前常放一个图标底座。", "An empty state often starts with one.")}
						</Typography>
					</div>
				</div>
			</Spec>
			<Spec
				names={["ListItem"]}
				code={`<ListItem
  title="${L("李白", "Li Bai")}"
  description="…"
  leading={<Avatar name="${L("李白", "Li Bai")}" decorative />}
  current={open === id}
  onClick={() => setOpen(id)}
/>`}
			>
				<div style={{ display: "grid", gap: 4 }}>
					{poets.map((p, k) => (
						<ListItem
							key={p.name}
							title={p.name}
							description={p.works}
							current={k === current}
							onClick={() => setCurrent(k)}
							leading={<Avatar name={p.name} tone={k ? "azure" : "jade"} decorative />}
						/>
					))}
					<ListItem title={L("没有 onClick：普通一行", "No onClick: a plain row")} description={L("不可点，文字可选", "Not pressable; its text can be selected")} />
				</div>
			</Spec>
			<Spec names={["Note"]} code={`<Note tone="gold">${L("此篇有异文。", "This poem has variants.")}</Note>`}>
				<div className="sc-stack" style={{ gap: 8 }}>
					<Note>{L("neutral：一般说明。", "neutral: an explanation.")}</Note>
					<Note tone="gold">{L("此篇有异文，各版本字句略有不同。", "This poem has variants: editions differ in a few words.")}</Note>
					<Note tone="jade" icon={<Users />}>
						{L("小明 和你分享了诗单「江南」", 'Xiaoming shared the list "Jiangnan" with you')}
					</Note>
				</div>
			</Spec>
		</Cat>
	);
}

/* ── 布局 ── */
function LayoutGroup() {
	const L = useL();
	const [nav, setNav] = useState("tang");
	const [size, setSize] = useState("n");
	const [step, setStep] = useState(2);
	const [more, setMore] = useState(false);
	return (
		<Cat id="layout">
			<Spec names={["NavItem"]} code={`<NavItem icon={<Folder />} label="${L("唐诗", "Tang poems")}" count={214} current={at === "tang"} onClick={…} />`}>
				<div style={{ display: "grid", gap: 2 }}>
					<NavItem icon={<Inbox />} label={L("全部", "All")} count={300} current={nav === "all"} onClick={() => setNav("all")} />
					<NavItem icon={<Folder />} label={L("唐诗", "Tang poems")} count={214} current={nav === "tang"} onClick={() => setNav("tang")} />
					<NavItem icon={<Folder />} label={L("宋词", "Song lyrics")} count={86} current={nav === "song"} onClick={() => setNav("song")} />
					<NavItem icon={<Bookmark />} label={L("已收藏（一个链接）", "Bookmarked (a link)")} tone="jade" href="#sample" />
					<NavItem
						wrap
						label={L(
							"目录里的长标题（wrap）：折成几行，这一行跟着变高，而不是用「…」截断",
							"A long title in a table of contents (wrap): it runs onto more lines and the row grows, instead of ending in “…”",
						)}
						onClick={() => {}}
					/>
				</div>
			</Spec>
			<Spec
				names={["Group", "GroupRow"]}
				code={`<Group title="${L("外观", "Appearance")}">
  <GroupRow title="${L("字号", "Text size")}" description="…">
    <Segmented … />
  </GroupRow>
</Group>`}
			>
				<div className="sc-stack">
					<Group title={L("外观", "Appearance")}>
						<GroupRow title={L("字号", "Text size")} description={L("大字号会放大所有文字", "Large makes all text bigger")}>
							<Segmented
								label={L("字号", "Text size")}
								value={size}
								onChange={setSize}
								options={[
									{ value: "n", label: L("标准", "Normal") },
									{ value: "l", label: L("大", "Large") },
								]}
							/>
						</GroupRow>
						<GroupRow title={L("朗读", "Read aloud")} description={L("读完一首后自动读下一首", "Go on to the next poem when one ends")}>
							<Button variant="bordered" size="sm">
								{L("更改", "Change")}
							</Button>
						</GroupRow>
					</Group>
					<Group plain title={L("plain：没有卡片（用在对话框里）", "plain: no card (inside a dialog)")}>
						<GroupRow title={L("朗读速度", "Reading speed")} description={L("每分钟读多少字", "Characters per minute")}>
							<Button variant="bordered" size="sm">
								{L("200 字", "200 / min")}
							</Button>
						</GroupRow>
					</Group>
				</div>
			</Spec>
			<Spec names={["Steps"]} code={`<Steps current={step} total={3} label={\`${L("第 ${step} 步，共 3 步", "Step ${step} of 3")}\`} />`}>
				<div className="sc-stack">
					<Steps current={step} total={3} label={L(`第 ${step} 步，共 3 步`, `Step ${step} of 3`)} />
					<div className="sc-row">
						<Button size="sm" variant="flat" onClick={() => setStep((n) => (n % 3) + 1)}>
							{L("下一步", "Next")}
						</Button>
						<span className="sc-muted">{L(`第 ${step} 步，共 3 步`, `Step ${step} of 3`)}</span>
					</div>
				</div>
			</Spec>
			<Spec names={["AutoHeight"]} code={`<AutoHeight>\n  {open && <Details />}\n</AutoHeight>`}>
				<div className="sc-stack">
					<div className="sc-row">
						<Button variant="flat" size="sm" icon={<SlidersHorizontal />} onClick={() => setMore((o) => !o)}>
							{more ? L("收起", "Less") : L("展开更多", "More")}
						</Button>
					</div>
					<AutoHeight>
						<div className="sc-stack" style={{ gap: 8 }}>
							<Note>{L("高度跟着内容走。", "The height follows the content.")}</Note>
							{more && <Note tone="jade">{L("展开后多出的一段，容器平滑长高。", "One more paragraph: the box grows smoothly.")}</Note>}
							{more && <Note tone="gold">{L("再收起时平滑变矮。", "Fold it again and it shrinks smoothly.")}</Note>}
						</div>
					</AutoHeight>
				</div>
			</Spec>
		</Cat>
	);
}

/* ── 浮层 ── */
function Overlays() {
	const L = useL();
	const [dialog, setDialog] = useState(false);
	const [confirm, setConfirm] = useState(false);
	// the kind stays while the dialog plays its closing animation
	const [phone, setPhone] = useState<"sheet" | "full">("sheet");
	const [phoneOpen, setPhoneOpen] = useState(false);
	const [picked, setPicked] = useState("");
	return (
		<Cat id="overlays">
			<Spec
				names={["Menu"]}
				code={`<Menu
  trigger={(p) => <Button variant="bordered" {...p}>${L("更多", "More")}</Button>}
  items={[
    { label: "${L("重命名", "Rename")}", icon: <Pencil />, onSelect: rename },
    "divider",
    { label: "${L("删除", "Delete")}", icon: <Trash2 />, danger: true, onSelect: remove },
  ]}
/>`}
			>
				<div className="sc-row">
					<Menu
						trigger={(p) => (
							<Button variant="bordered" {...p}>
								{L("更多", "More")}
								<ChevronDown />
							</Button>
						)}
						items={[
							{ label: L("重命名", "Rename"), icon: <Pencil />, onSelect: () => {} },
							{ label: L("加入诗单…", "Add to list…"), icon: <FolderInput />, onSelect: () => {} },
							{ label: L("分享", "Share"), icon: <Share2 />, kbd: "Ctrl S", onSelect: () => {} },
							{ label: L("导出（即将推出）", "Export (coming soon)"), icon: <ExternalLink />, disabled: true, onSelect: () => {} },
							"divider",
							{ label: L("删除", "Delete"), icon: <Trash2 />, danger: true, onSelect: () => setConfirm(true) },
						]}
					/>
				</div>
			</Spec>
			<Spec
				names={["ContextMenu"]}
				code={`<ContextMenu
  items={[
    { label: "${L("剪切", "Cut")}", icon: <Scissors />, kbd: "Ctrl X", onSelect: cut },
    "divider",
    { heading: "${L("转换为", "Turn into")}" },
    { label: "${L("叙述", "Narration")}", onSelect: toNarration },
  ]}
>
  <div>…</div>
</ContextMenu>`}
			>
				<ContextMenu
					label={L("段落操作", "Paragraph actions")}
					items={[
						{ label: L("剪切", "Cut"), icon: <Scissors />, kbd: "Ctrl X", onSelect: () => setPicked(L("剪切", "Cut")) },
						{ label: L("复制", "Copy"), icon: <Copy />, kbd: "Ctrl C", onSelect: () => setPicked(L("复制", "Copy")) },
						{ label: L("粘贴到后面", "Paste after"), icon: <ClipboardPaste />, disabled: true, onSelect: () => {} },
						"divider",
						{ heading: L("转换为", "Turn into") },
						{ label: L("叙述", "Narration"), onSelect: () => setPicked(L("转换为叙述", "Turn into narration")) },
						{ label: L("对话", "Dialogue"), onSelect: () => setPicked(L("转换为对话", "Turn into dialogue")) },
						"divider",
						{ label: L("删除", "Delete"), icon: <Trash2 />, danger: true, onSelect: () => setPicked(L("删除", "Delete")) },
					]}
				>
					<div className="sc-context-area" tabIndex={0}>
						<span>{L("在这里点右键（或聚焦后按菜单键 / Shift+F10）", "Right-click here (or focus it and press the menu key / Shift+F10)")}</span>
						{picked && <small>{L(`选了：${picked}`, `Picked: ${picked}`)}</small>}
					</div>
				</ContextMenu>
			</Spec>
			<Spec names={["Tooltip"]} code={`<Tooltip content="${L("复制到剪贴板", "Copy to the clipboard")}">\n  <Button>…</Button>\n</Tooltip>`}>
				<div className="sc-row">
					<Tooltip content={L("复制到剪贴板", "Copy to the clipboard")}>
						<Button variant="bordered">{L("悬停或用 Tab 聚焦", "Hover or Tab to it")}</Button>
					</Tooltip>
				</div>
			</Spec>
			<Spec
				names={["Dialog"]}
				code={`<Dialog open={open} onClose={close} title="${L("删除「静夜思」？", 'Delete "Quiet Night"?')}" seal="删"
  actions={<>
    <Button variant="ghost" onClick={close}>${L("取消", "Cancel")}</Button>
    <Button tone="danger" onClick={remove}>${L("删除", "Delete")}</Button>
  </>}>
  ${L("删除后无法恢复。", "This can't be undone.")}
</Dialog>`}
			>
				<div className="sc-stack">
					<div className="sc-row">
						<Button variant="flat" tone="danger" onClick={() => setDialog(true)}>
							{L("打开对话框", "Open a dialog")}
						</Button>
					</div>
					<Typography variant="body-sm" tone="muted">
						{L(
							'手机上（≤600px）对话框从底部升起；phone="full" 铺满屏幕。在窄窗口里试试：',
							'On phones (≤600px) a dialog rises from the bottom; phone="full" fills the screen. Try in a narrow window:',
						)}
					</Typography>
					<div className="sc-row">
						<Button
							variant="bordered"
							size="sm"
							icon={<Smartphone />}
							onClick={() => {
								setPhone("sheet");
								setPhoneOpen(true);
							}}
						>
							{L("底部弹出", "Bottom sheet")}
						</Button>
						<Button
							variant="bordered"
							size="sm"
							icon={<Smartphone />}
							onClick={() => {
								setPhone("full");
								setPhoneOpen(true);
							}}
						>
							phone="full"
						</Button>
					</div>
				</div>
			</Spec>
			<Spec
				names={["ConfirmDialog"]}
				code={`<ConfirmDialog open={open} seal="删" title="${L("删除「江雪」？", 'Delete "River Snow"?')}"
  confirmLabel="${L("删除", "Delete")}" onConfirm={remove} onCancel={close} />`}
			>
				<div className="sc-row">
					<Button variant="flat" tone="danger" icon={<Trash2 />} onClick={() => setConfirm(true)}>
						{L("删除「江雪」", 'Delete "River Snow"')}
					</Button>
				</div>
			</Spec>

			<ConfirmDialog
				open={confirm}
				seal="删"
				title={L("删除「江雪」？", 'Delete "River Snow"?')}
				body={L("删除后无法恢复。", "This can't be undone.")}
				confirmLabel={L("删除", "Delete")}
				onCancel={() => setConfirm(false)}
				onConfirm={() => setConfirm(false)}
			/>
			<Dialog
				open={dialog}
				onClose={() => setDialog(false)}
				seal="删"
				title={L("删除「静夜思」？", 'Delete "Quiet Night Thoughts"?')}
				actions={
					<>
						<Button variant="ghost" onClick={() => setDialog(false)}>
							{L("取消", "Cancel")}
						</Button>
						<Button tone="danger" onClick={() => setDialog(false)}>
							{L("删除", "Delete")}
						</Button>
					</>
				}
			>
				{L("删除后无法恢复，你写的批注也会一起删除。", "This can't be undone; your notes on it go too.")}
			</Dialog>
			<Dialog
				open={phoneOpen}
				onClose={() => setPhoneOpen(false)}
				phone={phone}
				title={phone === "full" ? L("阅读设置", "Reading settings") : L("加入诗单", "Add to a list")}
				actions={<Button onClick={() => setPhoneOpen(false)}>{L("关闭", "Close")}</Button>}
			>
				{phone === "full" ? (
					<div className="sc-stack" style={{ alignContent: "start" }}>
						<span>
							{L(
								"长内容铺满手机屏幕，底部一条线隔开操作按钮。下拉列表浮在对话框之上，不会被裁掉。",
								"Long content fills the phone's screen; a line sets the buttons apart at the bottom. The select list floats above the dialog, never clipped.",
							)}
						</span>
						<TextField label={L("诗单名", "List name")} defaultValue={L("江南", "Jiangnan")} />
						<SelectField
							label={L("排序", "Sort by")}
							defaultValue="time"
							options={[
								{ value: "time", label: L("加入时间", "Date added") },
								{ value: "author", label: L("作者", "Poet") },
							]}
						/>
						<Switch label={L("同步到其他设备", "Sync to my other devices")} defaultChecked />
					</div>
				) : (
					L("短内容从屏幕底部升起，点空白处或按 Esc 关闭。", "Short content rises from the bottom; tap outside or press Esc to close.")
				)}
			</Dialog>
		</Cat>
	);
}

/* ── 反馈 ── */
function Feedback() {
	const L = useL();
	return (
		<Cat id="feedback">
			<Spec names={["InkDrop", "InkBars", "BrushSpinner"]} code={`<InkDrop label="${L("加载中", "Loading")}" />`}>
				<div className="sc-row sc-loaders">
					<figure>
						<InkDrop label={L("加载中", "Loading")} />
						<figcaption>InkDrop</figcaption>
					</figure>
					<figure>
						<InkBars />
						<figcaption>InkBars</figcaption>
					</figure>
					<figure>
						<BrushSpinner />
						<figcaption>BrushSpinner</figcaption>
					</figure>
				</div>
			</Spec>
			<Spec names={["Skeleton"]} code={`<Skeleton width="70%" />`}>
				<div style={{ display: "grid", gap: 8 }}>
					<Skeleton width="70%" />
					<Skeleton width="45%" />
					<Skeleton width="58%" />
				</div>
			</Spec>
		</Cat>
	);
}

/* ── 水墨 ── */
function Ink() {
	const L = useL();
	return (
		<Cat id="ink">
			<Spec names={["InkWash"]} code={`<div style={{ position: "relative" }}>\n  <InkWash />\n  …\n</div>`}>
				<div className="sc-wash-box">
					<InkWash seed={7} />
					<span>{L("同一个 seed 画出同一片墨", "The same seed paints the same wash")}</span>
				</div>
			</Spec>
			<Spec names={["BrushStroke"]} code={`<BrushStroke style={{ width: 120, height: 10 }} />`}>
				<div className="sc-stroke-demo">
					<Typography variant="h3" as="div">
						{L("春江花月夜", "Spring River")}
					</Typography>
					<BrushStroke style={{ width: 140, height: 10, display: "block", color: "var(--si-jade)" }} />
				</div>
			</Spec>
		</Cat>
	);
}

/* ── 表单：非受控，交给 <form> ── */
function Forms() {
	const L = useL();
	const [submitted, setSubmitted] = useState<string | null>(null);
	return (
		<div className="sc-category" id="cat-forms">
			<div className="sc-category-head">
				<h3>
					{L("表单", "Forms")}
					<span className="sc-en">{L("Forms", "表单")}</span>
				</h3>
				<p>
					{L(
						"不想管状态时：不写 value / onChange，给 name 和 defaultValue，交给普通的 <form>。下拉框、开关、单选、滑块都会一起提交。",
						"When you'd rather not keep state: no value / onChange, just name and defaultValue in a plain <form>. Selects, switches, radios and sliders submit too.",
					)}
				</p>
			</div>
			<div className="sc-grid">
				<Card title={L("提交看看 FormData", "Submit to see the FormData")} className="sc-spec-card">
					<form
						className="sc-stack"
						onSubmit={(e) => {
							e.preventDefault();
							setSubmitted(JSON.stringify(Object.fromEntries(new FormData(e.currentTarget)), null, 1));
						}}
					>
						<TextField name="title" label={L("诗名", "Title")} defaultValue={L("山居秋暝", "Autumn Evening in the Mountains")} required />
						<SelectField
							name="dynasty"
							label={L("朝代", "Dynasty")}
							defaultValue="tang"
							options={[
								{ value: "tang", label: L("唐", "Tang") },
								{ value: "song", label: L("宋", "Song") },
							]}
						/>
						<Switch name="pinyin" label={L("显示拼音", "Show pinyin")} defaultChecked />
						<RadioGroup name="pace" label={L("朗读速度", "Reading speed")} defaultValue="mid">
							<Radio value="slow" label={L("慢", "Slow")} />
							<Radio value="mid" label={L("适中", "Medium")} />
						</RadioGroup>
						<Slider name="size" label={L("字号", "Text size")} defaultValue={18} min={14} max={28} format={(v) => `${v}px`} />
						<div className="sc-row">
							<Button type="submit">{L("提交", "Submit")}</Button>
						</div>
						{submitted && <pre className="sc-pre">{submitted}</pre>}
					</form>
				</Card>
			</div>
		</div>
	);
}
