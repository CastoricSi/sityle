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
	TabPanel,
	useTheme,
	zh,
	en,
	SiProvider,
	type Tone,
	type ThemeChoice,
} from "@si";
import { LangContext, useL, useLang, type Lang } from "./lang";
import sigil from "./sigil.webp";

declare const __SI_VERSION__: string;
const VERSION = `v${__SI_VERSION__}`;

const NAV = [
	["color", "色彩", "Color"],
	["type", "字体", "Type"],
	["shape", "形与层", "Shape"],
	["motion", "动效", "Motion"],
	["components", "组件", "Components"],
	["sample", "实例", "In context"],
	["icons", "图标", "Icons"],
] as const;

const LANG_KEY = "sc-lang";
function readLang(): Lang {
	try {
		return localStorage.getItem(LANG_KEY) === "en" ? "en" : "zh";
	} catch {
		return "zh";
	}
}

export function App() {
	// The page's sample text and the texts sityle writes itself (copy, show / hide,
	// cancel…) switch together. Remembered; <html lang> follows.
	const [lang, setLangState] = useState<Lang>(readLang);
	const setLang = (l: Lang) => {
		setLangState(l);
		try {
			localStorage.setItem(LANG_KEY, l);
		} catch {
			// not remembered
		}
	};
	useEffect(() => {
		document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
	}, [lang]);
	return (
		<LangContext.Provider value={lang}>
			<SiProvider messages={lang === "en" ? en : zh}>
				<AppBar lang={lang} onLang={setLang} />
				<Hero />
				<main className="sc-wrap">
					<Colors />
					<Type />
					<Shape />
					<MotionSection />
					{/* examples hold their own text in state: start them over in the new language */}
					<Components key={`c-${lang}`} />
					<Sample key={`s-${lang}`} />
					<Icons />
				</main>
				<footer className="sc-footer">
					<div className="sc-wrap">
						<Seal>青</Seal>水祀丹青 · sityle {VERSION} · <a href="https://github.com/CastoricSi/sityle">GitHub</a>
					</div>
				</footer>
			</SiProvider>
		</LangContext.Provider>
	);
}

function AppBar({ lang, onLang }: { lang: Lang; onLang: (l: Lang) => void }) {
	const { choice, setChoice } = useTheme();
	const L = useL();
	return (
		<header className="sc-bar">
			<div className="sc-wrap">
				<div className="sc-brand">
					<Seal>祀</Seal>水祀丹青
					<span className="sc-version">{VERSION}</span>
				</div>
				<nav className="sc-nav" aria-label={L("章节", "Sections")}>
					{NAV.map(([id, zhLabel, enLabel]) => (
						<a key={id} href={`#${id}`}>
							{L(zhLabel, enLabel)}
						</a>
					))}
				</nav>
				<Segmented<Lang>
					className="sc-lang"
					label={L("语言", "Language")}
					value={lang}
					onChange={onLang}
					options={[
						{ value: "zh", label: "中", title: "中文" },
						{ value: "en", label: "EN", title: "English" },
					]}
				/>
				<Segmented<ThemeChoice>
					label={L("主题", "Theme")}
					value={choice}
					onChange={setChoice}
					options={[
						{ value: "light", icon: <Sun />, label: <span className="sc-theme-label">{L("宣纸", "Paper")}</span>, title: L("宣纸（浅色）", "Paper (light)") },
						{ value: "dark", icon: <Moon />, label: <span className="sc-theme-label">{L("浓墨", "Ink")}</span>, title: L("浓墨（深色）", "Ink (dark)") },
						{ value: "system", icon: <Monitor />, title: L("跟随系统", "Follow the system") },
					]}
				/>
			</div>
		</header>
	);
}

function Hero() {
	const L = useL();
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
						水祀丹青
						<small>
							SITYLE · {L("设计语言", "a design language")} · {VERSION}
						</small>
					</h1>
					<p className="sc-lede">
						{L(
							"石绿为发，石青为手，泥金为饰，浓墨为衣——取「祀」的颜色，铺在一张宣纸上。",
							"Mineral green for the hair, azurite for the hands, gold for the trim, ink for the robe — the colours of 祀, laid on a sheet of rice paper.",
						)}
					</p>
					<p className="sc-sub">
						{L(
							"安静的水墨底子，加上现代 Material 式的交互：按下时墨滴在纸上晕开，开关带一点弹性，对话框像一张纸被轻轻放下。一套颜色、一种节奏，用在以后的每一个项目里。",
							"A quiet ink-wash ground with modern, Material-style interaction: a drop of ink spreads where you press, switches have a little spring, a dialog is set down like a sheet of paper. One set of colours, one rhythm, for every project to come.",
						)}
					</p>
					<div className="sc-cta">
						<Button size="lg" pill icon={<Sparkles />} onClick={() => document.getElementById("components")?.scrollIntoView({ behavior: "smooth" })}>
							{L("看看组件", "See the components")}
						</Button>
						<Button size="lg" pill variant="bordered" onClick={() => document.getElementById("color")?.scrollIntoView({ behavior: "smooth" })}>
							{L("色彩与字体", "Colour and type")}
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}

/** Section title in the page's language, the other language beside it. */
function Head({ id, title, en, children }: { id: string; title: string; en: string; children: React.ReactNode }) {
	const english = useLang() === "en";
	return (
		<div className="sc-head">
			<h2 id={`h-${id}`}>{english ? en : title}</h2>
			<span className="sc-en">{english ? title : en}</span>
			<p>{children}</p>
		</div>
	);
}

