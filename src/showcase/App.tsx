import {
	BookOpen,
	Check,
	ChevronDown,
	Cloud,
	CloudCheck,
	Copy,
	ExternalLink,
	Eye,
	EyeOff,
	Folder,
	FolderInput,
	Inbox,
	KeyRound,
	LayoutGrid,
	List,
	Lock,
	LockOpen,
	LogOut,
	Menu as MenuIcon,
	Monitor,
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
	ShieldCheck,
	Sparkles,
	Sun,
	Table2,
	Tag as TagIcon,
	Trash2,
	Users,
	WandSparkles,
	X,
	type LucideIcon,
} from "lucide-react";
import { motion, type Transition } from "motion/react";
import { useEffect, useState } from "react";

import {
	Avatar,
	AvatarStack,
	BrushSpinner,
	BrushStroke,
	Button,
	Card,
	Checkbox,
	Chip,
	CopyButton,
	Dialog,
	IconButton,
	InkBars,
	InkDrop,
	InkWash,
	ListItem,
	Menu,
	PasswordField,
	Radio,
	RadioGroup,
	Seal,
	Segmented,
	Skeleton,
	spring,
	Switch,
	Tabs,
	Tag,
	TextAreaField,
	TextField,
	useTheme,
	type Color,
	type ThemeChoice,
} from "@si";

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
					<Seal>青</Seal>丹青设计语言 · sityle
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
					<Seal>丹</Seal>丹青
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
					<Seal size={150} className="sc-hero-seal">
						丹青
					</Seal>
				</div>
				<div>
					<h1 id="hero-title">
						丹青<small>DANQING · 设计语言</small>
					</h1>
					<p className="sc-lede">石绿为发，石青为手，泥金为饰，浓墨为衣——取「祀」的颜色，铺在一张宣纸上。</p>
					<p className="sc-sub">安静的水墨底子，加上现代 Material 式的交互：按下时墨滴在纸上晕开，开关带一点弹性，对话框像一张纸被轻轻放下。适用于密码管理器，也适用于以后的每个项目。</p>
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
		const raf = requestAnimationFrame(() => {
			const css = getComputedStyle(document.documentElement);
			setValues(Object.fromEntries(PIGMENTS.map(([, , v]) => [v, css.getPropertyValue(v).trim()])));
		});
		return () => cancelAnimationFrame(raf);
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
		["brush · 72\n马善政楷", { font: "400 64px/1.05 var(--si-font-brush)" }, "密码管理器"],
		["display · 30/700\n思源宋体", { font: "700 30px/1.3 var(--si-font-serif)", letterSpacing: ".03em" }, "盗贼之神也无可奈何的神器"],
		["title · 19/700\n思源宋体", { font: "700 19px/1.4 var(--si-font-serif)" }, "删除「招商银行」？"],
		["body · 15/400\n思源黑体", { maxWidth: "36em" }, "内容在你的浏览器里加密后才保存，谷歌和我们都看不到。正文保持每行三十到四十个汉字，行高 1.65。"],
		["label · 13/500\n思源黑体", { font: "500 13px/1.4 var(--si-font-sans)", color: "var(--si-ink-2)" }, "账号 · 密码 · 网址 · 备注"],
		["mono · 14/500\nJetBrains Mono", { font: "500 14px/1.4 var(--si-font-mono)", letterSpacing: ".06em" }, "k7#Vq2!mR9@xL4 · 6225 8800 0000 5678"],
	];
	return (
		<section className="sc-section" id="type" aria-labelledby="h-type">
			<Head id="type" title="字体" en="Type">
				书法字只用于品牌和极少数大标题；标题用宋体，正文和界面用黑体，密码、色值等用等宽字。
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
	const [user, setUser] = useState("wang.xiaoming@163.com");
	const [pw, setPw] = useState("k7#Vq2!mR9@xL4");
	const [mail, setMail] = useState("xiaoming@");
	const [notes, setNotes] = useState("网银 U 盾放在书房抽屉");
	const [sync, setSync] = useState(true);
	const [fields, setFields] = useState(false);
	const [symbols, setSymbols] = useState(true);
	const [similar, setSimilar] = useState(false);
	const [lock, setLock] = useState("10");
	const [view, setView] = useState<"list" | "table" | "cards">("list");
	const [tab, setTab] = useState<"book" | "general" | "account">("book");
	const [chips, setChips] = useState<Set<string>>(new Set(["全部"]));
	const [dialog, setDialog] = useState(false);
	const mailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail);

	const save = () => {
		if (saving !== "idle") return;
		setSaving("busy");
		setTimeout(() => setSaving("done"), 1200);
		setTimeout(() => setSaving("idle"), 2800);
	};
	const panels = { book: "名称、保护方式、分享、功能开关和备份。", general: "外观（宣纸 / 浓墨）、字号、语言、自动锁定。", account: "谷歌账户、同步状态、别人分享给我的密码本。" };

	return (
		<section className="sc-section" id="components" aria-labelledby="h-components">
			<Head id="components" title="组件" en="Components">
				每个组件都可以直接点。按钮、菜单、列表项按下时会晕开一滴墨。
			</Head>
			<div className="sc-grid">
				<Card title="按钮" note="实心只用于每个区域最重要的一个动作。">
					<div className="sc-stack">
						<div className="sc-row">
							<Button>实心</Button>
							<Button variant="shadow">浮起</Button>
							<Button variant="flat">浅底</Button>
							<Button variant="bordered">描边</Button>
							<Button variant="light">文字</Button>
						</div>
						<div className="sc-row">
							<Button color="azure">石青</Button>
							<Button variant="flat" color="gold">
								泥金
							</Button>
							<Button variant="flat" color="danger" icon={<Trash2 />}>
								删除
							</Button>
							<Button color="danger">确认删除</Button>
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

				<Card title="输入框" note="标签在框内，输入时上浮；复制、显示等操作放在框的右端。">
					<div className="sc-stack">
						<TextField label="账号" value={user} onChange={(e) => setUser(e.target.value)} end={<CopyButton value={user} />} />
						<PasswordField label="密码" value={pw} onChange={(e) => setPw(e.target.value)} strength />
						<TextField
							label="找回邮箱"
							value={mail}
							onChange={(e) => setMail(e.target.value)}
							hint="用来接收找回提示"
							error={mailOk ? undefined : "邮箱格式不对，少了「@」后面的部分"}
						/>
						<TextAreaField label="备注" value={notes} onChange={(e) => setNotes(e.target.value)} />
					</div>
				</Card>

				<Card title="开关 · 勾选 · 单选" note="按住开关时滑块会变宽，松开后弹到位。">
					<div className="sc-stack">
						<Switch checked={sync} onChange={setSync} label="自动同步" description="登录谷歌账户后保持同步" />
						<Switch checked={fields} onChange={setFields} label="自定义字段" description="每本单独开启" />
						<div className="sc-row" style={{ gap: 20 }}>
							<Checkbox checked={symbols} onChange={setSymbols}>
								包含符号
							</Checkbox>
							<Checkbox checked={similar} onChange={setSimilar}>
								避开易混字符
							</Checkbox>
						</div>
						<RadioGroup label="自动锁定" value={lock} onChange={setLock}>
							<Radio value="5">5 分钟</Radio>
							<Radio value="10">10 分钟</Radio>
							<Radio value="0">从不</Radio>
						</RadioGroup>
					</div>
				</Card>

				<Card title="选项卡" note="胶囊式用于切换视图；笔触式用于页面内分区。指示条在两项之间滑过去。">
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
								label="设置"
								value={tab}
								onChange={setTab}
								options={[
									{ value: "book", label: "本密码本" },
									{ value: "general", label: "通用" },
									{ value: "account", label: "账户与同步" },
								]}
							/>
							<motion.div key={tab} className="si-tab-panel" role="tabpanel" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
								{panels[tab]}
							</motion.div>
						</div>
					</div>
				</Card>

				<Card title="标签 · 头像 · 提示" note="筛选用可点的标签；状态用小色块。鼠标停在图标按钮上会出现提示。">
					<div className="sc-stack">
						<div className="sc-row">
							{["全部", "社交", "银行理财", "购物", "邮箱"].map((c) => (
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
							<Tag icon={<Check />}>已同步</Tag>
							<Tag color="azure">共享</Tag>
							<Tag color="gold">等待打开后同步</Tag>
							<Tag color="danger">保存失败</Tag>
						</div>
						<div className="sc-row" style={{ gap: 18 }}>
							<AvatarStack>
								<Avatar name="微信" />
								<Avatar name="招商银行" color="azure" />
								<Avatar name="支付宝" color="gold" />
								<Avatar name="京东" color="danger" />
							</AvatarStack>
							<IconButton label="锁定">
								<Lock />
							</IconButton>
							<IconButton label="设置">
								<Settings />
							</IconButton>
							<IconButton label="同步状态：刚刚">
								<CloudCheck />
							</IconButton>
						</div>
					</div>
				</Card>

				<Card title="菜单 · 对话框 · 加载" note="菜单从按钮处展开；对话框只用于需要决定的事，盖上一枚朱印。">
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
									{ label: "移到分类…", icon: <FolderInput />, onSelect: () => {} },
									{ label: "分享", icon: <Share2 />, kbd: "Ctrl S", onSelect: () => {} },
									"divider",
									{ label: "删除", icon: <Trash2 />, danger: true, onSelect: () => setDialog(true) },
								]}
							/>
							<Button variant="flat" color="danger" onClick={() => setDialog(true)}>
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
			</div>

			<Dialog
				open={dialog}
				onClose={() => setDialog(false)}
				seal="删"
				title="删除「招商银行」？"
				actions={
					<>
						<Button variant="ghost" onClick={() => setDialog(false)}>
							取消
						</Button>
						<Button color="danger" onClick={() => setDialog(false)}>
							删除
						</Button>
					</>
				}
			>
				删除后无法恢复。同步的设备上也会一起删除。
			</Dialog>
		</section>
	);
}

