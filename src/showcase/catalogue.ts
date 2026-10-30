// Every component sityle exports: its group, what it is for, its main props.
// The style page's index and cards and the docs' reference read from here.

export type Entry = { name: string; zh: string; en: string; props: string };
export type Group = { id: string; zh: string; en: string; whatZh: string; whatEn: string; items: Entry[] };

export const CATALOGUE: Group[] = [
	{
		id: "buttons",
		zh: "按钮",
		en: "Buttons",
		whatZh: "按下去会做一件事，或者去一个地方。",
		whatEn: "Press to do something, or to go somewhere.",
		items: [
			{
				name: "Button",
				zh: "最常用的按钮。每个区域只放一个实心（solid）的主操作，其余用 flat / bordered / light。有 href 时是真正的链接。",
				en: "The everyday button. One solid main action per area; flat / bordered / light for the rest. With href it is a real link.",
				props: "variant tone size icon iconOnly pill loading disabled href as",
			},
			{
				name: "IconButton",
				zh: "只有一个图标的安静按钮（收藏、设置、关闭）。label 既是悬停提示，也是读屏名称。",
				en: "A quiet button with one icon (bookmark, settings, close). label is both its tooltip and its accessible name.",
				props: "label active",
			},
			{
				name: "CopyButton",
				zh: "复制一段文字到剪贴板，按下后在原地变成 ✓，不弹通知。",
				en: "Copies a value to the clipboard and turns into ✓ where it is, no toast.",
				props: "value label copiedLabel",
			},
			{
				name: "Fab",
				zh: "浮动按钮：页面上最主要的一个动作（新建），固定在屏幕右下角，手机上常用。",
				en: "Floating action button: the page's one main action (new), fixed at the bottom right; mostly for phones.",
				props: "icon label round",
			},
		],
	},
	{
		id: "inputs",
		zh: "输入",
		en: "Inputs",
		whatZh: "让人填写文字。带浮动标签的输入框（*Field）用于表单；没有标签的原始控件（Input / TextArea / Select）用于自己排版的地方。",
		whatEn: "For typing. Fields with a floating label (*Field) go in forms; the bare controls (Input / TextArea / Select) go where you lay out the label yourself.",
		items: [
			{
				name: "TextField",
				zh: "单行输入。标签在框内，输入时上浮；hint 写说明，error 写错误；end 放复制、打开等小按钮。",
				en: "One line of text. The label sits inside and floats up; hint explains, error reports; end holds small buttons (copy, open).",
				props: "label value defaultValue onChange hint error end mono",
			},
			{
				name: "PasswordField",
				zh: "口令输入：自带显示 / 隐藏和复制，可选强度条。",
				en: "A password: show / hide and copy built in, an optional strength bar.",
				props: "label value onChange strength copy extra autoComplete",
			},
			{
				name: "TextAreaField",
				zh: "多行输入，标签固定在框顶，文字在标签下方滚动。",
				en: "Several lines; the label stays at the top and the text scrolls below it.",
				props: "label value onChange hint error end",
			},
			{
				name: "SelectField",
				zh: "从几项里选一项。用 sityle 自己的下拉列表（不是浏览器的），键盘可操作，不会被对话框裁掉。",
				en: "Pick one of a few. sityle's own list (not the browser's), keyboard friendly, never clipped by a dialog.",
				props: "label options value defaultValue onChange name plain",
			},
			{
				name: "SearchField",
				zh: "搜索框：放大镜图标，有内容时出现清除按钮，Esc 清空。",
				en: "A search box: magnifier icon, a clear button once there is text, Esc clears.",
				props: "label value onChange clearLabel",
			},
			{
				name: "Input",
				zh: "原始单行输入框，没有标签。自己写 <label>。",
				en: "The bare one-line input, no label: write your own <label>.",
				props: "mono + <input> props",
			},
			{ name: "TextArea", zh: "原始多行输入框。", en: "The bare multi-line input.", props: "<textarea> props" },
			{ name: "Select", zh: "原始下拉框（浏览器自带的列表），给 <option>。", en: "The bare select (the browser's own list); give it <option>s.", props: "<select> props" },
			{
				name: "StrengthMeter",
				zh: "口令强度条（五档），配合任何输入框使用；PasswordField strength 用的就是它。",
				en: "A password strength bar (five steps) for any input; PasswordField strength uses it.",
				props: "value labels",
			},
		],
	},
	{
		id: "choice",
		zh: "选择",
		en: "Choice",
		whatZh: "在几个选项之间做选择，或者打开 / 关闭一个设置。",
		whatEn: "Choose between options, or turn a setting on or off.",
		items: [
			{ name: "Switch", zh: "开关：立即生效的设置（显示拼音、自动同步）。", en: "On / off for a setting that applies at once (show pinyin, auto-sync).", props: "label description checked onChange" },
			{
				name: "Checkbox",
				zh: "勾选：多选，或提交前才生效的选项（同意条款）。",
				en: "Tick: several choices, or an option that applies on submit (accept the terms).",
				props: "label description checked onChange",
			},
			{ name: "RadioGroup", zh: "单选组：几项里选一项，选项都摆出来。", en: "One of a few, all options in view.", props: "label value onChange name" },
			{ name: "Radio", zh: "单选组里的一项。", en: "One option of a RadioGroup.", props: "value label description" },
			{
				name: "RadioCard",
				zh: "带图标和说明的大单选项，适合二选一、三选一这种需要解释的选择。",
				en: "A large option with an icon and a description, for a choice of two or three that needs explaining.",
				props: "name checked onChange icon title description",
			},
			{
				name: "Slider",
				zh: "在一个范围里取值（字号、音量），右上角显示当前值。",
				en: "A value in a range (text size, volume), shown at the top right.",
				props: "label value onChange min max step format",
			},
			{
				name: "Segmented",
				zh: "胶囊式切换：2–4 个互斥的视图或模式（列表 / 表格）。",
				en: "Pill switch: 2–4 exclusive views or modes (list / table).",
				props: "label options value onChange role",
			},
			{ name: "Tabs", zh: "笔触式选项卡：把一页内容分成几块。", en: "Brush-stroke tabs: divide a page into parts.", props: "label options value onChange id" },
			{ name: "TabPanel", zh: "选项卡对应的内容区，和 Tabs 用同一个 id 关联。", en: "The panel of a tab, linked to Tabs by its id.", props: "tabs value" },
			{ name: "Chip", zh: "筛选标签：可多选，选中时滑入一个 ✓。", en: "Filter chip: several can be on; a ✓ slides in when selected.", props: "selected onClick" },
		],
	},
	{
		id: "display",
		zh: "展示",
		en: "Display",
		whatZh: "把信息摆出来：文字、卡片、标签、头像、列表行、提示。",
		whatEn: "Show information: text, cards, tags, avatars, list rows, notes.",
		items: [
			{
				name: "Typography",
				zh: "按字号表排文字：display、h1–h4、body、label、caption、code、quote。as 换元素，tone 换颜色，lines 截断。",
				en: "Text on the type scale: display, h1–h4, body, label, caption, code, quote. as changes the element, tone the colour, lines cuts it short.",
				props: "variant as tone lines align",
			},
			{ name: "Card", zh: "一张纸：把相关的内容装在一起，可带标题和说明。", en: "A sheet of paper holding related things, with an optional title and description.", props: "title description" },
			{ name: "Tag", zh: "小标签：状态或分类（已背诵、待复习），不可点。", en: "A small label for a status or category (learned, to review); not pressable.", props: "tone icon" },
			{ name: "Avatar", zh: "头像：取名字的第一个字放在色块上，读屏读全名。", en: "The first character of a name on a pigment tile; read out as the full name.", props: "name tone size decorative" },
			{ name: "AvatarStack", zh: "把几个头像叠在一起（共享的人）。", en: "Avatars overlapping in a row (the people something is shared with).", props: "children" },
			{ name: "Seal", zh: "朱红印章：品牌，或盖在危险操作的对话框上。", en: "A cinnabar seal: the brand, or stamped on a dialog for a dangerous action.", props: "size outline label" },
			{ name: "IconBadge", zh: "图标的圆角底座，放在设置项、空状态前。", en: "A rounded tile for an icon, before a setting or an empty state.", props: "size" },
			{
				name: "ListItem",
				zh: "列表的一行：头像、标题、说明；当前项高亮。有 onClick 是按钮，有 href 是链接，都没有是普通一行。",
				en: "A row of a list: avatar, title, description; the current one is highlighted. A button with onClick, a link with href, a plain row with neither.",
				props: "title description leading current onClick href",
			},
			{ name: "Note", zh: "浅色底的提示段落，提醒或说明。", en: "A paragraph on a tinted ground, for a heads-up or an explanation.", props: "tone icon" },
		],
	},
	{
		id: "layout",
		zh: "布局",
		en: "Layout",
		whatZh: "页面的骨架：侧边导航、设置分组、向导步骤、会长高的容器。",
		whatEn: "The page's frame: side navigation, settings groups, wizard steps, a box that grows smoothly.",
		items: [
			{
				name: "NavItem",
				zh: "侧边栏的一行：图标、名称、计数；当前项高亮。有 href 时是链接。",
				en: "A sidebar row: icon, name, count; the current one is highlighted. A link with href.",
				props: "icon label count current tone wrap href",
			},
			{
				name: "Group",
				zh: "设置页的一组：标题 + 一张卡片里的若干行。plain 用在已经是一张纸的地方（对话框里）。",
				en: "A group on a settings page: a title and rows in a card. plain where it already sits on paper (in a dialog).",
				props: "title plain",
			},
			{ name: "GroupRow", zh: "分组里的一行：左边标题和说明，右边是控件。", en: "A row of a group: title and description on the left, the control on the right.", props: "title description" },
			{ name: "Steps", zh: "向导的进度条：第几步，共几步。", en: "A wizard's progress: step n of m.", props: "current total label" },
			{
				name: "AutoHeight",
				zh: "内容变化时高度平滑过渡（向导换一步、展开更多）。",
				en: "Eases its height when the content changes (a wizard's next step, show more).",
				props: "children",
			},
		],
	},
	{
		id: "overlays",
		zh: "浮层",
		en: "Overlays",
		whatZh: "浮在页面上方的东西：菜单、提示、对话框。都挂在 <body> 上，不会被卡片或对话框裁掉。",
		whatEn: "Things that float above the page: menus, tooltips, dialogs. They hang on <body>, so no card or dialog clips them.",
		items: [
			{
				name: "Menu",
				zh: "点按钮展开的一列操作（重命名、分享、删除）。↑↓ 移动，打字跳到首字母。",
				en: "A list of actions unfolding from a button (rename, share, delete). ↑ ↓ move, typing jumps by first letter.",
				props: "trigger items align matchWidth label",
			},
			{
				name: "ContextMenu",
				zh: "右键点出的菜单，开在指针处，靠屏幕边缘时向左 / 向上展开。按键同 Menu，{ heading } 给一组操作起个小标题。包住一个元素，或用 at + onClose 自己控制。",
				en: "The menu a right-click opens, at the pointer; near the screen's edge it opens leftwards / upwards. Same keys as Menu; { heading } titles a group of items. Wrap one element, or control it with at + onClose.",
				props: "items label at onClose children",
			},
			{
				name: "Tooltip",
				zh: "悬停或键盘聚焦时出现的一句提示。",
				en: "A line of help on hover or keyboard focus.",
				props: "content describe",
			},
			{
				name: "Dialog",
				zh: '只用来做决定的对话框。焦点留在框内，Esc 关闭；手机上从底部升起，phone="full" 铺满屏幕。',
				en: 'A dialog, only for decisions. Focus stays inside, Esc closes; on phones it rises from the bottom, phone="full" fills the screen.',
				props: "open onClose title actions seal wide phone",
			},
			{
				name: "ConfirmDialog",
				zh: "现成的「确定吗？」对话框：标题、说明、取消和确认两个按钮。",
				en: 'A ready "are you sure?" dialog: title, text, cancel and confirm.',
				props: "open title body confirmLabel onConfirm onCancel seal",
			},
		],
	},
	{
		id: "feedback",
		zh: "反馈",
		en: "Feedback",
		whatZh: "告诉人「正在进行」。按钮自己的等待用 Button loading，不用这些。",
		whatEn: 'Say "working on it". A button\'s own wait is Button loading, not these.',
		items: [
			{ name: "InkDrop", zh: "一滴墨慢慢晕开：通用的加载中。", en: "A drop of ink spreading: the general loading sign.", props: "label" },
			{ name: "InkBars", zh: "三笔墨起伏：小地方的加载中（行内、按钮旁）。", en: "Three ink strokes rising: loading in a small place (inline, by a button).", props: "label" },
			{ name: "BrushSpinner", zh: "一笔绕圈：较大区域的加载中。", en: "A brush stroke going round: loading for a larger area.", props: "label" },
			{ name: "Skeleton", zh: "内容到达前的占位条。", en: "A placeholder bar until the content arrives.", props: "width" },
		],
	},
	{
		id: "ink",
		zh: "水墨",
		en: "Ink",
		whatZh: "纯装饰：水墨底子和笔触。",
		whatEn: "Pure decoration: the ink-wash ground and the brush stroke.",
		items: [
			{
				name: "InkWash",
				zh: "画在 canvas 上的水墨晕染背景，铺满它所在的定位容器（本页顶部就是）。",
				en: "An ink-wash background painted on a canvas, filling its positioned parent (the top of this page).",
				props: "seed blots",
			},
			{ name: "BrushStroke", zh: "一笔毛笔笔触，颜色跟随文字颜色，用作下划线。", en: "One brush stroke in the text colour, for underlines.", props: "className style" },
		],
	},
];

export const ENTRY = new Map(CATALOGUE.flatMap((g) => g.items.map((e) => [e.name, e] as const)));
