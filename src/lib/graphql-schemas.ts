import axios from 'axios';
import { resolve as pathResolve } from 'path';
import { type Stats, createWriteStream } from 'fs';
import { mkdir, readFile, stat } from 'fs/promises';
import { homedir as getHomeDirectory } from 'os';
import { type Readable } from 'stream';

const statCall = (path: string, condition?: (stat: Stats) => boolean) =>
	stat(path)
		.then((stat) => (condition ? condition(stat) : true))
		.catch(() => false);

export const actionGraphQLSchemas = async (
	action: 'write' | 'read',
	contentStream?: Readable,
): Promise<string | undefined> => {
	const brainlyScraperDir = pathResolve(
		getHomeDirectory(),
		'.brainlyscraper2',
	);
	if (!(await statCall(brainlyScraperDir, (stat) => stat.isDirectory()))) {
		await mkdir(brainlyScraperDir, { recursive: true });
	}

	switch (action) {
		case 'read':
			if (
				!(await statCall(
					pathResolve(brainlyScraperDir, 'schemas.gql'),
					(stat) => stat.isFile(),
				))
			) {
				throw new Error("Couldn't find schemas.gql");
			}

			return readFile(pathResolve(brainlyScraperDir, 'schemas.gql'), {
				encoding: 'utf8',
			});
		case 'write':
			const file = createWriteStream(
				pathResolve(brainlyScraperDir, 'schemas.gql'),
			);

			contentStream?.pipe(file);
			break;
	}

	return;
};

export const fetchGraphQLSchemas = async (): Promise<number> => {
	const responseStream = await axios.get(
		'https://github.com/hanifdwyputras/brainly-scraper-v2/' +
			'raw/develop/assets/schemas.graphql',
		{
			responseType: 'stream',
		},
	);
	await actionGraphQLSchemas('write', responseStream.data);

	return Date.now();
};
