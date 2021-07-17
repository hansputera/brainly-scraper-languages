import Got from "got";
import { baseURLs, graphql_query, languages } from "./config";
import BrainlyError from "./error";
import type { Answer, BaseURLObject, BrainlyResponse, CountryList, LanguageList, Question } from "./types";
import RandomUserAgent from "random-useragent";
import Util from "./util";
import { version } from "../package.json";

export default class Brainly {
    public version = version;
    public clientRequest = (lang: LanguageList) => Got.extend({
        prefixUrl: `${this.getBaseURL(this.country)}/graphql`,
        headers: {
            "user-agent": this.getAgent() as string,
            "origin": this.getBaseURL(lang),
            "sec-gpc": "1",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "batch": "true"
        }
    });

    /**
     * 
     * @param country - Here, please put your application server country code. if you do not enter valid region/country code. It will trigger an Error Exception.
     */
    constructor(public country: CountryList = "id") {
        if (!this.isValidLanguage(country)) throw new BrainlyError("Please put valid country!");
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
            if (!this.isValidLanguage(language)) throw new BrainlyError("Please put valid language!");
            const body = this.getRequestBody(question, length);
            const response = await this.clientRequest(this.country.toLowerCase() as LanguageList).post(language.toLowerCase(), {
                json: body
            });
            const validJSON = JSON.parse(response.body)[0].data.questionSearch.edges as BrainlyResponse[];
            
            const objects = validJSON.map(obj => {
                const question: Question = Util.convertQuestion(obj.node);

                const answers: Answer[] = obj.node.answers.nodes.map(answerObj => Util.convertAnswer(answerObj));
                return {
                    question, answers
                }
            });

            return objects;
        } catch (err) {
            throw new BrainlyError(err);
        }
    }

    private getRequestBody(question: string, length = 10) {
        return [{
            operationName: "SearchQuery",
            query: graphql_query,
            variables: {
                len: length,
                query: question
            }
        }];
    }


    private isValidLanguage(lang: LanguageList) {
        return languages.includes(lang.toLowerCase());
    }
    /**
     * This function will return brainly site url from your country selection in the constructor
     * 
     * @returns {String} - A base url of your country selection
     */
    public getBaseURL(lang: LanguageList): string {
        return (baseURLs as BaseURLObject)[lang];
    }

    /**
     * Use this function if you want get random user agent.
     * 
     */
    public getAgent() {
        return RandomUserAgent.getRandom();
    }
}