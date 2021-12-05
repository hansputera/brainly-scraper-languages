import Piscina from 'piscina';
import Path from 'path';
import type {AxiosRequestConfig, AxiosInstance} from 'axios';
import {baseURLs, graphqlQuery, languages} from './config';
import {
  Answer, BaseURLObject,
  CountryList, LanguageList,
  Question,
} from './types';
import {fetcherClient} from './fetcher';

import Util from './util';
import {Cache} from './cache';
import {version} from '../../package.json';

/**
 * @class Brainly
 */
export class Brainly {
  /**
     * Package version
     */
  public version = version;
  /**
     * Passed countries
     */
  public passedCountries: string[] = [];

  /**
     * Brainly worker (w/ Piscina)
     */
  private worker = new Piscina({
    'filename': Path.resolve(__dirname, 'worker.js'),
    'maxThreads': 30,
  });

  /**
     * Brainly cache
     */
  public cache = new Cache();

  /**
     *
     * @param {LanguageList?} country - Here, please put your application server country code. if you do not enter valid region/country code. It will trigger an Error Exception.
     */
  constructor(public country: CountryList = 'id') {
    if (!Brainly.isValidLanguage(country)) {
      throw new TypeError('Please put valid country!');
    }
  }

  /**
     * Use this function if you want search question, it will returns question detail, question author, answer detail, attachments (if question or answer attachments is any), rating question and answer.
     *
     * @description This method based on constructor country code.
     * @param {LanguageList} language What language want to search?
     * @param {string} question A question you want to search. Example: `Pythagoras theory`
     * @param {number} length Length array from question list
     * @param {AxiosRequestConfig?} options Custom Axios request options
     *
     * @return {Promise<{question: Question, answers: Answer[]}[]>}
     */
  public async search(
      language: LanguageList = 'id',
      question: string,
      length: number = 10,
      options?: AxiosRequestConfig):
        Promise<{ question: Question; answers: Answer[]; }[]> {
    try {
      if (this.cache.has(language, question.toLowerCase())) {
        return this.cache.get(language, question.toLowerCase()) as {
            question: Question;
            answers: Answer[];
        }[];
      }
      const result = await this.worker.run({
        'c': this.country.toLowerCase(),
        'question': question,
        'length': length,
        'options': options,
        'language': language,
      }, {
        'name': 'search',
      });

      if (result.err) {
        throw new Error(result.err as string);
      } else {
        this.cache.set(language, question, result);
        return result as {
                    question: Question;
                    answers: Answer[];
                }[];
      }
    } catch (err) {
      throw new Error(err as string);
    }
  }

  /**
     * @param {string} question
     * @param {number} length
     *
     * @return {{operationName: string, query: string, variables: { len: number, query: string }}[]}
     */
  static getRequestParams(question: string, length: number = 10):
    { operationName: string;
        query: string; variables:
            { len: number; query: string; }; }[] {
    return [{
      operationName: 'SearchQuery',
      query: graphqlQuery,
      variables: {
        len: length,
        query: question,
      },
    }];
  }


  /**
     * @param {LanguageList} lang
     * @return {boolean}
     */
  static isValidLanguage(lang: LanguageList): boolean {
    return languages.includes(lang.toLowerCase()) && typeof lang === 'string';
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
     * Use this function if you want search question, it will returns question detail, question author, answer detail, attachments (if question or answer attachments is any), rating question and answer.
     *
     * @param {LanguageList} language What language want to search?
     * @param {string} question A question you want to search. Example: `Pythagoras theory`
     * @param {number} length Length array from question list
     * @param {AxiosRequestConfig?} options Custom Axios request options
     *
     * @return {Promise<{question: Question, answers: Answer[]}[]>}
     */
  public async searchWithMT(
      language: LanguageList = 'id',
      question: string,
      length: number = 10,
      options?: AxiosRequestConfig):
        Promise<{ question: Question; answers: Answer[]; }[]> {
    if (this.cache.has(language, question.toLowerCase())) {
      return this.cache.get(language, question.toLowerCase()) as {
                    question: Question;
                    answers: Answer[];
                }[];
    }
    return await new Promise((resolve) => {
      let shouldReturn = true;
      languages.every((l) => {
        this.worker.run({
          'c': l,
          'language': language,
          'question': question,
          'length': length,
          'options': options,
        }, {'name': 'search'}).then((d) => {
          if (!d.err) {
            shouldReturn = false;
            this.cache.set(language, question.toLowerCase(), d);
            resolve(d);
          }
        });

        return shouldReturn;
      });
    });
  }

  /**
   * @param {CountryList} country
   * @return {AxiosInstance}
   */
  static client(country: CountryList): AxiosInstance {
    return fetcherClient(Brainly.getBaseURL(country), {
      headers: {
        'User-Agent': Util.getRandomUA(),
        'Origin': Brainly.getBaseURL(country),
        'Referer': Brainly.getBaseURL(country),
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'TE': 'trailers',
      },
    });
  }
}
