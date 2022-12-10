import type { AxiosRequestConfig } from 'axios';
import Piscina from 'piscina';
import {
	CountryList,
	LanguageList,
	Brainly,
	JsonRes,
	Answer,
	Question,
	Author,
} from '..';
import Util from './util';

/**
 * @param {{c: CountryList, language: LanguageList, question: string, length: number, options: AxiosRequestConfig}} arg_0
 * @return {Promise<{question: Question, answers: Answer[]}[] | { err: string; }>}
 */
export async function search({
	c,
	language,
	question,
	length = 10,
	options,
}: {
	c: CountryList;
	language: LanguageList;
	question: string;
	length: number;
	options?: AxiosRequestConfig;
}) {
	if (!Piscina.isWorkerThread) {
		throw new Error("You're not able to use this command");
	}
	try {
		if (!Brainly.isValidLanguage(language)) {
			return {
				err: 'INVALID_LANGUAGE',
			};
		}
		const cookie = Util.generateZadaneCookieGuest();
		const body = Brainly.getRequestParams('SearchQuery', {
			question,
			length,
		});
		options?.headers?.common?.set('Cookie', cookie);

		const response = await Brainly.client(c).post(
			`graphql/${language.toLowerCase()}`,
			body,
			options,
		);
		const json = response.data as Array<JsonRes>;
		const validJSON = json[0].data.questionSearch!.edges;

		const objects = validJSON.map((obj) => {
			const question: Question = Util.convertQuestion(obj.node);

			const answers: Answer[] = obj.node.answers.nodes.map((answerObj) =>
				Util.convertAnswer(answerObj),
			);
			return {
				question,
				answers,
			};
		});

		return objects;
	} catch (err) {
		throw new Error((err as Error).message);
	}
}

/**
 * @param {{country: CountryList, language: LanguageList, userId: string}} arg_0
 * @return {Author}
 */
export async function findUser({
	country,
	language,
	userId,
}: {
	country: CountryList;
	language: LanguageList;
	userId: number | string;
}): Promise<Author | { err: string } | undefined> {
	if (!Piscina.isWorkerThread) {
		throw new Error("You're not able to use this command");
	}

	try {
		if (!Brainly.isValidLanguage(language)) {
			return {
				err: 'INVALID_LANGUAGE',
			};
		}

		const body = Brainly.getRequestParams(
			typeof userId === 'number'
				? 'FindUserByDatabaseID'
				: 'FindUserById',
			{
				userid: userId,
			},
		);
		const response = await Brainly.client(country).post(
			`graphql/${language.toLowerCase()}`,
			body,
		);

		if (response.status !== 200) {
			return {
				err: 'Response fails',
			};
		}

		const json = response.data as JsonRes;
		if (typeof json !== 'object' || !json.data.user) {
			return {
				err: 'Response fails',
			};
		}

		return Util.convertAuthor(json.data.user);
	} catch (err) {
		throw new Error((err as Error).message);
	}
}
