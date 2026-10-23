import {
	BookOpen,
	Check,
	Feather,
	Heart,
	Eye,
	EyeOff,
	Copy,
	Search,
	Plus,
	Pencil,
	Trash2,
	Folder,
	Tag as TagIcon,
	Paperclip,
	Cloud,
	Leaf,
	Mountain,
	RefreshCw,
	Share2,
	Users,
	Settings,
	LogOut,
	ExternalLink,
	Volume2,
	Lock,
	Inbox,
	Menu as MenuIcon,
	X,
	Bookmark,
	Play,
	Sparkles,
	type LucideIcon,
} from "lucide-react";
import { motion, type Transition } from "motion/react";
import { useEffect, useState } from "react";

import { BrushStroke, Button, Card, InkWash, Seal, Segmented, spring, Typography, useTheme, type MotionChoice, type TypographyVariant } from "@si";
import { useL } from "./lang";
import sigil from "./sigil.webp";
import { Head, VERSION } from "./ui";

export function Hero() {
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
						<Button size="lg" pill variant="bordered" href="/docs" icon={<BookOpen />}>
							{L("使用文档", "Documentation")}
						</Button>
					</div>
				</div>
			</div>
		</section>
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

export function Colors() {
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

/* ── 字体：字号表就是 <Typography> 的 variant ── */
export function Type() {
	const L = useL();
	const rows: Array<[TypographyVariant, string, string, React.ReactNode]> = [
		["display", "56 / 400", L("马善政楷 · 品牌、极少数大标题（只有中文）", "Ma Shan Zheng · the brand, rare display titles (Chinese only)"), "春江花月夜"],
		["h1", "30 / 700", L("标题字体 · 页面标题", "heading font · page title"), L("江畔何人初见月", "Who first saw the moon from this shore?")],
		["h2", "24 / 700", L("标题字体 · 分区", "heading font · section"), L("江月何年初照人", "When did the moon first shine on us?")],
		["h3", "19 / 700", L("标题字体 · 对话框、面板", "heading font · dialog, panel"), L("删除「静夜思」？", 'Delete "Quiet Night Thoughts"?')],
		["h4", "15 / 700", L("标题字体 · 卡片标题", "heading font · card title"), L("阅读设置", "Reading settings")],
		[
			"body",
			"15 / 400",
			L("黑体 · 正文、界面", "sans · body, interface"),
			L("春江潮水连海平，海上明月共潮生。正文每行三十到四十个汉字，行高 1.65。", "The spring river's tide runs level with the sea. Body text keeps lines to about 60–75 characters, line height 1.65."),
		],
		["body-sm", "13 / 400", L("黑体 · 次要说明", "sans · secondary text"), L("最后同步于 3 分钟前。", "Last synced 3 minutes ago.")],
		["label", "13 / 500", L("黑体 · 标签、小标题", "sans · labels, small headings"), L("诗名 · 作者 · 朝代", "Title · Poet · Dynasty")],
		["caption", "12 / 400", L("黑体 · 注脚、提示", "sans · footnotes, hints"), L("提示存为明文，锁定时也看得到。", "Hints are stored readable, shown while locked.")],
		["code", "0.875em", L("等宽 · 编号、色值、代码", "mono · numbers, colour values, code"), "#2c7a58"],
		["quote", "16 / 400", L("宋体 · 引文", "serif · quotations"), L("床前明月光，疑是地上霜。", "Bright moonlight before my bed — I took it for frost on the ground.")],
	];
	return (
		<section className="sc-section" id="type" aria-labelledby="h-type">
			<Head id="type" title="字体" en="Type">
				{L(
					"书法字只用于品牌和极少数大标题；标题用标题字体（默认宋体，可换成黑体），正文和界面用黑体，编号、色值、代码用等宽字。每一级都是 <Typography variant> 的一个值，也是一个 CSS 变量 --si-type-*。",
					"Brush lettering only for the brand and the rare display title; headings in the heading font (serif by default, sans if you like), body and interface in sans, numbers, colour values and code in mono. Each step is a <Typography variant> and a CSS variable --si-type-*.",
				)}
			</Head>
			<Card>
				{rows.map(([variant, size, use, sample]) => (
					<div className="sc-type-row" key={variant}>
						<div className="sc-spec">
							<b>{variant}</b> · {size}
							<br />
							{use}
						</div>
						<Typography variant={variant} as="div">
							{sample}
						</Typography>
					</div>
				))}
			</Card>
		</section>
	);
}

/* ── 形与层 ── */
export function Shape() {
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

export function MotionSection({ motion: choice, onMotion }: { motion: MotionChoice; onMotion: (m: MotionChoice) => void }) {
	const L = useL();
	const [far, setFar] = useState(false);
	return (
		<section className="sc-section" id="motion" aria-labelledby="h-motion">
			<Head id="motion" title="动效" en="Motion">
				{L(
					"四种节奏。进入用「舒展」，有形变的控件（开关、选项卡、对话框）用「回弹」弹簧，离开用「收」，按钮按下时的墨晕用 620ms 慢慢化开。动效默认一直开着；<SiProvider motion> 可改为「减少」（只留淡入淡出）或跟随系统的「减少动态效果」。",
					'Four rhythms. Things arrive with "unfold", controls that change shape (switches, tabs, dialogs) "bounce" on a spring, things leave with "gather", and the ink under a pressed button blooms over 620ms. Motion is always on by default; <SiProvider motion> can reduce it (fades only) or follow the system\'s "reduce motion".',
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
					<Segmented<MotionChoice>
						label={L("动效", "Motion")}
						value={choice}
						onChange={onMotion}
						options={[
							{ value: "on", label: L("开", "On") },
							{ value: "reduce", label: L("减少", "Reduced") },
							{ value: "system", label: L("跟随系统", "System") },
						]}
					/>
				</div>
			</Card>
		</section>
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

export function Icons() {
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