/* ── 色彩 ── */
/** [name, role, name in English, role in English, token] */
const PIGMENTS = [
	["宣纸", "页面底色", "Rice paper", "the page", "--si-paper"],
	["浓墨", "正文", "Ink", "body text", "--si-ink"],
	["石绿", "主色 · 发色", "Mineral green", "primary · the hair", "--si-jade"],
	["石青", "辅色 · 手套", "Azurite", "accent · the gloves", "--si-azure"],
	["泥金", "点缀 · 饰物", "Gold", "highlight · the trim", "--si-gold"],
	["朱砂", "危险 · 印章", "Cinnabar", "danger · seals", "--si-cinnabar"],
	["石绿浅", "选中、浅底按钮", "Pale green", "selected, flat buttons", "--si-jade-soft"],
	["淡墨", "次要文字", "Light ink", "secondary text", "--si-ink-2"],
] as const;

function Colors() {
	const { resolved } = useTheme();
	const L = useL();
	const [values, setValues] = useState<Record<string, string>>({});
	const [copied, setCopied] = useState<string | null>(null);
	useEffect(() => {
		// tokens are light-dark(…): let the browser resolve each for the current theme
		const probe = document.createElement("i");
		probe.style.display = "none";
		document.body.appendChild(probe);
		// reading the resolved colours needs the DOM after the theme switched
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setValues(
			Object.fromEntries(
				PIGMENTS.map(([, , , , v]) => {
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
				{L(
					"六种矿物颜料，各司其职。主色只有石绿；石青和泥金只做点缀；朱砂只在危险操作和印章上出现。点一下色块复制色值。",
					"Six mineral pigments, each with one job. Mineral green is the only primary; azurite and gold are accents; cinnabar appears only on dangerous actions and seals. Tap a swatch to copy its value.",
				)}
			</Head>
			<div className="sc-swatches">
				{PIGMENTS.map(([zhName, zhRole, enName, enRole, v]) => {
					const name = L(zhName, enName);
					const role = L(zhRole, enRole);
					return (
						<motion.button
							key={v}
							type="button"
							className="sc-swatch"
							aria-label={L(`复制 ${name} 的色值`, `Copy the value of ${name}`)}
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
									{copied === v && <em>{L("已复制 ✓", "Copied ✓")}</em>}
								</code>
							</div>
						</motion.button>
					);
				})}
			</div>
		</section>
	);
}

/* ── 字体 ── */
function Type() {
	const L = useL();
	const rows: Array<[string, React.CSSProperties, string]> = [
		// the brush face has Chinese only: its sample stays Chinese
		[L("brush · 72\n马善政楷", "brush · 72\nMa Shan Zheng (Chinese only)"), { font: "400 64px/1.05 var(--si-font-brush)" }, "春江花月夜"],
		[
			L("display · 30/700\n思源宋体", "display · 30/700\nNoto Serif SC"),
			{ font: "700 30px/1.3 var(--si-font-serif)", letterSpacing: ".03em" },
			L("江畔何人初见月，江月何年初照人", "Who first saw the moon from this shore?"),
		],
		[L("title · 19/700\n思源宋体", "title · 19/700\nNoto Serif SC"), { font: "700 19px/1.4 var(--si-font-serif)" }, L("删除「静夜思」？", 'Delete "Quiet Night Thoughts"?')],
		[
			L("body · 15/400\n思源黑体", "body · 15/400\nNoto Sans SC"),
			{ maxWidth: "36em" },
			L(
				"春江潮水连海平，海上明月共潮生。滟滟随波千万里，何处春江无月明。正文保持每行三十到四十个汉字，行高 1.65。",
				"The spring river's tide runs level with the sea, and with the tide the bright moon rises from it. Body text keeps lines to about 60–75 characters, line height 1.65.",
			),
		],
		[
			L("label · 13/500\n思源黑体", "label · 13/500\nNoto Sans SC"),
			{ font: "500 13px/1.4 var(--si-font-sans)", color: "var(--si-ink-2)" },
			L("诗名 · 作者 · 朝代 · 注释", "Title · Poet · Dynasty · Notes"),
		],
		[
			L("mono · 14/500\nJetBrains Mono", "mono · 14/500\nJetBrains Mono"),
			{ font: "500 14px/1.4 var(--si-font-mono)", letterSpacing: ".06em" },
			L("卷一百一十七 · 618–907 · #2c7a58", "Vol. 117 · 618–907 · #2c7a58"),
		],
	];
	return (
		<section className="sc-section" id="type" aria-labelledby="h-type">
			<Head id="type" title="字体" en="Type">
				{L(
					"书法字只用于品牌和极少数大标题；标题用宋体，正文和界面用黑体，编号、年份、色值等用等宽字。",
					"Brush lettering only for the brand and the rare display title; serif for headings, sans for body and interface, monospace for numbers, years and colour values.",
				)}
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
	const L = useL();
	const layers: Array<[string, string, React.CSSProperties]> = [
		[L("凹 · sunk", "sunk"), L("输入框、轨道", "fields, tracks"), { boxShadow: "none", background: "var(--si-paper-sunk)" }],
		[L("一层 · e1", "level 1 · e1"), L("卡片", "cards"), { boxShadow: "var(--si-e1)" }],
		[L("二层 · e2", "level 2 · e2"), L("悬停、开关", "hover, switch knobs"), { boxShadow: "var(--si-e2)" }],
		[L("三层 · e3", "level 3 · e3"), L("菜单、对话框", "menus, dialogs"), { boxShadow: "var(--si-e3)", borderRadius: "var(--si-r-xl)" }],
	];
	return (
		<section className="sc-section" id="shape" aria-labelledby="h-shape">
			<Head id="shape" title="形与层" en="Shape & elevation">
				{L(
					"圆角随尺寸变大：8 / 12 / 18 / 26。阴影是带一点绿的墨色，像纸叠在纸上，而不是悬浮的玻璃。",
					"Corners grow with size: 8 / 12 / 18 / 26. Shadows are a slightly green ink, paper laid on paper rather than floating glass.",
				)}
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
/** [label, label in English, colour, transition] */
const LANES: Array<[string, string, string, Transition]> = [
	["舒展 ease-out\n220ms", "unfold · ease-out\n220ms", "var(--si-jade)", { duration: 0.22, ease: [0.22, 1, 0.36, 1] }],
	["回弹 spring\nbouncy", "bounce · spring\nbouncy", "var(--si-azure)", spring.bouncy],
	["收 ease-in\n140ms", "gather · ease-in\n140ms", "var(--si-gold)", { duration: 0.14, ease: [0.55, 0, 0.75, 0.2] }],
	["墨晕 ink\n620ms", "ink bloom\n620ms", "var(--si-cinnabar)", { duration: 0.62, ease: [0.22, 1, 0.36, 1] }],
];

function MotionSection() {
	const L = useL();
	const [far, setFar] = useState(false);
	return (
		<section className="sc-section" id="motion" aria-labelledby="h-motion">
			<Head id="motion" title="动效" en="Motion">
				{L(
					"四种节奏。进入用「舒展」，有形变的控件（开关、选项卡、对话框）用「回弹」弹簧，离开用「收」，按钮按下时的墨晕用 620ms 慢慢化开。系统开启「减少动态效果」时全部关闭。",
					'Four rhythms. Things arrive with "unfold", controls that change shape (switches, tabs, dialogs) "bounce" on a spring, things leave with "gather", and the ink under a pressed button blooms over 620ms. All of it stops when the system asks for reduced motion.',
				)}
			</Head>
			<Card>
				<div className="sc-stack" style={{ gap: 12 }}>
					{LANES.map(([zhLabel, enLabel, color, transition]) => (
						<div className="sc-lane" key={zhLabel}>
							<span className="sc-lane-label">{L(zhLabel, enLabel)}</span>
							<div className="sc-track" style={{ display: "flex", justifyContent: far ? "flex-end" : "flex-start" }}>
								<motion.span layout className="sc-dot" style={{ background: color }} transition={transition} />
							</div>
						</div>
					))}
				</div>
				<div className="sc-row" style={{ marginTop: 16 }}>
					<Button variant="flat" size="sm" icon={<Play />} onClick={() => setFar((f) => !f)}>
						{L("播放", "Play")}
					</Button>
				</div>
			</Card>
		</section>
	);
}

/* ── 组件 ── */
function Components() {
	const L = useL();
	const [saving, setSaving] = useState<"idle" | "busy" | "done">("idle");
	const [title, setTitle] = useState(L("春江花月夜", "A Moonlit Night on the Spring River"));
	const [pw, setPw] = useState("chunjiang-huayue-ye");
	const [page, setPage] = useState(L("一二七", "one-two-seven"));
	const [notes, setNotes] = useState(
		L("张若虚，扬州人，与贺知章、张旭、包融并称「吴中四士」。", 'Zhang Ruoxu of Yangzhou, one of the "Four Scholars of Wuzhong" with He Zhizhang, Zhang Xu and Bao Rong.'),
	);
	const [sync, setSync] = useState(true);
	const [fields, setFields] = useState(false);
	const [symbols, setSymbols] = useState(true);
	const [similar, setSimilar] = useState(false);
	const [pace, setPace] = useState("mid");
	const [view, setView] = useState<"list" | "table" | "cards">("list");
	const [tab, setTab] = useState<"text" | "plain" | "note">("text");
	const chipNames = [L("全部", "All"), L("唐诗", "Tang"), L("宋词", "Song"), L("元曲", "Yuan"), L("乐府", "Yuefu")];
	const [chips, setChips] = useState<Set<string>>(new Set([chipNames[0]!]));
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
		text: L("春江潮水连海平，海上明月共潮生。", "春江潮水连海平，海上明月共潮生。"),
		plain: L(
			"春天的江潮浩浩荡荡，与大海连成一片；一轮明月从海上升起，像是随着潮水一同涌出。",
			"The spring tide runs level with the sea; the bright moon rises out of it, as if carried in on the tide.",
		),
		note: L(
			"全篇以月为线索，由景入情，闻一多称之为「诗中的诗，顶峰上的顶峰」。",
			'The moon threads the whole poem, from scene to feeling; Wen Yiduo called it "the poem of poems, the peak above the peaks".',
		),
	};

	return (
		<section className="sc-section" id="components" aria-labelledby="h-components">
			<Head id="components" title="组件" en="Components">
				{L(
					"每个组件都可以直接点。按钮按下时会晕开一滴墨；整行的列表项、菜单项按下时轻轻一沉。",
					"Every component here works — try them. A pressed button blooms a drop of ink; whole rows (list items, menu items) give a little under your finger.",
				)}
			</Head>
			<Directory />
			<div className="sc-grid">
				<Card title={L("按钮", "Buttons")} description={L("实心只用于每个区域最重要的一个动作。", "Solid only for the one main action of an area.")}>
					<div className="sc-stack">
						<div className="sc-row">
							<Button>{L("实心", "Solid")}</Button>
							<Button variant="shadow">{L("浮起", "Shadow")}</Button>
							<Button variant="flat">{L("浅底", "Flat")}</Button>
							<Button variant="bordered">{L("描边", "Bordered")}</Button>
							<Button variant="light">{L("文字", "Light")}</Button>
						</div>
						<div className="sc-row">
							<Button tone="azure">{L("石青", "Azurite")}</Button>
							<Button variant="flat" tone="gold">
								{L("泥金", "Gold")}
							</Button>
							<Button variant="flat" tone="danger" icon={<Trash2 />}>
								{L("删除", "Delete")}
							</Button>
							<Button tone="danger">{L("确认删除", "Yes, delete")}</Button>
						</div>
						<div className="sc-row">
							<Button size="sm">{L("小", "Small")}</Button>
							<Button>{L("中", "Medium")}</Button>
							<Button size="lg">{L("大", "Large")}</Button>
							<Button variant="bordered" iconOnly icon={<Plus />} aria-label={L("新建", "New")} />
							<Button pill icon={<Plus />}>
								{L("新建", "New")}
							</Button>
							<Button disabled>{L("不可用", "Disabled")}</Button>
						</div>
						<div className="sc-row">
							<Button href="#sample" variant="light" icon={<BookOpen />}>
								{L("链接按钮（href）", "Link button (href)")}
							</Button>
							<span className="sc-muted">{L("有 href 就是真正的 <a>，可中键新开、复制链接", "With href it is a real <a>: middle-click, copy link")}</span>
						</div>
						<div className="sc-row">
							<Button icon={saving === "done" ? <Check /> : <Save />} loading={saving === "busy"} onClick={save} style={{ minWidth: 120 }}>
								{saving === "done" ? L("已保存", "Saved") : L("保存", "Save")}
							</Button>
							<span className="sc-muted">{L("点一下：加载 → 完成", "Tap it: loading → done")}</span>
						</div>
					</div>
				</Card>

				<Card
					title={L("输入框", "Fields")}
					description={L("标签在框内，输入时上浮；复制、显示等操作放在框的右端。", "The label sits inside and floats up as you type; copy, show and the like sit at the right end.")}
				>
					<div className="sc-stack">
						<TextField label={L("诗名", "Title")} value={title} onChange={(e) => setTitle(e.target.value)} end={<CopyButton value={title} />} />
						<PasswordField label={L("口令", "Passphrase")} value={pw} onChange={(e) => setPw(e.target.value)} strength />
						<TextField
							label={L("页码", "Page")}
							value={page}
							onChange={(e) => setPage(e.target.value)}
							hint={L("《全唐诗》中的页码", "Page in the Complete Tang Poems")}
							error={pageOk ? undefined : L("页码只能填数字，如 127", "Digits only, like 127")}
						/>
						<TextAreaField label={L("注释", "Notes")} value={notes} onChange={(e) => setNotes(e.target.value)} />
						<SelectField
							label={L("体裁", "Form")}
							value={form}
							onChange={setForm}
							options={[
								{ value: "", label: L("不限", "Any") },
								{ value: "shi", label: L("诗", "Shi (regulated verse)") },
								{ value: "ci", label: L("词", "Ci (lyrics)") },
								{ value: "qu", label: L("曲", "Qu (songs)") },
							]}
						/>
						<div style={{ display: "grid", gap: 6 }}>
							<label htmlFor="plain-input" className="sc-muted">
								{L("普通输入框（标签在上方）", "Plain input (label above)")}
							</label>
							<Input id="plain-input" placeholder={L("如：思乡、送别、边塞", "e.g. homesick, farewell, frontier")} />
						</div>
					</div>
				</Card>

				<Card
					title={L("开关 · 勾选 · 单选", "Switch · Checkbox · Radio")}
					description={L("按住开关时滑块会变宽，松开后弹到位。", "Hold a switch and its knob stretches; let go and it springs into place.")}
				>
					<div className="sc-stack">
						<Switch checked={sync} onChange={setSync} label={L("显示拼音", "Show pinyin")} description={L("在每个字上方标注读音", "Pronunciation above each character")} />
						<Switch checked={fields} onChange={setFields} label={L("显示注释", "Show notes")} description={L("读到生僻字时展开", "Open at rare characters")} />
						<div className="sc-row" style={{ gap: 20 }}>
							<Checkbox checked={symbols} onChange={setSymbols} label={L("标点", "Punctuation")} />
							<Checkbox checked={similar} onChange={setSimilar} label={L("繁体", "Traditional")} />
						</div>
						<RadioGroup label={L("朗读速度", "Reading speed")} value={pace} onChange={setPace}>
							<Radio value="slow" label={L("慢", "Slow")} />
							<Radio value="mid" label={L("适中", "Medium")} />
							<Radio value="fast" label={L("快", "Fast")} />
						</RadioGroup>
					</div>
				</Card>

				<Card
					title={L("选项卡", "Tabs")}
					description={L(
						"胶囊式用于切换视图；笔触式用于页面内分区。指示条在两项之间滑过去；←→ 键切换。",
						"The pill switches views; the brush stroke divides a page. The indicator slides across; ← → move it.",
					)}
				>
					<div className="sc-stack">
						<div>
							<Segmented
								label={L("视图", "View")}
								role="tablist"
								value={view}
								onChange={setView}
								options={[
									{ value: "list", icon: <List />, label: L("列表", "List") },
									{ value: "table", icon: <Table2 />, label: L("表格", "Table") },
									{ value: "cards", icon: <LayoutGrid />, label: L("卡片", "Cards") },
								]}
							/>
						</div>
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
					</div>
				</Card>

				<Card
					title={L("标签 · 头像 · 提示", "Chips · Avatars · Tooltips")}
					description={L("筛选用可点的标签；状态用小色块。鼠标停在图标按钮上会出现提示。", "Chips filter, tags show a status. Hover an icon button for its tooltip.")}
				>
					<div className="sc-stack">
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
						<div className="sc-row">
							<Tag icon={<Check />}>{L("已背诵", "Learned")}</Tag>
							<Tag tone="azure">{L("盛唐", "High Tang")}</Tag>
							<Tag tone="gold">{L("待复习", "To review")}</Tag>
							<Tag tone="danger">{L("有异文", "Variants")}</Tag>
						</div>
						<div className="sc-row" style={{ gap: 18 }}>
							<AvatarStack>
								<Avatar name={L("李白", "Li Bai")} />
								<Avatar name={L("杜甫", "Du Fu")} tone="azure" />
								<Avatar name={L("王维", "Wang Wei")} tone="gold" />
								<Avatar name={L("苏轼", "Su Shi")} tone="danger" />
							</AvatarStack>
							<IconButton label={L("收藏", "Bookmark")}>
								<Bookmark />
							</IconButton>
							<IconButton label={L("设置", "Settings")}>
								<Settings />
							</IconButton>
							<IconButton label={L("朗读", "Read aloud")}>
								<Volume2 />
							</IconButton>
						</div>
					</div>
				</Card>

				<Card
					title={L("菜单 · 对话框 · 加载", "Menu · Dialog · Loading")}
					description={L(
						"菜单从按钮处展开，↑↓ / 首字母跳转；对话框只用于需要决定的事，盖上一枚朱印，Tab 只在框内循环。",
						"Menus unfold from their button (↑ ↓, or type a letter); dialogs are only for decisions, stamped with a seal, and Tab stays inside them.",
					)}
				>
					<div className="sc-stack">
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
									{ label: L("删除", "Delete"), icon: <Trash2 />, danger: true, onSelect: () => setDialog(true) },
								]}
							/>
							<Button variant="flat" tone="danger" onClick={() => setDialog(true)}>
								{L("打开对话框", "Open a dialog")}
							</Button>
						</div>
						<div className="sc-row" style={{ gap: 22, color: "var(--si-jade)" }}>
							<InkBars />
							<InkDrop label={L("加载中", "Loading")} />
							<BrushSpinner />
							<div style={{ flex: 1, minWidth: 140, display: "grid", gap: 8 }}>
								<Skeleton width="70%" />
								<Skeleton width="45%" />
							</div>
						</div>
					</div>
				</Card>
				<Card
					title={L("导航 · 分组 · 搜索", "Navigation · Groups · Search")}
					description={L("侧边栏的导航行、设置页的分组卡片，以及带清除按钮的搜索框。", "Sidebar rows, a settings group in a card, and a search box that clears.")}
				>
					<div className="sc-stack">
						<SearchField value={search} onChange={setSearch} label={L("搜索", "Search")} />
						<div style={{ display: "grid", gap: 2 }}>
							<NavItem icon={<Inbox />} label={L("全部", "All")} count={300} current={nav === "all"} onClick={() => setNav("all")} />
							<NavItem icon={<Folder />} label={L("唐诗", "Tang poems")} count={214} current={nav === "tang"} onClick={() => setNav("tang")} />
							<NavItem icon={<Folder />} label={L("宋词", "Song lyrics")} count={86} current={nav === "song"} onClick={() => setNav("song")} />
							<NavItem icon={<Bookmark />} label={L("已收藏 · 12 首（链接）", "Bookmarked · 12 (a link)")} tone="jade" href="#sample" />
						</div>
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
					</div>
				</Card>

				<Card
					title={L("步骤 · 选项卡片 · 提示", "Steps · Radio cards · Notes")}
					description={L("向导用步骤条；二选一用选项卡片；提醒用浅色底的提示。", "Steps for a wizard, radio cards for a choice of two, notes on a tinted ground for a heads-up.")}
				>
					<div className="sc-stack">
						<Steps current={step} total={3} label={L(`第 ${step} 步，共 3 步`, `Step ${step} of 3`)} />
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
						<Note tone="gold">{L("此篇有异文，各版本字句略有不同。", "This poem has variants: editions differ in a few words.")}</Note>
						<Note tone="jade" icon={<Users />}>
							{L("小明 和你分享了诗单「江南」", 'Xiaoming shared the list "Jiangnan" with you')}
						</Note>
						<div style={{ position: "relative", height: 88, borderRadius: 12, background: "var(--si-paper-sunk)" }}>
							<span className="sc-muted" style={{ position: "absolute", left: 14, top: 12 }}>
								{L("浮动按钮（Fab）固定在屏幕右下角", "The Fab sits at the bottom right of the screen")}
							</span>
							<Fab icon={<Plus />} label={L("新建", "New")} onClick={() => {}} style={{ position: "absolute", right: 16, bottom: 16 }} />
						</div>
						<div className="sc-row">
							<IconBadge>
								<Feather />
							</IconBadge>
							<Button size="sm" variant="flat" onClick={() => setStep((n) => (n % 3) + 1)}>
								{L("下一步", "Next")}
							</Button>
							<Button size="sm" variant="flat" tone="danger" onClick={() => setConfirm(true)}>
								{L("确认对话框", "Confirm dialog")}
							</Button>
						</div>
					</div>
				</Card>
				<More />
			</div>

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
		</section>
	);
}

/* ── 组件目录：sityle 导出的每一个组件 ── */
/** [group, group in English, exports] */
const DIRECTORY: Array<[string, string, string[]]> = [
	["按钮", "Buttons", ["Button", "IconButton", "CopyButton", "Fab"]],
	["输入", "Input", ["TextField", "PasswordField", "TextAreaField", "SelectField", "SearchField", "Input", "TextArea", "Select", "StrengthMeter"]],
	["选择", "Choice", ["Switch", "Checkbox", "RadioGroup", "Radio", "RadioCard", "Slider", "Segmented", "Tabs", "TabPanel", "Chip"]],
	["展示", "Display", ["Card", "Tag", "Avatar", "AvatarStack", "Seal", "IconBadge", "ListItem", "Note", "Tooltip"]],
	["布局", "Layout", ["NavItem", "Group", "GroupRow", "Steps", "AutoHeight"]],
	["浮层", "Overlays", ["Menu", "Dialog", "ConfirmDialog"]],
	["反馈", "Feedback", ["InkDrop", "InkBars", "BrushSpinner", "Skeleton"]],
	["水墨", "Ink & theme", ["SiProvider", "InkWash", "BrushStroke", "spring", "ease", "useTheme", "themeScript"]],
	["文字", "Texts", ["useMessages", "zh", "en"]],
];

function Directory() {
	const L = useL();
	const count = DIRECTORY.reduce((n, [, , names]) => n + names.length, 0);
	return (
		<Card
			title={L(`组件目录 · ${count}`, `Everything · ${count}`)}
			description={L(`sityle ${VERSION} 导出的全部组件与工具，下方逐一演示。`, `Every component and helper sityle ${VERSION} exports, each shown below.`)}
			className="sc-directory"
		>
			<dl>
				{DIRECTORY.map(([group, groupEn, names]) => (
					<div key={group}>
						<dt>{L(group, groupEn)}</dt>
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
	const L = useL();
	const [lines, setLines] = useState(12);
	const [pw, setPw] = useState("chunxiao");
	const [more, setMore] = useState(false);
	// the kind stays while the dialog plays its closing animation
	const [phone, setPhone] = useState<"sheet" | "full">("sheet");
	const [phoneOpen, setPhoneOpen] = useState(false);
	const [plain, setPlain] = useState("tang");
	const [submitted, setSubmitted] = useState<string | null>(null);
	return (
		<>
			<Card
				title={L("原生表单（非受控）", "A plain form (uncontrolled)")}
				description={L(
					"不写 value / onChange：给 name 和 defaultValue，交给 <form>。提交看看 FormData 里有什么。",
					"No value / onChange: give name and defaultValue and let the <form> do it. Submit to see the FormData.",
				)}
			>
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

			<Card
				title={L("滑块 · 强度 · 提示", "Slider · Strength · Tooltip")}
				description={L(
					"滑块右上角显示当前值；强度条随输入变化；提示在悬停或键盘聚焦时出现。",
					"The slider shows its value at the top right; the strength bar follows what you type; a tooltip appears on hover or keyboard focus.",
				)}
			>
				<div className="sc-stack">
					<Slider label={L("每页行数", "Lines per page")} value={lines} min={4} max={24} onChange={setLines} format={(v) => L(`${v} 行`, `${v} lines`)} />
					<div style={{ display: "grid", gap: 8 }}>
						<Input mono value={pw} onChange={(e) => setPw(e.target.value)} aria-label={L("试一个口令", "Try a passphrase")} />
						<StrengthMeter value={pw} />
					</div>
					<div className="sc-row">
						<Tooltip content={L("复制到剪贴板", "Copy to the clipboard")}>
							<Button variant="bordered" icon={<Copy />}>
								{L("悬停看提示", "Hover for a tooltip")}
							</Button>
						</Tooltip>
					</div>
				</div>
			</Card>

			<Card
				title={L("基础输入 · 自适应高度", "Plain inputs · AutoHeight")}
				description={L(
					"Input / TextArea / Select 是不带浮动标签的原始控件；AutoHeight 让内容变化时高度平滑过渡。",
					"Input / TextArea / Select are the plain controls without a floating label; AutoHeight eases its height when the content changes.",
				)}
			>
				<div className="sc-stack">
					<Select value={plain} onChange={(e) => setPlain(e.target.value)} aria-label={L("朝代", "Dynasty")}>
						<option value="tang">{L("唐", "Tang")}</option>
						<option value="song">{L("宋", "Song")}</option>
						<option value="yuan">{L("元", "Yuan")}</option>
					</Select>
					<TextArea rows={2} placeholder={L("写下你的批注", "Write a note")} aria-label={L("批注", "Note")} />
					<div className="sc-row">
						<Button variant="flat" size="sm" icon={<SlidersHorizontal />} onClick={() => setMore((o) => !o)}>
							{more ? L("收起", "Less") : L("展开更多", "More")}
						</Button>
					</div>
					<AutoHeight>
						<div className="sc-stack" style={{ gap: 8 }}>
							<Note>{L("高度跟着内容走。", "The height follows the content.")}</Note>
							{more && <Note tone="jade">{L("展开后多出的一段，容器平滑长高。", "One more paragraph: the box grows smoothly.")}</Note>}
							{more && <Note tone="danger">{L("再收起时平滑变矮。", "Fold it again and it shrinks smoothly.")}</Note>}
						</div>
					</AutoHeight>
				</div>
			</Card>

			<Card
				title={L("分组（无卡片）· 印章", "Group (plain) · Seals")}
				description={L(
					"Group plain 用在本身已是一张纸的地方（如设置对话框）；印章有实心和描边两种。",
					"Group plain goes where there is already a sheet of paper (a settings dialog); seals come solid or outlined.",
				)}
			>
				<div className="sc-stack">
					<Group plain title={L("阅读", "Reading")}>
						<GroupRow title={L("朗读速度", "Reading speed")} description={L("每分钟读多少字", "Characters per minute")}>
							<Button variant="bordered" size="sm">
								{L("200 字", "200 / min")}
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

			<Card
				title={L("手机上的对话框", "Dialogs on phones")}
				description={L(
					'窄屏（≤600px）时对话框从底部升起；phone="full" 用于长内容（设置、表单），铺满屏幕。宽屏上两者都居中。',
					'On narrow screens (≤600px) a dialog rises from the bottom; phone="full" fills the screen for long content (settings, forms). On wide screens both are centred.',
				)}
			>
				<div className="sc-row">
					<Button
						variant="bordered"
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
						icon={<Smartphone />}
						onClick={() => {
							setPhone("full");
							setPhoneOpen(true);
						}}
					>
						{L("全屏", "Full screen")}
					</Button>
				</div>
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
									{ value: "dynasty", label: L("朝代", "Dynasty") },
								]}
							/>
							<Switch label={L("同步到其他设备", "Sync to my other devices")} defaultChecked />
						</div>
					) : (
						L("短内容从屏幕底部升起，点空白处或按 Esc 关闭。", "Short content rises from the bottom; tap outside or press Esc to close.")
					)}
				</Dialog>
			</Card>
		</>
	);
}

/* ── 实例 ── */
type Poem = { title: string; author: string; dynasty: string; form: string; tone: Tone; text: string; source: string };
/** Each poem in Chinese and in English (the English versions are plain translations made for this page). */
const POEMS: Array<{ zh: Poem; en: Poem }> = [
	{
		zh: { title: "静夜思", author: "李白", dynasty: "唐", form: "五言绝句", tone: "jade", text: "床前明月光，疑是地上霜。\n举头望明月，低头思故乡。", source: "zh.wikisource.org/wiki/靜夜思" },
		en: {
			title: "Quiet Night Thoughts",
			author: "Li Bai",
			dynasty: "Tang",
			form: "Quatrain",
			tone: "jade",
			text: "Bright moonlight before my bed —\nI took it for frost on the ground.\nI raise my head to the bright moon,\nlower it, and think of home.",
			source: "zh.wikisource.org/wiki/靜夜思",
		},
	},
	{
		zh: { title: "春晓", author: "孟浩然", dynasty: "唐", form: "五言绝句", tone: "azure", text: "春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。", source: "zh.wikisource.org/wiki/春曉" },
		en: {
			title: "Spring Dawn",
			author: "Meng Haoran",
			dynasty: "Tang",
			form: "Quatrain",
			tone: "azure",
			text: "Spring sleep, I miss the dawn;\neverywhere, birds are singing.\nAll night, the sound of wind and rain —\nhow many petals fell?",
			source: "zh.wikisource.org/wiki/春曉",
		},
	},
	{
		zh: { title: "江雪", author: "柳宗元", dynasty: "唐", form: "五言绝句", tone: "gold", text: "千山鸟飞绝，万径人踪灭。\n孤舟蓑笠翁，独钓寒江雪。", source: "zh.wikisource.org/wiki/江雪" },
		en: {
			title: "River Snow",
			author: "Liu Zongyuan",
			dynasty: "Tang",
			form: "Quatrain",
			tone: "gold",
			text: "A thousand hills, no bird in flight;\nten thousand paths, no footprint.\nA lone boat, an old man in a straw cape,\nfishing alone in the cold river snow.",
			source: "zh.wikisource.org/wiki/江雪",
		},
	},
	{
		zh: {
			title: "水调歌头",
			author: "苏轼",
			dynasty: "宋",
			form: "词",
			tone: "danger",
			text: "明月几时有？把酒问青天。\n不知天上宫阙，今夕是何年。",
			source: "zh.wikisource.org/wiki/水調歌頭_(蘇軾)",
		},
		en: {
			title: "Prelude to Water Melody",
			author: "Su Shi",
			dynasty: "Song",
			form: "Ci lyric",
			tone: "danger",
			text: "When did the bright moon first appear?\nCup in hand, I ask the blue sky.\nIn the palaces of heaven, I wonder,\nwhat year is it tonight?",
			source: "zh.wikisource.org/wiki/水調歌頭_(蘇軾)",
		},
	},
	{
		zh: {
			title: "天净沙·秋思",
			author: "马致远",
			dynasty: "元",
			form: "小令",
			tone: "jade",
			text: "枯藤老树昏鸦，小桥流水人家，古道西风瘦马。\n夕阳西下，断肠人在天涯。",
			source: "zh.wikisource.org/wiki/天淨沙·秋思",
		},
		en: {
			title: "Autumn Thoughts",
			author: "Ma Zhiyuan",
			dynasty: "Yuan",
			form: "Song lyric",
			tone: "jade",
			text: "Withered vines, old trees, crows at dusk;\na small bridge, running water, a cottage;\nan old road, the west wind, a thin horse.\nThe sun goes down in the west;\na heartbroken man at the end of the world.",
			source: "zh.wikisource.org/wiki/天淨沙·秋思",
		},
	},
];

function Sample() {
	const L = useL();
	const lang = useLang();
	const poems = POEMS.map((p) => p[lang]);
	const [i, setI] = useState(0);
	return (
		<section className="sc-section" id="sample" aria-labelledby="h-sample">
			<Head id="sample" title="实例" en="In context">
				{L("放进一个读诗的小应用里：左边是诗目，右边是正文和批注。", "In a small poetry reader: the poems on the left, the text and your notes on the right.")}
			</Head>
			<div className="sc-sample">
				<Card style={{ padding: 10 }}>
					<div style={{ display: "grid", gap: 4 }}>
						{poems.map((p, k) => (
							<ListItem
								key={p.title}
								title={p.title}
								description={`${p.dynasty} · ${p.author}`}
								current={k === i}
								onClick={() => setI(k)}
								leading={<Avatar name={p.author} tone={p.tone} decorative />}
							/>
						))}
					</div>
				</Card>
				<Card>
					<SampleDetail key={i} poem={poems[i]!} />
				</Card>
			</div>
		</section>
	);
}

function SampleDetail({ poem }: { poem: Poem }) {
	const L = useL();
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
				<IconButton label={loved ? L("取消收藏", "Remove bookmark") : L("收藏", "Bookmark")} active={loved} onClick={() => setLoved((v) => !v)}>
					<Heart fill={loved ? "currentColor" : "none"} />
				</IconButton>
			</div>
			<div className="sc-stack">
				<TextAreaField label={L("原文", "Text")} value={text} onChange={(e) => setText(e.target.value)} end={<CopyButton value={text} />} />
				<TextAreaField label={L("批注", "Notes")} value={note} onChange={(e) => setNote(e.target.value)} hint={L("读后的一点想法", "A thought or two after reading")} />
				<TextField
					label={L("出处", "Source")}
					value={poem.source}
					readOnly
					end={[
						<CopyButton key="c" value={`https://${poem.source}`} />,
						<IconButton key="o" label={L("打开出处", "Open the source")} onClick={() => window.open(`https://${poem.source}`, "_blank", "noopener")}>
							<ExternalLink />
						</IconButton>,
					]}
				/>
			</div>
			<div className="sc-row" style={{ marginTop: 18, justifyContent: "flex-end" }}>
				<Button variant="light" tone="danger" icon={<Trash2 />}>
					{L("删除", "Delete")}
				</Button>
				<Button>{L("保存", "Save")}</Button>
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
	const L = useL();
	return (
		<section className="sc-section" id="icons" aria-labelledby="h-icons">
			<Head id="icons" title="图标" en="Icons">
				{L(
					"线性图标，圆头圆角，线宽 1.75，像一笔细毛笔勾出来的。静止时用次要墨色，悬停或选中时变石绿。目前用 Lucide，以后可以换成自绘的一套，只要遵守同样的规则。",
					"Line icons, round caps and joins, stroke 1.75 — as if drawn with a fine brush. Secondary ink at rest, mineral green on hover or when selected. Lucide for now; a hand-drawn set can replace it as long as it keeps these rules.",
				)}
			</Head>
			<div className="sc-grid" style={{ marginBottom: 16 }}>
				<Card title={L("尺寸", "Sizes")} description={L("16 用于行内和标签，20 用于按钮和列表，24 用于导航。", "16 inline and in tags, 20 in buttons and lists, 24 in navigation.")}>
					<div className="sc-sizes">
						{[16, 20, 24, 32].map((s) => (
							<figure key={s}>
								<Feather size={s} strokeWidth={s >= 32 ? 1.5 : 1.75} />
								{s}
							</figure>
						))}
					</div>
				</Card>
				<Card title={L("规则", "Rules")}>
					<ul className="sc-rules" style={{ marginTop: 14 }}>
						<li>
							<Check />
							{L("一个图标只表达一个意思，同一个意思全站只用一个图标。", "One icon, one meaning; one meaning, one icon across the site.")}
						</li>
						<li>
							<Check />
							{L("只有图标的按钮一定有提示文字。", "An icon-only button always has a tooltip.")}
						</li>
						<li className="is-no">
							<X />
							{L("不用填充、双色或表情符号图标。", "No filled, two-tone or emoji icons.")}
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
