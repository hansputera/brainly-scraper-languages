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
					pathResolve(brainlyScraperDir, 'gql.json'),
					(stat) => stat.isFile(),
				))
			) {
				throw new Error("Couldn't find gql.json");
			}

			return readFile(pathResolve(brainlyScraperDir, 'gql.json'), {
				encoding: 'utf8',
			});
		case 'write':
			const file = createWriteStream(
				pathResolve(brainlyScraperDir, 'gql.json'),
			);

			contentStream?.pipe(file);
			break;
	}

	return;
};

export const fetchGraphQLSchemas = async (): Promise<number> => {
	const responseStream = await axios.get(
		'https://gist.github.com/hanifdwyputras/' +
			'913246458dd9beb1df433786b19caecd/raw/',
		{
			responseType: 'stream',
		},
	);
	await actionGraphQLSchemas('write', responseStream.data);

	return Date.now();
};
