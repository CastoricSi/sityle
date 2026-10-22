// The style page is static: Cloudflare serves dist/client first (SPA
// fallback), so this Worker only sees requests no asset could answer.
export default {
	async fetch(): Promise<Response> {
		return new Response("Not found", { status: 404 });
	},
};
