// Pieces the style page and the docs share: section heads, code blocks, component cards.
import { Card, CopyButton } from "@si";
import { ENTRY } from "./catalogue";
import { useLang } from "./lang";

declare const __SI_VERSION__: string;
export const VERSION = `v${__SI_VERSION__}`;

/** Section title in the page's language, the other language beside it. */
export function Head({ id, title, en, children }: { id: string; title: string; en: string; children?: React.ReactNode }) {
	const english = useLang() === "en";
	return (
		<div className="sc-head">
			<h2 id={`h-${id}`}>{english ? en : title}</h2>
			<span className="sc-en">{english ? title : en}</span>
			{children && <p>{children}</p>}
		</div>
	);
}

/** A code sample with a copy button. */
export function Code({ children }: { children: string }) {
	const code = children.replace(/^\n+|\s+$/g, "");
	return (
		<div className="sc-code">
			<pre>
				<code>{code}</code>
			</pre>
			<div className="sc-code-copy">
				<CopyButton value={code} />
			</div>
		</div>
	);
}

/** Where a component's card is on the style page: /#cmp-Button. */
export const cmpId = (name: string) => `cmp-${name}`;

/**
 * One component (or a few that go together) on the style page: its name, what
 * it is for (from the catalogue unless given), a live demo and the code for the
 * usual case.
 */
export function Spec({ names, what, code, wide, children }: { names: string[]; what?: React.ReactNode; code?: string; wide?: boolean; children: React.ReactNode }) {
	const english = useLang() === "en";
	const entry = ENTRY.get(names[0]!);
	return (
		<Card
			id={cmpId(names[0]!)}
			className={wide ? "sc-spec-card is-wide" : "sc-spec-card"}
			title={
				<span className="sc-spec-names">
					{names.map((n, i) => (
						<code key={n} id={i > 0 ? cmpId(n) : undefined}>
							{n}
						</code>
					))}
				</span>
			}
			description={what ?? (entry && (english ? entry.en : entry.zh))}
		>
			<div className="sc-spec-demo">{children}</div>
			{code && <Code>{code}</Code>}
		</Card>
	);
}

/** A group of components: a heading, a line on what the group is for, the cards. */
export function Category({ id, title, en, what, children }: { id: string; title: string; en: string; what: React.ReactNode; children: React.ReactNode }) {
	const english = useLang() === "en";
	return (
		<div className="sc-category" id={`cat-${id}`}>
			<div className="sc-category-head">
				<h3>
					{english ? en : title}
					<span className="sc-en">{english ? title : en}</span>
				</h3>
				<p>{what}</p>
			</div>
			<div className="sc-grid">{children}</div>
		</div>
	);
}
