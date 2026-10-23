import { Menu as MenuIcon, Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { en, IconButton, Seal, Segmented, SiProvider, useTheme, zh, type MotionChoice, type ThemeChoice } from "@si";
import { Components } from "./components";
import { Colors, Hero, Icons, MotionSection, Shape, Type } from "./design";
import { Docs } from "./docs";
import { LangContext, useL, type Lang } from "./lang";
import { Sample } from "./sample";
import { VERSION } from "./ui";

const LANG_KEY = "sc-lang";
function readLang(): Lang {
	try {
		return localStorage.getItem(LANG_KEY) === "en" ? "en" : "zh";
	} catch {
		return "zh";
	}
}

/** Two pages: the style page (/) and the documentation (/docs). */
/** Wide enough for the docs' contents to sit beside the text (matches showcase.css). */
const WIDE = "(min-width: 961px)";

const onDocs = () => /^\/docs(\/|$)/.test(location.pathname);

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
	const [motionChoice, setMotionChoice] = useState<MotionChoice>("on");
	const docs = onDocs();
	// the docs' contents: a sidebar on wide screens (open), a drawer on narrow ones (closed)
	const [toc, setToc] = useState(() => matchMedia(WIDE).matches);
	useEffect(() => {
		const mq = matchMedia(WIDE);
		const on = () => setToc(mq.matches);
		mq.addEventListener("change", on);
		return () => mq.removeEventListener("change", on);
	}, []);
	useEffect(() => {
		document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
	}, [lang]);
	// opened with #something (a link from the docs to a component): the browser looked
	// for it before React rendered the page, so go there now
	useEffect(() => {
		const id = decodeURIComponent(location.hash.slice(1));
		if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
	}, []);
	useEffect(() => {
		document.title = docs ? (lang === "en" ? "Documentation · sityle" : "文档 · 水祀丹青") : "水祀丹青 · sityle";
	}, [docs, lang]);
	return (
		<LangContext.Provider value={lang}>
			<SiProvider messages={lang === "en" ? en : zh} motion={motionChoice}>
				<AppBar lang={lang} onLang={setLang} toc={docs ? { open: toc, toggle: () => setToc((o) => !o) } : undefined} />
				{docs ? (
					<main>
						<Docs toc={toc} onClose={() => !matchMedia(WIDE).matches && setToc(false)} />
					</main>
				) : (
					<>
						<Hero />
						<main className="sc-wrap">
							<Colors />
							<Type />
							<Shape />
							<MotionSection motion={motionChoice} onMotion={setMotionChoice} />
							<Icons />
							{/* examples hold their own text in state: start them over in the new language */}
							<Components key={`c-${lang}`} />
							<Sample key={`s-${lang}`} />
						</main>
					</>
				)}
				<Footer />
			</SiProvider>
		</LangContext.Provider>
	);
}

function AppBar({ lang, onLang, toc }: { lang: Lang; onLang: (l: Lang) => void; toc?: { open: boolean; toggle: () => void } }) {
	const { choice, setChoice } = useTheme();
	const L = useL();
	return (
		<header className={toc ? "sc-bar has-menu" : "sc-bar"}>
			<div className="sc-wrap">
				{toc && (
					<IconButton label={toc.open ? L("收起目录", "Hide contents") : L("目录", "Contents")} aria-expanded={toc.open} aria-controls="sc-toc" onClick={toc.toggle}>
						<MenuIcon />
					</IconButton>
				)}
				<a className="sc-brand" href="/" aria-label="水祀丹青">
					<Seal>祀</Seal>
					<span className="sc-brand-name">水祀丹青</span>
				</a>
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

function Footer() {
	const L = useL();
	return (
		<footer className="sc-footer">
			<div className="sc-wrap">
				<Seal>青</Seal>水祀丹青 · sityle {VERSION} · <a href="/docs">{L("文档", "Docs")}</a> · <a href="https://github.com/CastoricSi/sityle">GitHub</a>
			</div>
		</footer>
	);
}
