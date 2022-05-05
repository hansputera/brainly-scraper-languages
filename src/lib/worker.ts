import type { AxiosRequestConfig } from 'axios';
import Piscina from 'piscina';
import {
	CountryList,
	LanguageList,
	Brainly,
	JsonRes,
	Answer,
	Question,
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
		const json = response.data as JsonRes;
		const validJSON = json[0].data.questionSearch.edges;

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
