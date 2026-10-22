import { createContext, useContext } from "react";

/** Every text sityle writes itself. Override app-wide with <SiProvider messages>. */
export type Messages = {
	copy: string;
	copied: string;
	show: string;
	hide: string;
	clear: string;
	cancel: string;
	loading: string;
	/** Password strength, weakest first (5). */
	strength: [string, string, string, string, string];
};

export const zh: Messages = {
	copy: "复制",
	copied: "已复制",
	show: "显示",
	hide: "隐藏",
	clear: "清除",
	cancel: "取消",
	loading: "加载中",
	strength: ["太短", "弱", "一般", "较强", "很强"],
};

export const en: Messages = {
	copy: "Copy",
	copied: "Copied",
	show: "Show",
	hide: "Hide",
	clear: "Clear",
	cancel: "Cancel",
	loading: "Loading",
	strength: ["Too short", "Weak", "Fair", "Strong", "Very strong"],
};

export const MessagesContext = createContext<Messages>(zh);

/** The texts in use (Chinese without a provider). */
export function useMessages(): Messages {
	return useContext(MessagesContext);
}
