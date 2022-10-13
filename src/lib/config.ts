import * as fs from 'fs';
import path from 'path';

export const baseURLs = {
	id: 'https://brainly.co.id',
	us: 'https://brainly.com',
	es: 'https://brainly.lat',
	pt: 'https://brainly.com.br',
	ru: 'https://znanija.com',
	ro: 'https://brainly.ro',
	tr: 'https://eodev.com',
	ph: 'https://brainly.ph',
	pl: 'https://brainly.pl',
	hi: 'https://brainly.in',
	fr: 'https://nosdevoirs.fr',
};

export const getGraphqlQuery = () => {
	const graphqlFile = path.resolve(
		__dirname,
		'..',
		'..',
		'assets',
		'schemas.graphql',
	);

	return fs.readFileSync(graphqlFile, {
		encoding: 'utf8',
	});
};

export const languages = Object.keys(baseURLs);
