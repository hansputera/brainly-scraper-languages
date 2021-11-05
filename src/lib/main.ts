import { baseURLs, graphql_query, languages } from "./config";
import { Answer, BaseURLObject, CountryList, JsonRes, LanguageList, Question } from "./types";
import Util from "./util";
import { version } from "../../package.json";
import { FetcherClient } from "./fetcher";
import { Rotator } from "./rotator";

export class Brainly {
    public version = version;
    /**
     * Brainly rotator
     */
    public rotator = new Rotator(this);

    /**
     * 
     * @param country - Here, please put your application server country code. if you do not enter valid region/country code. It will trigger an Error Exception.
     */
    constructor(private rotateCountry = false, public country: CountryList = "id") {
        if (!this.isValidLanguage(country)) throw new TypeError("Please put valid country!");
        else if (!rotateCountry && !country) throw new TypeError('If rotate country is disabled, you must set country manually!');
    }

    /**
     * Use this function if you want search question, it will returns question detail, question author, answer detail, attachments (if question or answer attachments is any), rating question and answer.
     * 
     * @param language What language want to search?
     * @param question A question you want to search. Example: `Pythagoras theory`
     * @param length Length array from question list
     */
    public async search(language: LanguageList = "id", question: string, length = 10) {
        try {
            if (!this.isValidLanguage(language)) throw new TypeError("Please put valid language!");
            const body = this.getRequestParams(question, length);
            const response = await this.client(language.toLowerCase() as LanguageList).post(`graphql/${language.toLowerCase()}`, body);
            const json = response.data as JsonRes;
            const validJSON = json[0].data.questionSearch.edges;
            
            const objects = validJSON.map(obj => {
                const question: Question = Util.convertQuestion(obj.node);

                const answers: Answer[] = obj.node.answers.nodes.map(answerObj => Util.convertAnswer(answerObj));
                return {
                    question, answers
                }
            });

            return objects;
        } catch (err) {
            throw new TypeError(err as string);
        }
    }

    private getRequestParams(question: string, length = 10) {
        return [{
            operationName: 'SearchQuery',
            query: graphql_query,
            variables: {
                len: length,
                query: question,
            }
        }];
    }


    private isValidLanguage(lang: LanguageList) {
        return languages.includes(lang.toLowerCase()) && typeof lang === "string";
    }
    /**
     * This function will return brainly site url from your country selection in the constructor
     * 
     * @returns {String} - A base url of your country selection
     */
    public getBaseURL(lang: LanguageList): string {
        return (baseURLs as BaseURLObject)[lang];
    }

    private client(lang: LanguageList) {
        return FetcherClient(this.getBaseURL(lang), {
            headers: {
                "User-Agent": Util.getRandomUA(),
                "Origin": this.getBaseURL(lang),
                "Referer": this.getBaseURL(lang),
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "TE": "trailers",
                "X-B-Token-Long": "GMtRm8OLO64dtNudpVNa03Vs2yhe_vQ3j1jsqx_TFdY="
            }
        });
    }
}