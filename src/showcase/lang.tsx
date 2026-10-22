import { createContext, useContext } from "react";

/** The style page's language: its sample text and sityle's own texts switch together. */
export type Lang = "zh" | "en";

export const LangContext = createContext<Lang>("zh");

/** `L("中文", "English")` picks the page's language. */
export function useL() {
	const lang = useContext(LangContext);
	return (zh: string, en: string) => (lang === "en" ? en : zh);
}

export function useLang(): Lang {
	return useContext(LangContext);
}
