// jsdom lacks a few browser APIs the components use.
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(cleanup);

if (typeof window !== "undefined") polyfill();

function polyfill() {

if (!window.matchMedia) {
	window.matchMedia = (query: string) =>
		({
			matches: false,
			media: query,
			onchange: null,
			addEventListener() {},
			removeEventListener() {},
			addListener() {},
			removeListener() {},
			dispatchEvent: () => false,
		}) as MediaQueryList;
}

if (!window.ResizeObserver) {
	window.ResizeObserver = class {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
}

if (!Element.prototype.animate) {
	Element.prototype.animate = function () {
		return { finished: Promise.resolve(), cancel() {} } as unknown as Animation;
	};
}

if (!Element.prototype.scrollIntoView) Element.prototype.scrollIntoView = function () {};
}
