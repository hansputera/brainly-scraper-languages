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
		const body = Brainly.getRequestParams(question, length);
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
 * @param {{country: CountryList, language: LanguageList, userId: number}} arg_0
 * @return {Author}
 */
export async function findUser({
	country,
	language,
	userId,
}: {
	country: CountryList;
	language: LanguageList;
	userId: number;
}): Promise<Author | { err: string } | undefined> {
	if (Piscina.isWorkerThread) {
		throw new Error("You're not able to use this command");
	}

	try {
		if (!Brainly.isValidLanguage(language)) {
			return {
				err: 'INVALID_LANGUAGE',
			};
		}

		const response = await Brainly.client(country).get(
			`graphql/${language.toLowerCase()}`,
			{
				params: {
					operationName: 'ProfilePage',
					variables: {
						userId: userId,
					},
					extensions: {
						persistedQuery: {
							version: 1,
							sha256Hash: '9ea2aac464a0101bac6fa1'.concat(
								'dd67758aea88f5052f7281952a16ea9658c252674b',
							),
						},
					},
				},
			},
		);

		if (response.status !== 200) {
			return {
				err: 'Response fails',
			};
		}

		const json = response.data as JsonRes;
		if (typeof json !== 'object' || !json.data.userById) {
			return {
				err: 'Response fails',
			};
		}

		return Util.convertAuthor(json.data.userById);
	} catch (err) {
		throw new Error((err as Error).message);
	}
}
