import type { Config } from '@netlify/functions';
import { parseBouquetInput, parseBouquetName } from '../../src/lib/bouquet.ts';
import { listBouquets, removeBouquet, saveBouquet } from '../lib/bouquets.ts';

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

export default async (request: Request): Promise<Response> => {
	try {
		switch (request.method) {
			case 'GET':
				return json({ bouquets: await listBouquets() });

			case 'POST': {
				let body: unknown;
				try {
					body = await request.json();
				} catch {
					return json({ error: 'A valid bouquet is required.' }, { status: 400 });
				}

				const input = parseBouquetInput(body);
				if (!input) return json({ error: 'A valid bouquet is required.' }, { status: 400 });

				const bouquet = await saveBouquet(input);
				return bouquet
					? json({ bouquet }, { status: 201 })
					: json({ error: 'A bouquet with this name already exists.' }, { status: 409 });
			}

			case 'DELETE': {
				let body: unknown;
				try {
					body = await request.json();
				} catch {
					return json({ error: 'A valid bouquet name is required.' }, { status: 400 });
				}

				const name =
					typeof body === 'object' && body !== null && 'name' in body
						? parseBouquetName(body.name)
						: null;
				if (!name) return json({ error: 'A valid bouquet name is required.' }, { status: 400 });

				await removeBouquet(name);
				return new Response(null, { status: 204, headers: RESPONSE_HEADERS });
			}

			default:
				return json(
					{ error: 'Method not allowed.' },
					{ status: 405, headers: { Allow: 'GET, POST, DELETE' } }
				);
		}
	} catch (error) {
		console.error('Bouquet storage request failed', error);
		return json({ error: 'Bouquet storage is temporarily unavailable.' }, { status: 500 });
	}
};

export const config: Config = {
	path: '/api/bouquets'
};