/* ── 实例 ── */
type Sample = { n: string; u: string; c: string; color: Color; pw: string; url: string };
const ENTRIES: Sample[] = [
	{ n: "招商银行", u: "6225 8800 0000 5678", c: "银行理财", color: "azure", pw: "Zs!8kq2#Lm4v", url: "cmbchina.com" },
	{ n: "微信", u: "wxid_xiaoming", c: "社交", color: "jade", pw: "Wx@2026-spring", url: "weixin.qq.com" },
	{ n: "支付宝", u: "13800138000", c: "银行理财", color: "gold", pw: "Alp#9v!t2Qw", url: "alipay.com" },
	{ n: "京东", u: "jd_xiaoming", c: "购物", color: "danger", pw: "Jd$4m8@pZr", url: "jd.com" },
	{ n: "家里 Wi-Fi", u: "TP-LINK_5G_1201", c: "家里设备", color: "jade", pw: "home-1201-green", url: "" },
];

function Sample() {
	const [i, setI] = useState(0);
	return (
		<section className="sc-section" id="sample" aria-labelledby="h-sample">
			<Head id="sample" title="实例" en="In context">
				放进密码管理器的样子：列表和详情。示例数据。
			</Head>
			<div className="sc-sample">
				<Card style={{ padding: 10 }}>
					<div style={{ display: "grid", gap: 4 }}>
						{ENTRIES.map((e, k) => (
							<ListItem key={e.n} title={e.n} subtitle={e.u} current={k === i} onClick={() => setI(k)} leading={<Avatar name={e.n} color={e.color} />} />
						))}
					</div>
				</Card>
				<Card>
					<SampleDetail key={i} entry={ENTRIES[i]} />
				</Card>
			</div>
		</section>
	);
}

