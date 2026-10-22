import {
	Bookmark,
	BookOpen,
	Check,
	ChevronDown,
	Cloud,
	Copy,
	ExternalLink,
	Feather,
	Eye,
	EyeOff,
	Folder,
	FolderInput,
	Heart,
	Inbox,
	LayoutGrid,
	Leaf,
	List,
	Lock,
	LogOut,
	Menu as MenuIcon,
	Monitor,
	Mountain,
	Moon,
	Paperclip,
	Pencil,
	Play,
	Plus,
	RefreshCw,
	Save,
	Search,
	Settings,
	Share2,
	SlidersHorizontal,
	Smartphone,
	Sparkles,
	Sun,
	Table2,
	Tag as TagIcon,
	Trash2,
	Users,
	Volume2,
	X,
	type LucideIcon,
} from "lucide-react";
import { motion, type Transition } from "motion/react";
import { useEffect, useState } from "react";

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
	SelectField,
	Seal,
	Segmented,
	Select,
	Slider,
	StrengthMeter,
	Skeleton,
	spring,
	Steps,
	Switch,
	Tabs,
	Tag,
	TextArea,
	TextAreaField,
	TextField,
	Tooltip,
	useTheme,
	type Tone,
	type ThemeChoice,
} from "@si";
import sigil from "./sigil.webp";

declare const __SI_VERSION__: string;
const VERSION = `v${__SI_VERSION__}`;

const NAV = [
	["color", "色彩"],
	["type", "字体"],
	["shape", "形与层"],
	["motion", "动效"],
	["components", "组件"],
	["sample", "实例"],
	["icons", "图标"],
] as const;

export function App() {
	return (
		<>
			<AppBar />
			<Hero />
			<main className="sc-wrap">
				<Colors />
				<Type />
				<Shape />
				<MotionSection />
				<Components />
				<Sample />
				<Icons />
			</main>
			<footer className="sc-footer">
				<div className="sc-wrap">
					<Seal>青</Seal>水祀丹青 · sityle {VERSION} ·{" "}
					<a href="https://github.com/CastoricSi/sityle">GitHub</a>
				</div>
			</footer>
		</>
	);
}

function AppBar() {
	const { choice, setChoice } = useTheme();
	return (
		<header className="sc-bar">
			<div className="sc-wrap">
				<div className="sc-brand">
					<Seal>祀</Seal>水祀丹青
					<span className="sc-version">{VERSION}</span>
				</div>
				<nav className="sc-nav" aria-label="章节">
					{NAV.map(([id, label]) => (
						<a key={id} href={`#${id}`}>
							{label}
						</a>
					))}
				</nav>
				<Segmented<ThemeChoice>
					label="主题"
					value={choice}
					onChange={setChoice}
					options={[
						{ value: "light", icon: <Sun />, label: <span className="sc-theme-label">宣纸</span>, title: "宣纸（浅色）" },
						{ value: "dark", icon: <Moon />, label: <span className="sc-theme-label">浓墨</span>, title: "浓墨（深色）" },
						{ value: "system", icon: <Monitor />, title: "跟随系统" },
					]}
				/>
			</div>
		</header>
	);
}

