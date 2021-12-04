import { baseURLs, graphql_query, languages } from "./config";
import { Answer, BaseURLObject, CountryList, JsonRes, LanguageList, Question } from "./types";
import Util from "./util";
import { version } from "../../package.json";
import { FetcherClient, CheckLatestVersion } from "./fetcher";

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
     * 
     * @param country - Here, please put your application server country code. if you do not enter valid region/country code. It will trigger an Error Exception.
     */
    constructor(public country: CountryList = "id") {
        if (!this.isValidLanguage(country)) throw new TypeError("Please put valid country!");
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
            const response = await this.client(this.country).post(`graphql/${language.toLowerCase()}`, body);
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
     * @returns {String} country - A base url of your country selection
     */
    public getBaseURL(country: CountryList): string {
        return (baseURLs as BaseURLObject)[country];
    }

    public checkVersion = CheckLatestVersion;

    /**
     * Find passed brainly site.
     * @param {boolean} debug
     * @return {Promise<string[]}
     */
    public async findPassedCountries(debug: boolean = false): Promise<string[]> {
        for (const lang of languages) {
            try {
                const response = await this.client(lang as CountryList)
                    .post('graphql/id', this.getRequestParams('pythagoras', 10));

                if (typeof response.data !== 'object') {
                    throw new Error('Response isn\'t an object');
                } else {
                    if (debug) console.log(lang, 'passed');
                    this.passedCountries.push(lang);
                }
            } catch (e) {
                if (debug) console.log(lang, (e as Error).message);
                if (this.passedCountries.includes(lang)) {
                    this.passedCountries = this.passedCountries
                        .filter((l) => lang !== l);
                }
            }
        }

        return this.passedCountries;
    }

    private client(country: CountryList) {
        return FetcherClient(this.getBaseURL(country), {
            headers: {
                "User-Agent": Util.getRandomUA(),
                "Origin": this.getBaseURL(country),
                "Referer": this.getBaseURL(country),
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "TE": "trailers",
            }
        });
    }
}