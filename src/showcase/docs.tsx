import { ArrowLeft } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { NavItem, Typography } from "@si";
import { CATALOGUE } from "./catalogue";
import { useL } from "./lang";
import { cmpId, Code, VERSION } from "./ui";

const INSTALL = `npm i https://github.com/CastoricSi/sityle/releases/download/${VERSION}/sityle-${VERSION.slice(1)}.tgz
npm i react react-dom motion`;

/** The sections, in order: [id, title, title in English]. */
const TOC = [
	["start", "开始使用", "Getting started"],
	["provider", "SiProvider：主题、文字、动效", "SiProvider: theme, texts, motion"],
	["styles", "样式表与令牌", "Stylesheets and tokens"],
	["typography", "文字排版", "Typography"],
	["conventions", "约定", "Conventions"],
	["reference", "组件一览", "Component reference"],
	["motion", "动效与墨晕", "Motion and ink"],
	["more", "服务端渲染 · 浏览器 · 开发", "SSR · browsers · development"],
	["rules", "设计规则", "Design rules"],
] as const;

/* ── 文档：如何使用 sityle ── */
type PageId = (typeof TOC)[number][0];
const PAGES: Record<PageId, () => React.ReactNode> = {
	start: Start,
	provider: Provider,
	styles: Styles,
	typography: Typo,
	conventions: Conventions,
	reference: Reference,
	motion: MotionDoc,
	more: More,
	rules: Rules,
};
const isPage = (id: string): id is PageId => TOC.some(([t]) => t === id);
const pageHref = (id: PageId) => `/docs/${id}`;

/** The page in the address: /docs/<page>; /docs (or an old /docs#page link) opens the first / that one. */
function readPage(): PageId {
	const [, , id = "", ...rest] = location.pathname.replace(/\/+$/, "").split("/");
	if (!rest.length && isPage(id)) return id;
	const old = location.hash.slice(1);
	const page = isPage(old) ? old : TOC[0][0];
	history.replaceState(null, "", pageHref(page));
	return page;
}

/**
 * One page per section. The contents are a sidebar beside the page on wide screens
 * (☰ folds it away) and a drawer over it on narrow ones (☰ opens it; a link, the
 * shade or Esc closes it). Moving between pages stays in the app (the address
 * changes, Back / Forward work); a middle-click still opens a new tab.
 */
export function Docs({ toc, onClose, footer }: { toc: boolean; onClose: () => void; footer: React.ReactNode }) {
	const L = useL();
	const [page, setPage] = useState<PageId>(readPage);
	const box = useRef<HTMLDivElement>(null);
	useDrawerPlace(box, toc);
	useEffect(() => {
		const onPop = () => setPage(readPage());
		addEventListener("popstate", onPop);
		return () => removeEventListener("popstate", onPop);
	}, []);
	useEffect(() => {
		if (!toc) return;
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
		addEventListener("keydown", onKey);
		return () => removeEventListener("keydown", onKey);
	}, [toc, onClose]);
	const go = (id: PageId) => (e: React.MouseEvent) => {
		onClose();
		// a new tab, a new window: the browser's
		if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		e.preventDefault();
		if (id !== page) history.pushState(null, "", pageHref(id));
		setPage(id);
		scrollTo(0, 0);
	};
	const i = TOC.findIndex(([t]) => t === page);
	const prev = TOC[i - 1];
	const next = TOC[i + 1];
	const Page = PAGES[page];
	return (
		<div ref={box} className={toc ? "sc-docs is-toc" : "sc-docs"}>
			<div className="sc-toc-shade" aria-hidden="true" onClick={onClose} />
			<nav className="sc-toc" id="sc-toc" aria-label={L("文档目录", "Contents")}>
				<Typography variant="label" as="div" tone="faint" className="sc-toc-title">
					{L("文档", "Documentation")}
				</Typography>
				{TOC.map(([id, zh, en]) => (
					<NavItem key={id} href={pageHref(id)} label={L(zh, en)} current={page === id} onClick={go(id)} />
				))}
				<div className="sc-toc-out">
					<NavItem href="/#components" icon={<ArrowLeft />} label={L("组件演示", "Live components")} tone="jade" />
				</div>
			</nav>
			{/* the footer sits in the page's column, beside the contents, under the text */}
			<div className="sc-doc-main">
				<article className="sc-article" key={page}>
					<Page />
					<nav className="sc-pager" aria-label={L("翻页", "Pages")}>
						{prev && (
							<a href={pageHref(prev[0])} onClick={go(prev[0])} className="is-prev">
								<span>{L("上一页", "Previous")}</span>
								{L(prev[1], prev[2])}
							</a>
						)}
						{next && (
							<a href={pageHref(next[0])} onClick={go(next[0])} className="is-next">
								<span>{L("下一页", "Next")}</span>
								{L(next[1], next[2])}
							</a>
						)}
					</nav>
				</article>
				{footer}
			</div>
		</div>
	);
}