function SampleDetail({ entry }: { entry: Sample }) {
	const [user, setUser] = useState(entry.u);
	const [pw, setPw] = useState(entry.pw);
	const [url, setUrl] = useState(entry.url);
	return (
		<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}>
			<div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
				<Avatar name={entry.n} color={entry.color} size={52} />
				<div style={{ minWidth: 0, flex: 1 }}>
					<div style={{ font: "700 22px/1.3 var(--si-font-serif)" }}>{entry.n}</div>
					<div style={{ marginTop: 4 }}>
						<Tag color={entry.color}>{entry.c}</Tag>
					</div>
				</div>
			</div>
			<div className="sc-stack">
				<TextField label="账号" value={user} onChange={(e) => setUser(e.target.value)} end={<CopyButton value={user} />} />
				<PasswordField label="密码" value={pw} onChange={(e) => setPw(e.target.value)} />
				{entry.url && (
					<TextField
						label="网址"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						end={[
							<CopyButton key="c" value={url} />,
							<IconButton key="o" label="打开网站" onClick={() => window.open(`https://${url}`, "_blank", "noopener")}>
								<ExternalLink />
							</IconButton>,
						]}
					/>
				)}
			</div>
			<div className="sc-row" style={{ marginTop: 18, justifyContent: "flex-end" }}>
				<Button variant="light" color="danger" icon={<Trash2 />}>
					删除
				</Button>
				<Button>保存</Button>
			</div>
		</motion.div>
	);
}

/* ── 图标 ── */
const ICONS: Array<[string, LucideIcon]> = [
	["key-round", KeyRound],
	["lock", Lock],
	["lock-open", LockOpen],
	["shield-check", ShieldCheck],
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
	["cloud-check", CloudCheck],
	["refresh-cw", RefreshCw],
	["share-2", Share2],
	["users", Users],
	["settings", Settings],
	["log-out", LogOut],
	["external-link", ExternalLink],
	["wand-sparkles", WandSparkles],
	["book-open", BookOpen],
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
				<Card title="尺寸" note="16 用于行内和标签，20 用于按钮和列表，24 用于导航。">
					<div className="sc-sizes">
						{[16, 20, 24, 32].map((s) => (
							<figure key={s}>
								<KeyRound size={s} strokeWidth={s >= 32 ? 1.5 : 1.75} />
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
