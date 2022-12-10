import { actionGraphQLSchemas } from './graphql-schemas';

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

export const getGraphqlQuery = async (): Promise<string | undefined> => {
	try {
		return actionGraphQLSchemas('read');
	} catch {
		throw new Error('Please initialize the brainly scraper query schemas!');
	}
};

export const languages = Object.keys(baseURLs);