function Hero() {
	return (
		<section className="sc-hero" aria-labelledby="hero-title">
			<InkWash />
			<div className="sc-wrap">
				<div className="sc-portrait">
					<svg className="sc-ring" viewBox="0 0 236 236" aria-hidden="true">
						<circle cx="118" cy="118" r="112" fill="none" stroke="var(--si-jade)" strokeWidth="2.5" strokeDasharray="180 40 90 30 260 60" strokeLinecap="round" opacity=".55" />
						<circle cx="118" cy="118" r="106" fill="none" stroke="var(--si-gold)" strokeWidth="1.2" strokeDasharray="2 9" opacity=".7" />
					</svg>
					<img src={sigil} alt="祀" width={208} height={208} />
					<Seal size={50} className="sc-portrait-seal">
						祀
					</Seal>
				</div>
				<div>
					<h1 id="hero-title">
						水祀丹青<small>SITYLE · 设计语言 · {VERSION}</small>
					</h1>
					<p className="sc-lede">石绿为发，石青为手，泥金为饰，浓墨为衣——取「祀」的颜色，铺在一张宣纸上。</p>
					<p className="sc-sub">安静的水墨底子，加上现代 Material 式的交互：按下时墨滴在纸上晕开，开关带一点弹性，对话框像一张纸被轻轻放下。一套颜色、一种节奏，用在以后的每一个项目里。</p>
					<div className="sc-cta">
						<Button size="lg" pill icon={<Sparkles />} onClick={() => document.getElementById("components")?.scrollIntoView({ behavior: "smooth" })}>
							看看组件
						</Button>
						<Button size="lg" pill variant="bordered" onClick={() => document.getElementById("color")?.scrollIntoView({ behavior: "smooth" })}>
							色彩与字体
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}

function Head({ id, title, en, children }: { id: string; title: string; en: string; children: React.ReactNode }) {
	return (
		<div className="sc-head">
			<h2 id={`h-${id}`}>{title}</h2>
			<span className="sc-en">{en}</span>
			<p>{children}</p>
		</div>
	);
}

/* ── 色彩 ── */
const PIGMENTS = [
	["宣纸", "页面底色", "--si-paper"],
	["浓墨", "正文", "--si-ink"],
	["石绿", "主色 · 发色", "--si-jade"],
	["石青", "辅色 · 手套", "--si-azure"],
	["泥金", "点缀 · 饰物", "--si-gold"],
	["朱砂", "危险 · 印章", "--si-cinnabar"],
	["石绿浅", "选中、浅底按钮", "--si-jade-soft"],
	["淡墨", "次要文字", "--si-ink-2"],
] as const;

function Colors() {
	const { resolved } = useTheme();
	const [values, setValues] = useState<Record<string, string>>({});
	const [copied, setCopied] = useState<string | null>(null);
	useEffect(() => {
		// tokens are light-dark(…): let the browser resolve each for the current theme
		const probe = document.createElement("i");
		probe.style.display = "none";
		document.body.appendChild(probe);
		setValues(
			Object.fromEntries(
				PIGMENTS.map(([, , v]) => {
					probe.style.color = `var(${v})`;
					return [v, toHex(getComputedStyle(probe).color)];
				}),
			),
		);
		probe.remove();
	}, [resolved]);
	useEffect(() => {
		if (!copied) return;
		const t = setTimeout(() => setCopied(null), 1500);
		return () => clearTimeout(t);
	}, [copied]);

	return (
		<section className="sc-section" id="color" aria-labelledby="h-color">
			<Head id="color" title="色彩" en="Pigments">
				六种矿物颜料，各司其职。主色只有石绿；石青和泥金只做点缀；朱砂只在危险操作和印章上出现。点一下色块复制色值。
			</Head>
			<div className="sc-swatches">
				{PIGMENTS.map(([name, role, v]) => (
					<motion.button
						key={v}
						type="button"
						className="sc-swatch"
						aria-label={`复制 ${name} 的色值`}
						whileHover={{ y: -3, boxShadow: "var(--si-e2)" }}
						whileTap={{ scale: 0.98 }}
						transition={spring.bouncy}
						onClick={async () => {
							try {
								await navigator.clipboard.writeText(values[v] ?? "");
								setCopied(v);
							} catch {
								// clipboard blocked
							}
						}}
					>
						<div className="sc-swatch-chip" style={{ background: `var(${v})` }} />
						<div className="sc-swatch-meta">
							<b>{name}</b>
							<span>{role}</span>
							<code>
								{values[v]}
								{copied === v && <em>已复制 ✓</em>}
							</code>
						</div>
					</motion.button>
				))}
			</div>
		</section>
	);
}

/* ── 字体 ── */
function Type() {
	const rows: Array<[string, React.CSSProperties, string]> = [
		["brush · 72\n马善政楷", { font: "400 64px/1.05 var(--si-font-brush)" }, "春江花月夜"],
		["display · 30/700\n思源宋体", { font: "700 30px/1.3 var(--si-font-serif)", letterSpacing: ".03em" }, "江畔何人初见月，江月何年初照人"],
		["title · 19/700\n思源宋体", { font: "700 19px/1.4 var(--si-font-serif)" }, "删除「静夜思」？"],
		["body · 15/400\n思源黑体", { maxWidth: "36em" }, "春江潮水连海平，海上明月共潮生。滟滟随波千万里，何处春江无月明。正文保持每行三十到四十个汉字，行高 1.65。"],
		["label · 13/500\n思源黑体", { font: "500 13px/1.4 var(--si-font-sans)", color: "var(--si-ink-2)" }, "诗名 · 作者 · 朝代 · 注释"],
		["mono · 14/500\nJetBrains Mono", { font: "500 14px/1.4 var(--si-font-mono)", letterSpacing: ".06em" }, "卷一百一十七 · 618–907 · #2c7a58"],
	];
	return (
		<section className="sc-section" id="type" aria-labelledby="h-type">
			<Head id="type" title="字体" en="Type">
				书法字只用于品牌和极少数大标题；标题用宋体，正文和界面用黑体，编号、年份、色值等用等宽字。
			</Head>
			<Card>
				{rows.map(([spec, style, text]) => (
					<div className="sc-type-row" key={spec}>
						<div className="sc-spec">{spec}</div>
						<div style={style}>{text}</div>
					</div>
				))}
			</Card>
		</section>
	);
}

/* ── 形与层 ── */
function Shape() {
	const layers: Array<[string, string, React.CSSProperties]> = [
		["凹 · sunk", "输入框、轨道", { boxShadow: "none", background: "var(--si-paper-sunk)" }],
		["一层 · e1", "卡片", { boxShadow: "var(--si-e1)" }],
		["二层 · e2", "悬停、开关", { boxShadow: "var(--si-e2)" }],
		["三层 · e3", "菜单、对话框", { boxShadow: "var(--si-e3)", borderRadius: "var(--si-r-xl)" }],
	];
	return (
		<section className="sc-section" id="shape" aria-labelledby="h-shape">
			<Head id="shape" title="形与层" en="Shape & elevation">
				圆角随尺寸变大：8 / 12 / 18 / 26。阴影是带一点绿的墨色，像纸叠在纸上，而不是悬浮的玻璃。
			</Head>
			<div className="sc-layers">
				{layers.map(([t, d, style]) => (
					<motion.div key={t} className="sc-layer" style={style} whileHover={{ y: -4 }} transition={spring.bouncy}>
						<div>
							<b>{t}</b>
							{d}
						</div>
					</motion.div>
				))}
			</div>
		</section>
	);
}

/* ── 动效 ── */
const LANES: Array<[string, string, Transition]> = [
	["舒展 ease-out\n220ms", "var(--si-jade)", { duration: 0.22, ease: [0.22, 1, 0.36, 1] }],
	["回弹 spring\nbouncy", "var(--si-azure)", spring.bouncy],
	["收 ease-in\n140ms", "var(--si-gold)", { duration: 0.14, ease: [0.55, 0, 0.75, 0.2] }],
	["墨晕 ink\n620ms", "var(--si-cinnabar)", { duration: 0.62, ease: [0.22, 1, 0.36, 1] }],
];

function MotionSection() {
	const [far, setFar] = useState(false);
	return (
		<section className="sc-section" id="motion" aria-labelledby="h-motion">
			<Head id="motion" title="动效" en="Motion">
				四种节奏。进入用「舒展」，有形变的控件（开关、选项卡、对话框）用「回弹」弹簧，离开用「收」，按下时的墨晕用 620ms 慢慢化开。系统开启「减少动态效果」时全部关闭。
			</Head>
			<Card>
				<div className="sc-stack" style={{ gap: 12 }}>
					{LANES.map(([label, color, transition]) => (
						<div className="sc-lane" key={label}>
							<span className="sc-lane-label">{label}</span>
							<div className="sc-track" style={{ display: "flex", justifyContent: far ? "flex-end" : "flex-start" }}>
								<motion.span layout className="sc-dot" style={{ background: color }} transition={transition} />
							</div>
						</div>
					))}
				</div>
				<div className="sc-row" style={{ marginTop: 16 }}>
					<Button variant="flat" size="sm" icon={<Play />} onClick={() => setFar((f) => !f)}>
						播放
					</Button>
				</div>
			</Card>
		</section>
	);
}

/* ── 组件 ── */
function Components() {
	const [saving, setSaving] = useState<"idle" | "busy" | "done">("idle");
	const [title, setTitle] = useState("春江花月夜");
	const [pw, setPw] = useState("chunjiang-huayue-ye");
	const [page, setPage] = useState("一二七");
	const [notes, setNotes] = useState("张若虚，扬州人，与贺知章、张旭、包融并称「吴中四士」。");
	const [sync, setSync] = useState(true);
	const [fields, setFields] = useState(false);
	const [symbols, setSymbols] = useState(true);
	const [similar, setSimilar] = useState(false);
	const [pace, setPace] = useState("mid");
	const [view, setView] = useState<"list" | "table" | "cards">("list");
	const [tab, setTab] = useState<"text" | "plain" | "note">("text");
	const [chips, setChips] = useState<Set<string>>(new Set(["全部"]));
	const [dialog, setDialog] = useState(false);
	const [confirm, setConfirm] = useState(false);
	const [search, setSearch] = useState("");
	const [nav, setNav] = useState("tang");
	const [size, setSize] = useState("n");
	const [step, setStep] = useState(2);
	const [layout, setLayout] = useState<"v" | "h">("v");
	const [form, setForm] = useState("shi");
	const pageOk = /^\d+$/.test(page);

	const save = () => {
		if (saving !== "idle") return;
		setSaving("busy");
		setTimeout(() => setSaving("done"), 1200);
		setTimeout(() => setSaving("idle"), 2800);
	};
	const panels = {
		text: "春江潮水连海平，海上明月共潮生。",
		plain: "春天的江潮浩浩荡荡，与大海连成一片；一轮明月从海上升起，像是随着潮水一同涌出。",
		note: "全篇以月为线索，由景入情，闻一多称之为「诗中的诗，顶峰上的顶峰」。",
	};

	return (
		<section className="sc-section" id="components" aria-labelledby="h-components">
			<Head id="components" title="组件" en="Components">
				每个组件都可以直接点。按钮、菜单、列表项按下时会晕开一滴墨。
			</Head>
			<Directory />
			<div className="sc-grid">
				<Card title="按钮" description="实心只用于每个区域最重要的一个动作。">
					<div className="sc-stack">
						<div className="sc-row">
							<Button>实心</Button>
							<Button variant="shadow">浮起</Button>
							<Button variant="flat">浅底</Button>
							<Button variant="bordered">描边</Button>
							<Button variant="light">文字</Button>
						</div>
						<div className="sc-row">
							<Button tone="azure">石青</Button>
							<Button variant="flat" tone="gold">
								泥金
							</Button>
							<Button variant="flat" tone="danger" icon={<Trash2 />}>
								删除
							</Button>
							<Button tone="danger">确认删除</Button>
						</div>
						<div className="sc-row">
							<Button size="sm">小</Button>
							<Button>中</Button>
							<Button size="lg">大</Button>
							<Button variant="bordered" iconOnly icon={<Plus />} aria-label="新建" />
							<Button pill icon={<Plus />}>
								新建
							</Button>
							<Button disabled>不可用</Button>
						</div>
						<div className="sc-row">
							<Button icon={saving === "done" ? <Check /> : <Save />} loading={saving === "busy"} onClick={save} style={{ minWidth: 120 }}>
								{saving === "done" ? "已保存" : "保存"}
							</Button>
							<span className="sc-muted">点一下：加载 → 完成</span>
						</div>
					</div>
				</Card>

				<Card title="输入框" description="标签在框内，输入时上浮；复制、显示等操作放在框的右端。">
					<div className="sc-stack">
						<TextField label="诗名" value={title} onChange={(e) => setTitle(e.target.value)} end={<CopyButton value={title} />} />
						<PasswordField label="口令" value={pw} onChange={(e) => setPw(e.target.value)} strength />
						<TextField
							label="页码"
							value={page}
							onChange={(e) => setPage(e.target.value)}
							hint="《全唐诗》中的页码"
							error={pageOk ? undefined : "页码只能填数字，如 127"}
						/>
						<TextAreaField label="注释" value={notes} onChange={(e) => setNotes(e.target.value)} />
						<SelectField
							label="体裁"
							value={form}
							onChange={setForm}
							options={[
								{ value: "", label: "不限" },
								{ value: "shi", label: "诗" },
								{ value: "ci", label: "词" },
								{ value: "qu", label: "曲" },
							]}
						/>
						<div style={{ display: "grid", gap: 6 }}>
							<label htmlFor="plain-input" className="sc-muted">
								普通输入框（标签在上方）
							</label>
							<Input id="plain-input" placeholder="如：思乡、送别、边塞" />
						</div>
					</div>
				</Card>

				<Card title="开关 · 勾选 · 单选" description="按住开关时滑块会变宽，松开后弹到位。">
					<div className="sc-stack">
						<Switch checked={sync} onChange={setSync} label="显示拼音" description="在每个字上方标注读音" />
						<Switch checked={fields} onChange={setFields} label="显示注释" description="读到生僻字时展开" />
						<div className="sc-row" style={{ gap: 20 }}>
							<Checkbox checked={symbols} onChange={setSymbols} label="标点" />
							<Checkbox checked={similar} onChange={setSimilar} label="繁体" />
						</div>
						<RadioGroup label="朗读速度" value={pace} onChange={setPace}>
							<Radio value="slow" label="慢" />
							<Radio value="mid" label="适中" />
							<Radio value="fast" label="快" />
						</RadioGroup>
					</div>
				</Card>

				<Card title="选项卡" description="胶囊式用于切换视图；笔触式用于页面内分区。指示条在两项之间滑过去。">
					<div className="sc-stack">
						<div>
							<Segmented
								label="视图"
								role="tablist"
								value={view}
								onChange={setView}
								options={[
									{ value: "list", icon: <List />, label: "列表" },
									{ value: "table", icon: <Table2 />, label: "表格" },
									{ value: "cards", icon: <LayoutGrid />, label: "卡片" },
								]}
							/>
						</div>
						<div>
							<Tabs
								label="阅读"
								value={tab}
								onChange={setTab}
								options={[
									{ value: "text", label: "原文" },
									{ value: "plain", label: "译文" },
									{ value: "note", label: "赏析" },
								]}
							/>
							<motion.div key={tab} className="si-tab-panel" role="tabpanel" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
								{panels[tab]}
							</motion.div>
						</div>
					</div>
				</Card>

				<Card title="标签 · 头像 · 提示" description="筛选用可点的标签；状态用小色块。鼠标停在图标按钮上会出现提示。">
					<div className="sc-stack">
						<div className="sc-row">
							{["全部", "唐诗", "宋词", "元曲", "乐府"].map((c) => (
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
						<div className="sc-row">
							<Tag icon={<Check />}>已背诵</Tag>
							<Tag tone="azure">盛唐</Tag>
							<Tag tone="gold">待复习</Tag>
							<Tag tone="danger">有异文</Tag>
						</div>
						<div className="sc-row" style={{ gap: 18 }}>
							<AvatarStack>
								<Avatar name="李白" />
								<Avatar name="杜甫" tone="azure" />
								<Avatar name="王维" tone="gold" />
								<Avatar name="苏轼" tone="danger" />
							</AvatarStack>
							<IconButton label="收藏">
								<Bookmark />
							</IconButton>
							<IconButton label="设置">
								<Settings />
							</IconButton>
							<IconButton label="朗读">
								<Volume2 />
							</IconButton>
						</div>
					</div>
				</Card>

				<Card title="菜单 · 对话框 · 加载" description="菜单从按钮处展开；对话框只用于需要决定的事，盖上一枚朱印。">
					<div className="sc-stack">
						<div className="sc-row">
							<Menu
								trigger={(p) => (
									<Button variant="bordered" {...p}>
										更多
										<ChevronDown />
									</Button>
								)}
								items={[
									{ label: "重命名", icon: <Pencil />, onSelect: () => {} },
									{ label: "加入诗单…", icon: <FolderInput />, onSelect: () => {} },
									{ label: "分享", icon: <Share2 />, kbd: "Ctrl S", onSelect: () => {} },
									"divider",
									{ label: "删除", icon: <Trash2 />, danger: true, onSelect: () => setDialog(true) },
								]}
							/>
							<Button variant="flat" tone="danger" onClick={() => setDialog(true)}>
								打开对话框
							</Button>
						</div>
						<div className="sc-row" style={{ gap: 22, color: "var(--si-jade)" }}>
							<InkBars />
							<InkDrop label="加载中" />
							<BrushSpinner />
							<div style={{ flex: 1, minWidth: 140, display: "grid", gap: 8 }}>
								<Skeleton width="70%" />
								<Skeleton width="45%" />
							</div>
						</div>
					</div>
				</Card>
				<Card title="导航 · 分组 · 搜索" description="侧边栏的导航行、设置页的分组卡片，以及带清除按钮的搜索框。">
					<div className="sc-stack">
						<SearchField value={search} onChange={setSearch} label="搜索" />
						<div style={{ display: "grid", gap: 2 }}>
							<NavItem icon={<Inbox />} label="全部" count={300} current={nav === "all"} onClick={() => setNav("all")} />
							<NavItem icon={<Folder />} label="唐诗" count={214} current={nav === "tang"} onClick={() => setNav("tang")} />
							<NavItem icon={<Folder />} label="宋词" count={86} current={nav === "song"} onClick={() => setNav("song")} />
							<NavItem icon={<Bookmark />} label="已收藏 · 12 首" tone="jade" />
						</div>
						<Group title="外观">
							<GroupRow title="字号" description="大字号会放大所有文字">
								<Segmented label="字号" value={size} onChange={setSize} options={[{ value: "n", label: "标准" }, { value: "l", label: "大" }]} />
							</GroupRow>
							<GroupRow title="朗读" description="读完一首后自动读下一首">
								<Button variant="bordered" size="sm">更改</Button>
							</GroupRow>
						</Group>
					</div>
				</Card>

				<Card title="步骤 · 选项卡片 · 提示" description="向导用步骤条；二选一用选项卡片；提醒用浅色底的提示。">
					<div className="sc-stack">
						<Steps current={step} total={3} label={`第 ${step} 步，共 3 步`} />
						<RadioCard name="layout" checked={layout === "v"} onChange={() => setLayout("v")} icon={<BookOpen />} title="竖排（推荐）" description="从右到左，像翻一本线装书。" />
						<RadioCard name="layout" checked={layout === "h"} onChange={() => setLayout("h")} icon={<List />} title="横排" description="从左到右，适合在手机上读。" />
						<Note tone="gold">此篇有异文，各版本字句略有不同。</Note>
						<Note tone="jade" icon={<Users />}>
							小明 和你分享了诗单「江南」
						</Note>
						<div style={{ position: "relative", height: 88, borderRadius: 12, background: "var(--si-paper-sunk)" }}>
							<span className="sc-muted" style={{ position: "absolute", left: 14, top: 12 }}>
								浮动按钮（Fab）固定在屏幕右下角
							</span>
							<Fab icon={<Plus />} label="新建" onClick={() => {}} style={{ position: "absolute", right: 16, bottom: 16 }} />
						</div>
						<div className="sc-row">
							<IconBadge>
								<Feather />
							</IconBadge>
							<Button size="sm" variant="flat" onClick={() => setStep((n) => (n % 3) + 1)}>
								下一步
							</Button>
							<Button size="sm" variant="flat" tone="danger" onClick={() => setConfirm(true)}>
								确认对话框
							</Button>
						</div>
					</div>
				</Card>
				<More />
			</div>

			<ConfirmDialog
				open={confirm}
				seal="删"
				title="删除「江雪」？"
				body="删除后无法恢复。"
				confirmLabel="删除"
				onCancel={() => setConfirm(false)}
				onConfirm={() => setConfirm(false)}
			/>
			<Dialog
				open={dialog}
				onClose={() => setDialog(false)}
				seal="删"
				title="删除「静夜思」？"
				actions={
					<>
						<Button variant="ghost" onClick={() => setDialog(false)}>
							取消
						</Button>
						<Button tone="danger" onClick={() => setDialog(false)}>
							删除
						</Button>
					</>
				}
			>
				删除后无法恢复，你写的批注也会一起删除。
			</Dialog>
		</section>
	);
}

/* ── 组件目录：sityle 导出的每一个组件 ── */
const DIRECTORY: Array<[string, string[]]> = [
	["按钮", ["Button", "IconButton", "CopyButton", "Fab"]],
	["输入", ["TextField", "PasswordField", "TextAreaField", "SelectField", "SearchField", "Input", "TextArea", "Select", "StrengthMeter"]],
	["选择", ["Switch", "Checkbox", "RadioGroup", "Radio", "RadioCard", "Slider", "Segmented", "Tabs", "Chip"]],
	["展示", ["Card", "Tag", "Avatar", "AvatarStack", "Seal", "IconBadge", "ListItem", "Note", "Tooltip"]],
	["布局", ["NavItem", "Group", "GroupRow", "Steps", "AutoHeight"]],
	["浮层", ["Menu", "Dialog", "ConfirmDialog"]],
	["反馈", ["InkDrop", "InkBars", "BrushSpinner", "Skeleton"]],
	["水墨", ["SiProvider", "InkWash", "BrushStroke", "spring", "ease", "useTheme"]],
];

function Directory() {
	const count = DIRECTORY.reduce((n, [, names]) => n + names.length, 0);
	return (
		<Card title={`组件目录 · ${count}`} description={`sityle ${VERSION} 导出的全部组件与工具，下方逐一演示。`} className="sc-directory">
			<dl>
				{DIRECTORY.map(([group, names]) => (
					<div key={group}>
						<dt>{group}</dt>
						<dd>
							{names.map((n) => (
								<code key={n}>{n}</code>
							))}
						</dd>
					</div>
				))}
			</dl>
		</Card>
	);
}

/* ── 其余组件：滑块、强度、提示、基础输入、自适应高度、印章、手机上的对话框 ── */
function More() {
	const [lines, setLines] = useState(12);
	const [pw, setPw] = useState("chunxiao");
	const [more, setMore] = useState(false);
	// the kind stays while the dialog plays its closing animation
	const [phone, setPhone] = useState<"sheet" | "full">("sheet");
	const [phoneOpen, setPhoneOpen] = useState(false);
	const [plain, setPlain] = useState("tang");
	return (
		<>
			<Card title="滑块 · 强度 · 提示" description="滑块右上角显示当前值；强度条随输入变化；提示在悬停或键盘聚焦时出现。">
				<div className="sc-stack">
					<Slider label="每页行数" value={lines} min={4} max={24} onChange={setLines} format={(v) => `${v} 行`} />
					<div style={{ display: "grid", gap: 8 }}>
						<Input mono value={pw} onChange={(e) => setPw(e.target.value)} aria-label="试一个口令" />
						<StrengthMeter value={pw} />
					</div>
					<div className="sc-row">
						<Tooltip content="复制到剪贴板">
							<Button variant="bordered" icon={<Copy />}>
								悬停看提示
							</Button>
						</Tooltip>
					</div>
				</div>
			</Card>

			<Card title="基础输入 · 自适应高度" description="Input / TextArea / Select 是不带浮动标签的原始控件；AutoHeight 让内容变化时高度平滑过渡。">
				<div className="sc-stack">
					<Select value={plain} onChange={(e) => setPlain(e.target.value)} aria-label="朝代">
						<option value="tang">唐</option>
						<option value="song">宋</option>
						<option value="yuan">元</option>
					</Select>
					<TextArea rows={2} placeholder="写下你的批注" aria-label="批注" />
					<div className="sc-row">
						<Button variant="flat" size="sm" icon={<SlidersHorizontal />} onClick={() => setMore((o) => !o)}>
							{more ? "收起" : "展开更多"}
						</Button>
					</div>
					<AutoHeight>
						<div className="sc-stack" style={{ gap: 8 }}>
							<Note>高度跟着内容走。</Note>
							{more && <Note tone="jade">展开后多出的一段，容器平滑长高。</Note>}
							{more && <Note tone="danger">再收起时平滑变矮。</Note>}
						</div>
					</AutoHeight>
				</div>
			</Card>

			<Card title="分组（无卡片）· 印章" description="Group plain 用在本身已是一张纸的地方（如设置对话框）；印章有实心和描边两种。">
				<div className="sc-stack">
					<Group plain title="阅读">
						<GroupRow title="朗读速度" description="每分钟读多少字">
							<Button variant="bordered" size="sm">
								200 字
							</Button>
						</GroupRow>
					</Group>
					<div className="sc-row" style={{ gap: 14 }}>
						<Seal>祀</Seal>
						<Seal size={40}>丹</Seal>
						<Seal size={40} outline>
							青
						</Seal>
						<Seal size={52}>删</Seal>
					</div>
				</div>
			</Card>

			<Card title="手机上的对话框" description="窄屏（≤600px）时对话框从底部升起；phone=&quot;full&quot; 用于长内容（设置、表单），铺满屏幕。宽屏上两者都居中。">
				<div className="sc-row">
					<Button variant="bordered" icon={<Smartphone />} onClick={() => { setPhone("sheet"); setPhoneOpen(true); }}>
						底部弹出
					</Button>
					<Button variant="bordered" icon={<Smartphone />} onClick={() => { setPhone("full"); setPhoneOpen(true); }}>
						全屏
					</Button>
				</div>
				<Dialog
					open={phoneOpen}
					onClose={() => setPhoneOpen(false)}
					phone={phone}
					title={phone === "full" ? "阅读设置" : "加入诗单"}
					actions={<Button onClick={() => setPhoneOpen(false)}>关闭</Button>}
				>
					{phone === "full" ? "长内容铺满手机屏幕，底部一条线隔开操作按钮。" : "短内容从屏幕底部升起，点空白处或按 Esc 关闭。"}
				</Dialog>
			</Card>
		</>
	);
}

/* ── 实例 ── */
type Poem = { title: string; author: string; dynasty: string; form: string; tone: Tone; text: string; source: string };
const POEMS: Poem[] = [
	{ title: "静夜思", author: "李白", dynasty: "唐", form: "五言绝句", tone: "jade", text: "床前明月光，疑是地上霜。\n举头望明月，低头思故乡。", source: "zh.wikisource.org/wiki/靜夜思" },
	{ title: "春晓", author: "孟浩然", dynasty: "唐", form: "五言绝句", tone: "azure", text: "春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。", source: "zh.wikisource.org/wiki/春曉" },
	{ title: "江雪", author: "柳宗元", dynasty: "唐", form: "五言绝句", tone: "gold", text: "千山鸟飞绝，万径人踪灭。\n孤舟蓑笠翁，独钓寒江雪。", source: "zh.wikisource.org/wiki/江雪" },
	{ title: "水调歌头", author: "苏轼", dynasty: "宋", form: "词", tone: "danger", text: "明月几时有？把酒问青天。\n不知天上宫阙，今夕是何年。", source: "zh.wikisource.org/wiki/水調歌頭_(蘇軾)" },
	{ title: "天净沙·秋思", author: "马致远", dynasty: "元", form: "小令", tone: "jade", text: "枯藤老树昏鸦，小桥流水人家，古道西风瘦马。\n夕阳西下，断肠人在天涯。", source: "zh.wikisource.org/wiki/天淨沙·秋思" },
];

function Sample() {
	const [i, setI] = useState(0);
	return (
		<section className="sc-section" id="sample" aria-labelledby="h-sample">
			<Head id="sample" title="实例" en="In context">
				放进一个读诗的小应用里：左边是诗目，右边是正文和批注。
			</Head>
			<div className="sc-sample">
				<Card style={{ padding: 10 }}>
					<div style={{ display: "grid", gap: 4 }}>
						{POEMS.map((p, k) => (
							<ListItem key={p.title} title={p.title} description={`${p.dynasty} · ${p.author}`} current={k === i} onClick={() => setI(k)} leading={<Avatar name={p.author} tone={p.tone} />} />
						))}
					</div>
				</Card>
				<Card>
					<SampleDetail key={i} poem={POEMS[i]} />
				</Card>
			</div>
		</section>
	);
}

function SampleDetail({ poem }: { poem: Poem }) {
	const [text, setText] = useState(poem.text);
	const [note, setNote] = useState("");
	const [loved, setLoved] = useState(false);
	return (
		<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}>
			<div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
				<Avatar name={poem.author} tone={poem.tone} size={52} />
				<div style={{ minWidth: 0, flex: 1 }}>
					<div style={{ font: "700 22px/1.3 var(--si-font-serif)" }}>{poem.title}</div>
					<div className="sc-row" style={{ marginTop: 4, gap: 8 }}>
						<span className="sc-muted">
							{poem.dynasty} · {poem.author}
						</span>
						<Tag tone={poem.tone}>{poem.form}</Tag>
					</div>
				</div>
				<IconButton label={loved ? "取消收藏" : "收藏"} active={loved} onClick={() => setLoved((v) => !v)}>
					<Heart fill={loved ? "currentColor" : "none"} />
				</IconButton>
			</div>
			<div className="sc-stack">
				<TextAreaField label="原文" value={text} onChange={(e) => setText(e.target.value)} end={<CopyButton value={text} />} />
				<TextAreaField label="批注" value={note} onChange={(e) => setNote(e.target.value)} hint="读后的一点想法" />
				<TextField
					label="出处"
					value={poem.source}
					readOnly
					end={[
						<CopyButton key="c" value={`https://${poem.source}`} />,
						<IconButton key="o" label="打开出处" onClick={() => window.open(`https://${poem.source}`, "_blank", "noopener")}>
							<ExternalLink />
						</IconButton>,
					]}
				/>
			</div>
			<div className="sc-row" style={{ marginTop: 18, justifyContent: "flex-end" }}>
				<Button variant="light" tone="danger" icon={<Trash2 />}>
					删除
				</Button>
				<Button>保存</Button>
			</div>
		</motion.div>
	);
}

/* ── 图标 ── */
const ICONS: Array<[string, LucideIcon]> = [
	["feather", Feather],
	["book-open", BookOpen],
	["bookmark", Bookmark],
	["heart", Heart],
	["eye", Eye],
	["eye-off", EyeOff],
	["copy", Copy],
	["check", Check],
	["search", Search],
	["plus", Plus],
	["pencil", Pencil],
	["trash-2", Trash2],
	["folder", Folder],
	["tag", TagIcon],
	["paperclip", Paperclip],
	["cloud", Cloud],
	["leaf", Leaf],
	["mountain", Mountain],
	["refresh-cw", RefreshCw],
	["share-2", Share2],
	["users", Users],
	["settings", Settings],
	["log-out", LogOut],
	["external-link", ExternalLink],
	["volume-2", Volume2],
	["lock", Lock],
	["inbox", Inbox],
	["menu", MenuIcon],
	["x", X],
];

function Icons() {
	return (
		<section className="sc-section" id="icons" aria-labelledby="h-icons">
			<Head id="icons" title="图标" en="Icons">
				线性图标，圆头圆角，线宽 1.75，像一笔细毛笔勾出来的。静止时用次要墨色，悬停或选中时变石绿。目前用 Lucide，以后可以换成自绘的一套，只要遵守同样的规则。
			</Head>
			<div className="sc-grid" style={{ marginBottom: 16 }}>
				<Card title="尺寸" description="16 用于行内和标签，20 用于按钮和列表，24 用于导航。">
					<div className="sc-sizes">
						{[16, 20, 24, 32].map((s) => (
							<figure key={s}>
								<Feather size={s} strokeWidth={s >= 32 ? 1.5 : 1.75} />
								{s}
							</figure>
						))}
					</div>
				</Card>
				<Card title="规则">
					<ul className="sc-rules" style={{ marginTop: 14 }}>
						<li>
							<Check />
							一个图标只表达一个意思，同一个意思全站只用一个图标。
						</li>
						<li>
							<Check />
							只有图标的按钮一定有提示文字。
						</li>
						<li className="is-no">
							<X />
							不用填充、双色或表情符号图标。
						</li>
					</ul>
					<div style={{ marginTop: 14, color: "var(--si-jade)" }}>
						<BrushStroke style={{ width: 120, height: 10, display: "block" }} />
					</div>
				</Card>
			</div>
			<Card>
				<div className="sc-icons">
					{ICONS.map(([name, Icon]) => (
						<div className="sc-icon" key={name}>
							<Icon strokeWidth={1.75} />
							{name}
						</div>
					))}
				</div>
			</Card>
		</section>
	);
}

/** "rgb(44, 122, 88)" → "#2c7a58" (keeps alpha as a percentage when there is one). */
function toHex(rgb: string) {
	const [r = 0, g = 0, b = 0, a] = (rgb.match(/[\d.]+/g) ?? []).map(Number);
	const hex = `#${[r, g, b].map((n) => Math.round(n).toString(16).padStart(2, "0")).join("")}`;
	return a !== undefined && a < 1 ? `${hex} · ${Math.round(a * 100)}%` : hex;
}
