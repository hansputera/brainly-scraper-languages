import Piscina from 'piscina';
import Path from 'path';
import type { AxiosRequestConfig, AxiosInstance } from 'axios';
import { baseURLs, getGraphqlQuery, languages } from './config';
import {
	Answer,
	Author,
	BaseURLObject,
	CountryList,
	LanguageList,
	Question,
} from './types';
import { fetcherClient } from './fetcher';
import { Cache } from './cache';

/**
 * @class Brainly
 */
export class Brainly {
	/**
	 * Brainly worker pool (using npmjs.com/piscina)
	 */
	private worker = new Piscina({
		filename: Path.resolve(__dirname, 'worker.js'),
	});

	/**
	 * Brainly cache manager instance.
	 *
	 * The caches saved on /tmp folder.
	 * Don't worry, the caches will removed every machine reboot.
	 *
	 */
	public cache!: Cache;

	/**
	 *
	 * @param {LanguageList?} country - Here, please put your application server country code. if you do not enter valid region/country code. It will trigger an Error Exception.
	 * @param {boolean?} enabledCache - Brainly Cache condition, you can disable/enable it.
	 */
	constructor(
		public country: CountryList = 'id',
		private enabledCache: boolean = true,
	) {
		if (!Brainly.isValidLanguage(country)) {
			throw new TypeError('Please put valid country!');
		}

		// create cache instance, if 'enabledCache' is true.
		if (enabledCache) {
			this.cache = new Cache();
		}
	}

	/**
	 * Use this function if you want search question, it will returns question detail, question author, answer detail, attachments (if question or answer attachments is any), rating question and answer.
	 *
	 * @description This method based on constructor country code.
	 * @param {string} question A question you want to search. Example: `Pythagoras theory`
	 * @param {LanguageList?} language What language want to search?
	 * @param {number} length Length array from question list
	 * @param {AxiosRequestConfig?} options Custom Axios request options
	 *
	 * Example:
	 * ```ts
	 *  brain.search('Pythagoras', 'id', 10).then(console.log);
	 * ```
	 * @return {Promise<{question: Question, answers: Answer[]}[]>}
	 */
	public async search(
		question: string,
		language: LanguageList = 'id',
		length: number = 10,
		options?: AxiosRequestConfig,
	): Promise<{ question: Question; answers: Answer[] }[]> {
		try {
			if (
				this.enabledCache &&
				this.cache.has(language, question.toLowerCase())
			) {
				return this.cache.get(language, question.toLowerCase()) as {
					question: Question;
					answers: Answer[];
				}[];
			}
			const result = await this.worker.run(
				{
					c: this.country.toLowerCase(),
					question: question,
					length: length,
					options: options,
					language: language,
				},
				{
					name: 'search',
				},
			);

			if (this.enabledCache) this.cache.set(language, question, result);
			return result as {
				question: Question;
				answers: Answer[];
			}[];
		} catch (err) {
			throw new Error(err as string);
		}
	}

	/**
	 * Get body request to sent.
	 * @param {string} query Operation query name
	 * @param {Record<string, unknown>} vars Variables want to sent
	 *
	 * @return {{operationName: string, query: string, variables: { len: number, query: string }}[]}
	 */
	static getRequestParams(
		query: string,
		vars: Record<string, unknown>,
	): {
		operationName: string;
		query: string;
		variables: Record<string, unknown>;
	}[] {
		return [
			{
				operationName: query,
				query: getGraphqlQuery(),
				variables: vars,
			},
		];
	}

	/**
	 * Validate language code based available languages.
	 * @param {LanguageList} lang - A Language want to validate.
	 * @return {boolean}
	 */
	static isValidLanguage(lang: LanguageList): boolean {
		return (
			languages.includes(lang.toLowerCase()) && typeof lang === 'string'
		);
	}

	/**
	 * This function will return brainly site url from your country selection in the constructor
	 *
	 * @param {CountryList} country - A base url of your country selection
	 * @return {string}
	 */
	static getBaseURL(country: CountryList): string {
		return (baseURLs as BaseURLObject)[country];
	}

	/**
	 * Find a Brainly User's Information.
	 * @param {CountryList} country The user's country (you must fill it correctly)
	 * @param {number | string} userId User's id (you can use Author.id or Author._id to fill it)
	 * @return {Promise<Author | undefined>}
	 */
	public async findUserById(
		country: CountryList,
		userId: number | string,
	): Promise<Author | undefined> {
		return await new Promise(async (resolve) => {
			const result = await Promise.any(
				languages.map((country2) =>
					this.worker.run(
						{
							country: country2,
							language: country.toLowerCase(),
							userId: userId,
						},
						{
							name: 'findUser',
						},
					),
				),
			);

			resolve(result);
		});
	}

	/**
	 * Use this function if you want search question, it will returns question detail, question author, answer detail, attachments (if question or answer attachments is any), rating question and answer.
	 *
	 * @description - You can use this method if you won't receive 403 forbidden.
	 * @param {string} question A question you want to search. Example: `Pythagoras theory`
	 * @param {LanguageList?} language What language want to search?
	 * @param {number} length Length array from question list
	 * @param {AxiosRequestConfig?} options Custom Axios request options
	 *
	 * Example:
	 * ```ts
	 *  brain.searchWithMT('Pythagoras', 'id', 10).then(console.log);
	 * ```
	 * @return {Promise<{question: Question, answers: Answer[]}[]>}
	 */
	public async searchWithMT(
		question: string,
		language: LanguageList = 'id',
		length: number = 10,
		options?: AxiosRequestConfig,
	): Promise<{ question: Question; answers: Answer[] }[]> {
		if (
			this.enabledCache &&
			this.cache.has(language, question.toLowerCase())
		) {
			return this.cache.get(language, question.toLowerCase()) as {
				question: Question;
				answers: Answer[];
			}[];
		}
		return await new Promise(async (resolve) => {
			const result = await Promise.any(
				languages.map((country) =>
					this.worker.run(
						{
							c: country,
							language,
							question,
							length,
							options,
						},
						{ name: 'search' },
					),
				),
			);
			if (this.enabledCache) this.cache.set(language, question, result);
			resolve(result);
		});
	}

	/**
	 * Create axios instance.
	 * @param {CountryList} country - Country code.
	 * @return {AxiosInstance}
	 */
	static client(country: CountryList): AxiosInstance {
		return fetcherClient(Brainly.getBaseURL(country), {
			headers: {
				// 'User-Agent': Util.getRandomUA(),
				Origin: Brainly.getBaseURL(country),
				Referer: Brainly.getBaseURL(country),
				'Sec-Fetch-Dest': 'empty',
				'Sec-Fetch-Mode': 'cors',
				'Sec-Fetch-Site': 'same-origin',
				TE: 'trailers',
				'User-Agent':
					'Mozilla/5.0 (X11; Linux x86_64; rv:98.0)' +
					'Gecko/20100101 Firefox/98.0',
			},
		});
	}
}
