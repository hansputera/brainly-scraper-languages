import type {Question, Answer, LanguageList} from './types';

/**
 * @class Cache
 */
export class Cache {
  private raws: Map<{
        lang: LanguageList;
        q: string;
    }, {
        question: Question;
        answers: Answer[];
    }[]> = new Map();


  /**
     * @param {LanguageList} l
     * @param {string} q
     * @return {{question: Question, answers: Answer[]}[] | undefined}
     */
  get(l: LanguageList, q: string):
    { question: Question; answers: Answer[]; }[] | undefined {
    return this.raws.get({lang: l, q});
  }

  /**
     * @param {LanguageList} l
     * @param {string} q
     * @param {{question: Question, answers: Answer[]}[]} res
     *
     * @return {void}
     */
  set(l: LanguageList, q: string, res:
        { question: Question; answers: Answer[]; }[]): void {
    this.raws.set({lang: l, q}, res);
  }

  /**
   * Free the cache
   *
   * @return {void}
   */
  free(): void {
    this.raws.clear();
  }

  /**
     * @param {LanguageList} l
     * @param {string} q
     *
     * @return {boolean}
     */
  has(l: LanguageList, q: string): boolean {
    return this.raws.has({lang: l, q});
  }
}
