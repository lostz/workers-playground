/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		switch (url.pathname) {
			case '/message':
				return new Response('Hello, World!');
			case '/random':
				return new Response(crypto.randomUUID());
			default:
				return new Response('Not Found', { status: 404 });
		}
	},

	async scheduled(event, env, ctx): Promise<void> {
		const workerUrl = `https://workers-playground.${env.CF_ZONE || 'yourdomain'}.workers.dev/`;
		
		try {
			console.log('Cron triggered at:', new Date().toISOString());
			
			const response = await fetch(workerUrl);
			const text = await response.text();
			
			console.log('Successfully accessed root path:', response.status);
			console.log('Response:', text);
		} catch (error) {
			console.error('Failed to access root path:', error);
		}
	},
} satisfies ExportedHandler<Env>;