/**
 * Narrow screens: while the drawer is open the page stays put, and the drawer and its
 * shade are absolute layers at the screen's place in the page (--y, --vh). Safari on
 * iPhone clips position: fixed layers to the viewport, so fixed ones left the page
 * showing under its toolbar; layers in the page reach on past the edges.
 */
function useDrawerPlace(box: React.RefObject<HTMLDivElement | null>, open: boolean) {
	useLayoutEffect(() => {
		const el = box.current;
		if (!open || !el || !matchMedia("(max-width: 960px)").matches) return;
		const html = document.documentElement;
		const place = () => {
			el.style.setProperty("--y", `${scrollY}px`);
			el.style.setProperty("--vh", `${innerHeight}px`);
		};
		place();
		const before = html.getBoundingClientRect().width;
		const saved = { overflow: html.style.overflow, padding: html.style.paddingRight };
		html.style.overflow = "hidden";
		// a desktop scrollbar went away: keep the page where it was
		const bar = html.getBoundingClientRect().width - before;
		if (bar > 0) html.style.paddingRight = `${bar}px`;
		addEventListener("resize", place);
		return () => {
			removeEventListener("resize", place);
			html.style.overflow = saved.overflow;
			html.style.paddingRight = saved.padding;
		};
	}, [box, open]);
}

function Section({ id, children }: { id: (typeof TOC)[number][0]; children: React.ReactNode }) {
	const L = useL();
	const [, zh, en] = TOC.find(([t]) => t === id)!;
	return (
		<section id={id} className="sc-doc-section" aria-labelledby={`d-${id}`}>
			<Typography variant="h1" as="h1" id={`d-${id}`}>
				{L(zh, en)}
			</Typography>
			{children}
		</section>
	);
}

function H({ children }: { children: React.ReactNode }) {
	return (
		<Typography variant="h3" as="h3">
			{children}
		</Typography>
	);
}

function P({ children }: { children: React.ReactNode }) {
	return <Typography>{children}</Typography>;
}

/** Inline code. */
function C({ children }: { children: React.ReactNode }) {
	return <Typography variant="code">{children}</Typography>;
}

