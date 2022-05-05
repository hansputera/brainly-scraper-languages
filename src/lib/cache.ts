import os from 'os';
import fs from 'fs';

import type { Question, Answer, LanguageList } from './types';

/**
 * Cache Results Type.
 */
export type CacheResult = Record<
	LanguageList,
	Record<
		string,
		{
			/**
			 * You can access the question here.
			 */
			question: Question;
			/**
			 * You can access the answers here.
			 */
			answers: Answer[];
		}[]
	>
>;

/**
 * @class Cache
 */
export class Cache {
	private temporaryPath = os.tmpdir() + '/brainly-scraper2-cache.json';

	/**
	 * Cache constructor
	 */
	constructor() {
		// if "/tmp" folder doesn't exist, it will create a new file.
		if (!fs.existsSync(this.temporaryPath)) {
			fs.writeFileSync(this.temporaryPath, JSON.stringify({}));
		}
	}

	/**
	 * Remove caches data.
	 * @return {void}
	 */
	clearAll(): void {
		fs.writeFileSync(this.temporaryPath, JSON.stringify({}));
	}
	/**
	 * Get stored results in cache file.
	 * @param {LanguageList} l The language.
	 * @param {string} q The question.
	 * @return {{question: Question, answers: Answer[]}[] | undefined}
	 */
	get(
		l: LanguageList,
		q: string,
	): { question: Question; answers: Answer[] }[] | undefined {
		if (!this.has(l, q.toLowerCase())) {
			return undefined;
		}

		return this.json()[l][q.toLowerCase()];
	}

	/**
	 * Store the request results to Cache file.
	 * @param {LanguageList} l The language.
	 * @param {string} q The question.
	 * @param {{question: Question, answers: Answer[]}[]} res The result.
	 *
	 * @return {void}
	 */
	set(
		l: LanguageList,
		q: string,
		res: { question: Question; answers: Answer[] }[],
	): void {
		if (this.has(l, q.toLowerCase())) return;

		const d = this.json();
		d[l] = {
			...d[l],
			[q.toLowerCase()]: res,
		};

		fs.writeFileSync(this.temporaryPath, JSON.stringify(d));
	}

	/**
	 * The question is already exist on the cache file?
	 * @param {LanguageList} l The language.
	 * @param {string} q The question
	 *
	 * @return {boolean}
	 */
	has(l: LanguageList, q: string): boolean {
		const d = this.json();
		if (d[l] && d[l][q.toLowerCase()]) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Get collected question from a language code.
	 * @param {LanguageList} lang - A language code
	 *
	 * @return {Record<string, { question: Question, answers: Answer[]}[]>}
	 */
	getQuestionsByLang(lang: LanguageList): Record<
		string,
		{
			question: Question;
			answers: Answer[];
		}[]
	> {
		return this.json()[lang];
	}

	/**
	 * Return a cache data.
	 * @return {CacheResult}
	 */
	public json(): CacheResult {
		if (fs.existsSync(this.temporaryPath)) {
			try {
				const data = fs.readFileSync(this.temporaryPath, 'utf8');
				return JSON.parse(data);
			} catch {
				return {} as CacheResult;
			}
		} else return {} as CacheResult;
	}
}
