import { ExternalLink, Heart, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import { Avatar, Button, Card, CopyButton, IconButton, ListItem, Tag, TextAreaField, TextField, Typography, type Tone } from "@si";
import { useL, useLang } from "./lang";
import { Head } from "./ui";

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

export function Sample() {
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
					<Typography variant="h3" as="h3">
						{poem.title}
					</Typography>
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