function Table({ head, rows }: { head: React.ReactNode[]; rows: React.ReactNode[][] }) {
	return (
		<div className="sc-table-wrap">
			<table className="sc-table">
				<thead>
					<tr>
						{head.map((h, i) => (
							<th key={i}>{h}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((r, i) => (
						<tr key={i}>
							{r.map((c, j) => (
								<td key={j}>{c}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

/* ── 开始使用 ── */
function Start() {
	const L = useL();
	return (
		<Section id="start">
			<Typography tone="muted">
				{L(
					`sityle ${VERSION} 是一套水墨风的 React 组件和设计令牌。这几页写的是怎么装、怎么用、怎么改；每个组件的样子和交互见首页的组件演示。`,
					`sityle ${VERSION} is a set of ink-wash React components and design tokens. These pages cover installing, using and adapting it; for how each component looks and behaves, see the live components on the front page.`,
				)}
			</Typography>
			<H>{L("1. 安装", "1. Install")}</H>
			<P>
				{L(
					"sityle 不在 npm 上，从 GitHub Release 安装（每个版本的发布说明里都有这一行）。React 19 和 Motion 是同伴依赖，项目里没有就一起装。",
					"sityle is not on npm: install it from a GitHub Release (each release's notes carry this line). React 19 and Motion are peer dependencies; add them if the project lacks them.",
				)}
			</P>
			<Code>{INSTALL}</Code>
			<H>{L("2. 引入样式，包一层 SiProvider", "2. Import the styles, wrap the app in SiProvider")}</H>
			<P>
				{L(
					"style.css 是令牌和全部组件的样式，只影响 si-* 元素。base.css 可选：整页都是 sityle 时用，它给页面铺上宣纸底色、重置样式和纸纹。SiProvider 在应用最外层包一次。",
					"style.css holds the tokens and every component's styles and touches only si-* elements. base.css is optional: for a page that is all sityle, it lays the rice-paper ground, a reset and the paper fibre. Wrap the app in SiProvider once.",
				)}
			</P>
			<Code>{`import { createRoot } from "react-dom/client";
import { SiProvider } from "sityle";
import "sityle/style.css";
import "sityle/base.css"; // ${L("可选：整页的底色和重置", "optional: the page ground and reset")}

createRoot(document.getElementById("root")!).render(
  <SiProvider>
    <App />
  </SiProvider>,
);`}</Code>
			<H>{L("3. 用组件", "3. Use the components")}</H>
			<Code>{`import { Button, Card, TextField } from "sityle";

function Rename({ name, onSave }: { name: string; onSave: (n: string) => void }) {
  const [value, setValue] = useState(name);
  return (
    <Card title="${L("重命名", "Rename")}">
      <TextField label="${L("名称", "Name")}" value={value} onChange={(e) => setValue(e.target.value)} />
      <Button onClick={() => onSave(value)}>${L("保存", "Save")}</Button>
    </Card>
  );
}`}</Code>
			<H>{L("4. 字体（可选）", "4. Fonts (optional)")}</H>
			<P>
				{L(
					"sityle 不加载任何网络字体。字体栈会退到系统自带的中文字体；想要和本站一样，在 index.html 里加上 Google Fonts：",
					"sityle loads no web fonts. The font stacks fall back to the system's Chinese fonts; to look like this site, add Google Fonts to index.html:",
				)}
			</P>
			<Code>{`<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Ma+Shan+Zheng&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@500;700;900&display=swap" />`}</Code>
		</Section>
	);
}

/* ── SiProvider ── */
function Provider() {
	const L = useL();
	return (
		<Section id="provider">
			<P>
				{L(
					"SiProvider 管三件事：主题（宣纸 / 浓墨 / 跟随系统）、sityle 自己写的那几句文字（复制、显示、取消……），以及动效。都可以不传，用默认值。",
					"SiProvider looks after three things: the theme (paper / ink / follow the system), the few texts sityle writes itself (copy, show, cancel…), and motion. All are optional.",
				)}
			</P>
			<Table
				head={[L("属性", "Prop"), L("取值", "Values"), L("说明", "What it does")]}
				rows={[
					[
						<C>theme</C>,
						<C>"light" | "dark" | "system"</C>,
						L(
							"不传时自己记在 localStorage 里；应用自己保存设置时传进来，配合 onThemeChange。",
							"Left out, the choice is remembered in localStorage; pass it (with onThemeChange) when the app keeps the setting itself.",
						),
					],
					[<C>onThemeChange</C>, <C>(choice) =&gt; void</C>, L("useTheme().setChoice 被调用时通知你。", "Called when useTheme().setChoice runs.")],
					[
						<C>messages</C>,
						<C>zh | en | Partial&lt;Messages&gt;</C>,
						L("sityle 自己的文字，默认中文。传 en 换成英文，或只覆盖其中几句。", "sityle's own texts, Chinese by default. Pass en for English, or override a few."),
					],
					[
						<C>motion</C>,
						<C>"on" | "reduce" | "system"</C>,
						L(
							"默认 on：一直有动效，不管系统的「减少动态效果」。reduce 只留淡入淡出；system 跟随系统。",
							'Default on: full motion whatever the system says. reduce keeps fades only; system follows the system\'s "reduce motion".',
						),
					],
				]}
			/>
			<H>{L("在应用里切换主题", "Switching the theme in the app")}</H>
			<Code>{`import { useTheme, Segmented } from "sityle";

function ThemeSwitch() {
  const { choice, resolved, setChoice } = useTheme(); // resolved: "light" | "dark"
  return (
    <Segmented label="${L("主题", "Theme")}" value={choice} onChange={setChoice} options={[
      { value: "light", label: "${L("宣纸", "Paper")}" },
      { value: "dark", label: "${L("浓墨", "Ink")}" },
      { value: "system", label: "${L("跟随系统", "System")}" },
    ]} />
  );
}`}</Code>
			<H>{L("不闪一下浅色", "No flash of the light theme")}</H>
			<P>
				{L(
					"记住的主题要等 React 跑起来才生效，深色用户会先看到一下浅色。把 themeScript 放进 <head>，第一帧就是对的：",
					"A remembered theme applies only once React runs, so dark-theme users see a flash of light. Put themeScript in <head> and the first frame is right:",
				)}
			</P>
			<Code>{`import { themeScript } from "sityle";
<script dangerouslySetInnerHTML={{ __html: themeScript }} />`}</Code>
			<H>{L("文字", "Texts")}</H>
			<Code>{`import { en, SiProvider } from "sityle";

<SiProvider messages={en}>…</SiProvider>
<SiProvider messages={{ ...en, cancel: "Never mind" }}>…</SiProvider>`}</Code>
			<P>
				{L(
					"单个组件上的文字属性（CopyButton label、PasswordField labels……）优先于这里。自己的组件里用 useMessages() 读到同一套文字。",
					"Per-component text props (CopyButton label, PasswordField labels…) win over these. Your own components read the same texts with useMessages().",
				)}
			</P>
		</Section>
	);
}

/* ── 样式表与令牌 ── */
function Styles() {
	const L = useL();
	return (
		<Section id="styles">
			<Table
				head={[L("引入", "Import"), L("是什么", "What it is")]}
				rows={[
					[
						<C>sityle/style.css</C>,
						L("令牌和全部组件。只影响 si-* 元素，基础规则用 :where()，你的样式总能覆盖。", "Tokens and every component. Touches only si-* elements; its base rules use :where(), so yours always win."),
					],
					[
						<C>sityle/base.css</C>,
						L(
							"可选的页面底子：重置、宣纸 body、纸纹、全局焦点环、细滚动条。sityle 只是页面一部分时不要引。",
							"Optional page ground: reset, rice-paper body, paper fibre, focus ring, slim scrollbars. Leave it out when sityle is only part of a page.",
						),
					],
					[<C>sityle/style.layer.css</C>, L("同 style.css，包在 @layer sityle 里，给用级联层排序的项目。", "style.css inside @layer sityle, for projects that order CSS with cascade layers.")],
					[
						<C>sityle/css/*.css</C>,
						L("按组件拆开的文件：tokens.css + core.css + 用到的组件（button.css、field.css……）。", "One file per component module: tokens.css + core.css + the ones you use (button.css, field.css…)."),
					],
				]}
			/>
			<H>{L("令牌", "Tokens")}</H>
			<P>
				{L(
					"所有颜色、字体、圆角、间距、时长都是 CSS 变量 --si-*。颜色用 light-dark() 写，浅色深色各一份，跟着 <html data-theme> 走。你自己的 CSS 也只用这些变量，不写死颜色。",
					"Every colour, font, radius, space and duration is a CSS variable --si-*. Colours are written with light-dark(), one value per theme, following <html data-theme>. Your own CSS uses these variables too, never raw colours.",
				)}
			</P>
			<Table
				head={[L("类别", "Family"), L("变量", "Variables")]}
				rows={[
					[L("纸与墨", "Paper and ink"), <C>--si-paper -raised -sunk · --si-ink -2 -3 · --si-line · --si-scrim</C>],
					[
						L("颜料", "Pigments"),
						<>
							<C>--si-jade · --si-azure · --si-gold · --si-cinnabar</C> {L("各有 -soft（浅底）-text（文字）-fill（实心底）-hover", "each with -soft (tint) -text (text) -fill (solid) -hover")}
						</>,
					],
					[L("字体", "Type"), <C>--si-font-brush -serif -sans -mono -heading · --si-type-*</C>],
					[L("形状", "Shape"), <C>--si-r-sm -md -lg -xl -full · --si-e1 -e2 -e3</C>],
					[L("尺寸与间距", "Size and space"), <C>--si-h-sm -md -lg -input -field · --si-space-1…6 -card -dialog</C>],
					[L("动效", "Motion"), <C>--si-t-quick -base -slow -ink · --si-ease-out -in -spring</C>],
					[L("层级", "Stacking"), <C>--si-z-fab -dialog -popover -tooltip</C>],
					[
						L("其他", "Other"),
						<>
							<C>--si-ring</C> {L("焦点光环宽度", "focus halo width")} · <C>--si-room</C> {L("浮层下方剩余空间", "room left under a popover")} · <C>--si-scrollbar</C>{" "}
							{L("对话框打开时隐藏的滚动条宽度", "width of the scrollbar hidden while a dialog is open")} · <C>--si-overscan</C> · <C>--si-scroll-thumb</C>
						</>,
					],
				]}
			/>
			<H>{L("改成你的样子", "Making it yours")}</H>
			<P>{L("在 :root 上覆盖变量即可。比如整个应用都用黑体做标题，圆角再小一点：", "Override variables on :root. For example, sans headings everywhere and smaller corners:")}</P>
			<Code>{`:root {
  --si-font-heading: var(--si-font-sans);
  --si-r-md: 10px;
}
.my-panel {
  background: var(--si-paper-raised);
  border: 1px solid var(--si-line);
  border-radius: var(--si-r-lg);
  font: var(--si-type-body);
}`}</Code>
			<H>{L("焦点光环与滚动容器", "Focus halos and scroll containers")}</H>
			<P>
				{L(
					"输入框聚焦时在框外画一圈 --si-ring 宽的光环。紧贴着输入框边缘的滚动容器（overflow 不是 visible）会把它裁掉，所以这样的容器边上留出这么宽的内边距。",
					"A focused field draws a --si-ring wide halo outside its box. A scroll container (overflow not visible) right at a field's edge clips it, so leave that much padding there.",
				)}
			</P>
		</Section>
	);
}

/* ── 文字排版 ── */
function Typo() {
	const L = useL();
	const rows: Array<[string, string, string, string]> = [
		["display", "h1", "56 / 400 brush", L("品牌、极少数大标题（书法字只有中文）", "the brand, rare display titles (brush is Chinese only)")],
		["h1", "h1", "30 / 700 heading", L("页面标题", "page title")],
		["h2", "h2", "24 / 700 heading", L("分区标题", "section")],
		["h3", "h3", "19 / 700 heading", L("对话框、面板标题", "dialog, panel")],
		["h4", "h4", "15 / 700 heading", L("卡片标题", "card title")],
		["body", "p", "15 / 400 sans", L("正文（默认）", "body text (default)")],
		["body-sm", "p", "13 / 400 sans", L("次要说明", "secondary text")],
		["label", "span", "13 / 500 sans", L("标签、小标题", "labels, small headings")],
		["caption", "span", "12 / 400 sans", L("注脚、提示", "footnotes, hints")],
		["code", "code", "0.875em mono", L("行内代码、编号、色值", "inline code, numbers, colour values")],
		["quote", "blockquote", "16 / 400 serif", L("引文", "quotations")],
	];
	return (
		<Section id="typography">
			<P>
				{L(
					"Typography 按字号表排文字，没有外边距（间距交给外面的布局）。每一级同时是一个 CSS 变量 --si-type-*，自己写 CSS 时用 font: var(--si-type-h2)。",
					"Typography sets text on the type scale, with no margins (the layout around it spaces it). Each step is also a CSS variable --si-type-*: in your own CSS, font: var(--si-type-h2).",
				)}
			</P>
			<Table
				head={["variant", L("默认元素", "Element"), L("字号 / 字重 / 字体", "Size / weight / font"), L("用在", "For")]}
				rows={rows.map(([v, el, size, use]) => [<C>{v}</C>, <C>{el}</C>, size, use])}
			/>
			<Table
				head={[L("属性", "Prop"), L("说明", "What it does")]}
				rows={[
					[<C>as</C>, L('换元素不换样子：看着像 h3 的 h2 写 variant="h3" as="h2"。', 'Change the element, keep the look: an h2 that looks like h3 is variant="h3" as="h2".')],
					[
						<C>tone</C>,
						L("muted（次要）、faint（提示）、jade / azure / gold / danger。不传就继承周围的颜色。", "muted, faint, jade / azure / gold / danger. Left out, it takes the colour around it."),
					],
					[<C>lines</C>, L("最多显示几行，多出的变成省略号；1 是单行截断。", "Show at most this many lines, then an ellipsis; 1 truncates to one line.")],
					[<C>align</C>, <C>"start" | "center" | "end"</C>],
				]}
			/>
			<Code>{`<Typography variant="h2">${L("阅读设置", "Reading settings")}</Typography>
<Typography tone="muted">${L("改动会同步到你的其他设备。", "Changes sync to your other devices.")}</Typography>
<Typography variant="caption" lines={1}>{longPath}</Typography>`}</Code>
		</Section>
	);
}

/* ── 约定 ── */
function Conventions() {
	const L = useL();
	return (
		<Section id="conventions">
			<H>{L("属性直接透传", "Props pass through")}</H>
			<P>
				{L(
					"每个组件都接受 className、style、ref 和它那个元素的原生属性（data-*、aria-*、事件……）。表单控件（Switch、Checkbox、TextField……）把原生属性和 ref 给里面的 <input>，className / style 给外层。",
					"Every component takes className, style, ref and its element's native props (data-*, aria-*, handlers…). Form controls (Switch, Checkbox, TextField…) give native props and ref to their <input>, className / style to the wrapper.",
				)}
			</P>
			<H>{L("受控或非受控", "Controlled or not")}</H>
			<P>
				{L(
					"表单控件可以 value + onChange（或 checked）受控；也可以只给 defaultValue（defaultChecked）和 name，放进普通 <form> 里直接提交——SelectField 用隐藏输入框提交。",
					"Form controls take value + onChange (or checked), or just defaultValue (defaultChecked) and a name inside a plain <form>; SelectField submits through a hidden input.",
				)}
			</P>
			<Code>{`<form action="/save">
  <TextField name="title" label="${L("诗名", "Title")}" defaultValue="${L("春晓", "Spring Dawn")}" />
  <SelectField name="dynasty" label="${L("朝代", "Dynasty")}" defaultValue="tang" options={[…]} />
  <Switch name="pinyin" label="${L("显示拼音", "Show pinyin")}" defaultChecked />
  <Button type="submit">${L("提交", "Submit")}</Button>
</form>`}</Code>
			<H>{L("链接与路由", "Links and routers")}</H>
			<P>
				{L(
					"Button、NavItem、ListItem 有 href 时渲染真正的 <a>（中键新开、复制链接都正常）。用路由库时传 as：Next.js 的 Link 直接用；to 风格的链接包一层。",
					"Button, NavItem and ListItem with href render a real <a> (middle-click and copy link work). With a router, pass as: Next.js Link works as is; wrap to-style links.",
				)}
			</P>
			<Code>{`import { Link } from "react-router";
const RouterLink = ({ href, ...p }: { href: string }) => <Link to={href} {...p} />;

<NavItem as={RouterLink} href="/books/1" label="${L("唐诗", "Tang poems")}" current={…} />`}</Code>
			<H>{L("命名", "Names")}</H>
			<Table
				head={[L("意思", "Meaning"), L("属性", "Prop")]}
				rows={[
					[L("颜色", "Colour"), <C>tone="jade" | "azure" | "gold" | "danger"</C>],
					[L("一项的第二行文字", "An item's second line"), <C>description</C>],
					[L("输入框下方的说明", "Help under a form field"), <C>hint</C>],
					[L("开关、勾选的文字", "A toggle's text"), <C>label + description</C>],
				]}
			/>
			<H>{L("浮层", "Popovers")}</H>
			<P>
				{L(
					"菜单、下拉列表、提示、对话框都挂在 <body> 上，卡片和对话框不会裁掉它们。所以别用后代选择器（.sidebar .si-menu）去摆放菜单，用 Menu 的 align、matchWidth、className。",
					"Menus, select lists, tooltips and dialogs hang on <body>, so no card or dialog clips them. Don't place a menu with a descendant selector (.sidebar .si-menu); use Menu's align, matchWidth and className.",
				)}
			</P>
			<H>{L("键盘", "Keyboard")}</H>
			<P>
				{L(
					"Tabs 和 Segmented 只占一个 Tab 位置，用方向键 / Home / End 移动。菜单和右键菜单：↑↓、Home、End、打字跳转、Esc、Tab（关闭后焦点回到原处）。对话框：Tab 只在框内循环，打开时锁住页面滚动，关闭后焦点回到触发按钮。",
					"Tabs and Segmented are one Tab stop; arrows / Home / End move. Menu and ContextMenu: ↑ ↓, Home, End, typeahead, Escape, Tab (focus goes back where it was). Dialog: Tab stays inside, the page doesn't scroll while it is open, focus returns to the trigger when it closes.",
				)}
			</P>
		</Section>
	);
}

/* ── 组件一览 ── */
function Reference() {
	const L = useL();
	return (
		<Section id="reference">
			<P>
				{L(
					"每个组件做什么用、主要属性。点名字看它的演示和写法；完整类型在包里的 .d.ts（每个都导出了 XxxProps）。",
					"What each component is for and its main props. Click a name for its demo and code; the full types are in the package's .d.ts (each exports its XxxProps).",
				)}
			</P>
			{CATALOGUE.map((g) => (
				<div key={g.id} className="sc-ref-group">
					<H>{L(g.zh, g.en)}</H>
					<Table
						head={[L("组件", "Component"), L("做什么用", "What it is for"), L("主要属性", "Main props")]}
						rows={g.items.map((e) => [
							<a href={`/#${cmpId(e.name)}`}>
								<C>{e.name}</C>
							</a>,
							L(e.zh, e.en),
							<span className="sc-props">{e.props}</span>,
						])}
					/>
				</div>
			))}
			<H>{L("工具", "Helpers")}</H>
			<Table
				head={[L("导出", "Export"), L("做什么用", "What it is for")]}
				rows={[
					[<C>useTheme()</C>, L("当前主题和切换方法。", "The current theme and how to change it.")],
					[<C>themeScript</C>, L("放进 <head> 防止主题闪烁。", "For <head>: no theme flash.")],
					[<C>useMessages() · zh · en</C>, L("sityle 自己的文字。", "sityle's own texts.")],
					[<C>passwordStrength(v)</C>, L("口令强度 0–4，StrengthMeter 用的就是它。", "Password strength 0–4, what StrengthMeter shows.")],
					[<C>spring · ease · popover()</C>, L("和组件一致的 Motion 动画参数。", "Motion settings matching the components.")],
					[<C>inkHandler() · spawnInk()</C>, L("给你自己的元素加墨晕。", "Ink on your own elements.")],
					[<C>motionReduced()</C>, L("此刻是否减少动效（按 SiProvider motion）。", "Whether motion is reduced right now (per SiProvider motion).")],
				]}
			/>
		</Section>
	);
}

/* ── 动效与墨晕 ── */
function MotionDoc() {
	const L = useL();
	return (
		<Section id="motion">
			<P>
				{L(
					"进入用 ease-out（舒展），有形变的东西用弹簧（回弹），离开用 ease-in（收），都很短。自己的动画用同样的参数，和组件保持一个节奏：",
					"Entering eases out, things that change shape spring, leaving eases in, all short. Use the same settings in your own animations to keep one rhythm:",
				)}
			</P>
			<Code>{`import { motion } from "motion/react";
import { ease, popover, spring } from "sityle";

<motion.div layout transition={spring.bouncy} />
<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, ease: ease.out }} />
<motion.div {...popover(false)} />  {/* ${L("像菜单一样展开", "unfold like a menu")} */}`}</Code>
			<H>{L("给自己的元素加墨晕", "Ink on your own elements")}</H>
			<P>
				{L(
					"元素加上 si-ink-host 类（需要定位和 overflow: hidden，这个类都给了），按下时用 inkHandler：",
					"Give the element the si-ink-host class (it sets the position and overflow it needs) and ink it on press with inkHandler:",
				)}
			</P>
			<Code>{`import { inkHandler } from "sityle";

<div className="my-tile si-ink-host" onPointerDown={inkHandler()} role="button" tabIndex={0}>…</div>`}</Code>
			<H>{L("减少动效", "Reduced motion")}</H>
			<P>
				{L(
					'默认不管系统的「减少动态效果」，动效一直开着（Windows 关掉「动画效果」后很多人并不知道）。要尊重这个设置，用 <SiProvider motion="system">；在应用里给用户一个开关，就传 "on" / "reduce"。',
					'By default the system\'s "reduce motion" is ignored and motion stays on (many people switch off Windows\' "animation effects" without knowing). To honour it, use <SiProvider motion="system">; to give users a switch in the app, pass "on" / "reduce".',
				)}
			</P>
		</Section>
	);
}

/* ── 服务端渲染 · 浏览器 · 开发 ── */
function More() {
	const L = useL();
	return (
		<Section id="more">
			<H>{L("服务端渲染", "Server rendering")}</H>
			<P>
				{L(
					'所有组件都能在服务端渲染。包的开头有 "use client"，Next.js app router 可以直接引用。对话框、提示、菜单、下拉列表在水合之后才挂到 <body> 上。',
					'Everything renders on the server. The build starts with "use client", so the Next.js app router imports it directly. Dialogs, tooltips, menus and select lists portal to <body> only after hydration.',
				)}
			</P>
			<H>{L("浏览器", "Browsers")}</H>
			<P>
				{L(
					"当前的常青浏览器：令牌用了 light-dark()（Chrome 123、Safari 17.5、Firefox 120），还有 :has() 和 color-mix()。",
					"Current evergreen browsers: the tokens use light-dark() (Chrome 123, Safari 17.5, Firefox 120), plus :has() and color-mix().",
				)}
			</P>
			<H>{L("用还没发布的分支", "An unreleased branch")}</H>
			<Code>{`npm i github:CastoricSi/sityle#<branch>   # ${L("安装时会自动构建", "builds on install")}`}</Code>
			<H>{L("同时改 sityle 和项目", "Working on sityle and a project together")}</H>
			<P>
				{L(
					"在项目里 npm i ../sityle 链接本地副本（不要提交），sityle 里改完运行 npm run build:lib。用 Vite 时去重 React，否则会加载两份 React（Invalid hook call）：",
					"Link the local copy with npm i ../sityle in the project (don't commit it) and run npm run build:lib in sityle after changes. With Vite, dedupe React, or two copies load (Invalid hook call):",
				)}
			</P>
			<Code>{`// vite.config.ts
export default defineConfig({
  resolve: { dedupe: ["react", "react-dom", "motion"] },
});`}</Code>
		</Section>
	);
}

/* ── 设计规则 ── */
function Rules() {
	const L = useL();
	const rules: Array<[string, string, string, string]> = [
		[
			"颜色",
			"Colour",
			"只用 --si-* 令牌。石绿是唯一的主色；石青、泥金是点缀；朱砂只用于危险操作和印章。",
			"Only --si-* tokens. Mineral green is the one primary; azurite and gold are accents; cinnabar only for danger and seals.",
		],
		[
			"字体",
			"Type",
			"书法字只用于品牌和极少数大标题；标题用标题字体，界面和正文用黑体，口令和编号用等宽。",
			"Brush only for the brand and rare display titles; headings in the heading font, interface and body in sans, secrets and codes in mono.",
		],
		[
			"按钮",
			"Buttons",
			"每个区域一个实心按钮，其余用 flat / bordered / light。去别处是链接（href），做事情是按钮。",
			"One solid button per area; flat / bordered / light for the rest. Going somewhere is a link (href), doing something is a button.",
		],
		["动效", "Motion", "进入舒展，形变回弹，离开收得快。", "Enter with ease-out, change shape on a spring, leave quickly."],
		["图标", "Icons", "线性图标；只有图标的按钮一定有提示。", "Line icons; an icon-only button always has a tooltip."],
		[
			"对话框",
			"Dialogs",
			'只用来做决定；反馈写在动作发生的地方，不弹通知。手机上默认底部弹出，长内容用 phone="full"。',
			'Only for decisions; feedback goes where the action happened, no toasts. On phones a bottom sheet; phone="full" for long content.',
		],
	];
	return (
		<Section id="rules">
			<Table head={["", ""]} rows={rules.map(([zh, en, rzh, ren]) => [<b>{L(zh, en)}</b>, L(rzh, ren)])} />
		</Section>
	);
}
