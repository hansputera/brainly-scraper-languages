import Got from "got";
import { baseURLs, graphql_query, languages } from "./config";
import BrainlyError from "./error";
import type { Answer, BaseURLObject, BrainlyResponse, LanguageList, Question } from "./types";
import RandomUserAgent from "random-useragent";
import Util from "./util";

export default class Brainly {
    public clientRequest = (lang: LanguageList) => Got.extend({
        prefixUrl: `${this.getBaseURL(lang)}/graphql`,
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
     * @param country - Here, please put your application server country code, if your server are in United States. Enter region/country code `us` to this parameter. Because what? All brainly website is protected, if you do not enter valid region/country code. It will trigger an Error Exception.
     */
    constructor(public country: LanguageList = "id") {
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
        if (!this.isValidLanguage(language)) throw new BrainlyError("Please put valid language!");
        const body = this.getRequestBody(question, length);
        const response = await this.clientRequest(this.country.toLowerCase() as LanguageList).post(language.toLowerCase(), {
            json: body
        });
        const validJSON = JSON.parse(response.body)[0].data.questionSearch.edges as BrainlyResponse[];
        const objects = validJSON.map(obj => {
            const question: Question = {
                id: obj.node.databaseId,
                content: Util.clearContent(obj.node.content),
                attachments: obj.node.attachments.map(attach => attach.url),
                author: obj.node.author ? {
                    id: obj.node.author.databaseId,
                    avatar_url: obj.node.author.avatar ? obj.node.author.avatar!.url : undefined,
                    deleted: obj.node.author.isDeleted,
                    url: `${this.getBaseURL(language)}/app/profile/${obj.node.author.databaseId}`,
                    rank: obj.node.author.rank ? obj.node.author.rank.name : "-",
                    username: obj.node.author.nick,
                    receivedThanks: obj.node.author.receivedThanks,
                    bestAnswersCount: obj.node.author.bestAnswersCount,
                    gender: obj.node.author.gender,
                    description: obj.node.author.description,
                    points: obj.node.author.points,
                    helpedUsersCount: obj.node.author.helpedUsersCount
                } : undefined,
                points: {
                    points: obj.node.points,
                    forBest: obj.node.pointsForBestAnswer
                },
                grade: obj.node.grade.name,
                education: obj.node.subject.name,
                created: obj.node.created,
                can_be_answered: obj.node.canBeAnswered,
                url: `${this.getBaseURL(language)}/${Util.resolveWorkName(language.toLowerCase() as LanguageList)}/${obj.node.databaseId}`
            };

            const answers: Answer[] = obj.node.answers.nodes.map(answerObj => ({
              content: Util.clearContent(answerObj.content),
              attachments: answerObj.attachments.map(attach => attach.url),
              rates: answerObj.ratesCount,
              rating: answerObj.rating,
              isBest: answerObj.isBest,
              created: answerObj.created,
              author: answerObj.author ? {
                  id: answerObj.author.databaseId,
                  username: answerObj.author.nick,
                  gender: answerObj.author.gender,
                  avatar_url: answerObj.author.avatar ? answerObj.author.avatar.url : undefined,
                  deleted: answerObj.author.isDeleted,
                  url: `${this.getBaseURL(language.toLowerCase() as LanguageList)}/app/profile/${answerObj.author.databaseId}`,
                  description: answerObj.author.description,
                  bestAnswersCount: answerObj.author.bestAnswersCount,
                  points: answerObj.author.points,
                  helpedUsersCount: answerObj.author.helpedUsersCount,
                  receivedThanks: answerObj.author.receivedThanks,
                  rank: answerObj.author.rank ? answerObj.author.rank.name : "-"
              } : undefined
            }));

            return {
                question, answers
            }
        });

        return objects;
    }

    private getRequestBody(question: string, length = 10) {
        return [{
            operationName: "SearchQuery",
            query: graphql_query,
            variables: {
                after: null,
                first: length,
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