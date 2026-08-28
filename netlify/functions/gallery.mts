import type { Config } from '@netlify/functions';
import { listSeeds, parseSeed, removeSeed, saveSeed } from '../lib/gallery.ts';

const RESPONSE_HEADERS = {
	'Cache-Control': 'no-store',
	'Content-Type': 'application/json'
};

function json(data: unknown, init: ResponseInit = {}): Response {
	return new Response(JSON.stringify(data), {
		...init,
		headers: { ...RESPONSE_HEADERS, ...init.headers }
	});
}

async function readSeed(request: Request): Promise<number | null> {
	try {
		const body: unknown = await request.json();
		if (typeof body !== 'object' || body === null || !('seed' in body)) return null;
		return parseSeed(body.seed);
	} catch {
		return null;
	}
}

export default async (request: Request): Promise<Response> => {
	try {
		switch (request.method) {
			case 'GET':
				return json({ seeds: await listSeeds() });

			case 'POST': {
				const seed = await readSeed(request);
				if (seed === null) return json({ error: 'A valid seed is required.' }, { status: 400 });

				const created = await saveSeed(seed);
				return json({ seed }, { status: created ? 201 : 200 });
			}

			case 'DELETE': {
				const seed = await readSeed(request);
				if (seed === null) return json({ error: 'A valid seed is required.' }, { status: 400 });

				await removeSeed(seed);
				return new Response(null, { status: 204, headers: RESPONSE_HEADERS });
			}

			default:
				return json(
					{ error: 'Method not allowed.' },
					{ status: 405, headers: { Allow: 'GET, POST, DELETE' } }
				);
		}
	} catch (error) {
		console.error('Gallery storage request failed', error);
		return json({ error: 'Gallery storage is temporarily unavailable.' }, { status: 500 });
	}
};

export const config: Config = {
	path: '/api/gallery'
};
