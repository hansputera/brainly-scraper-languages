import type { Answer, CountryList, LanguageList, Question } from "./types";
export default class Brainly {
    country: CountryList;
    clientRequest: (lang: LanguageList) => import("got").Got;
    /**
     *
     * @param country - Here, please put your application server country code. if you do not enter valid region/country code. It will trigger an Error Exception.
     */
    constructor(country?: CountryList);
    /**
     * Use this function if you want search question, it will returns question detail, question author, answer detail, attachments (if question or answer attachments is any), rating question and answer.
     *
     * @param language What language want to search?
     * @param question A question you want to search. Example: `Pythagoras theory`
     * @param length Length array from question list
     */
    search(language: LanguageList | undefined, question: string, length?: number): Promise<{
        question: Question;
        answers: Answer[];
    }[]>;
    private getRequestBody;
    private isValidLanguage;
    /**
     * This function will return brainly site url from your country selection in the constructor
     *
     * @returns {String} - A base url of your country selection
     */
    getBaseURL(lang: LanguageList): string;
    /**
     * Use this function if you want get random user agent.
     *
     */
    getAgent(): string | null;
}
