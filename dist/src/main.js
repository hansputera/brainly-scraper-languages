"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const got_1 = __importDefault(require("got"));
const config_1 = require("./config");
const error_1 = __importDefault(require("./error"));
const random_useragent_1 = __importDefault(require("random-useragent"));
const util_1 = __importDefault(require("./util"));
class Brainly {
    /**
     *
     * @param country - Here, please put your application server country code. if you do not enter valid region/country code. It will trigger an Error Exception.
     */
    constructor(country = "id") {
        this.country = country;
        this.clientRequest = (lang) => got_1.default.extend({
            prefixUrl: `${this.getBaseURL(this.country)}/graphql`,
            headers: {
                "user-agent": this.getAgent(),
                "origin": this.getBaseURL(lang),
                "sec-gpc": "1",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "batch": "true"
            }
        });
        if (!this.isValidLanguage(country))
            throw new error_1.default("Please put valid country!");
    }
    /**
     * Use this function if you want search question, it will returns question detail, question author, answer detail, attachments (if question or answer attachments is any), rating question and answer.
     *
     * @param language What language want to search?
     * @param question A question you want to search. Example: `Pythagoras theory`
     * @param length Length array from question list
     */
    async search(language = "id", question, length = 10) {
        try {
            if (!this.isValidLanguage(language))
                throw new error_1.default("Please put valid language!");
            const body = this.getRequestBody(question, length);
            const response = await this.clientRequest(this.country.toLowerCase()).post(language.toLowerCase(), {
                json: body
            });
            const validJSON = JSON.parse(response.body)[0].data.questionSearch.edges;
            const objects = validJSON.map(obj => {
                const question = {
                    id: obj.node.databaseId,
                    content: util_1.default.clearContent(obj.node.content),
                    attachments: obj.node.attachments.map(attach => attach.url),
                    author: obj.node.author ? {
                        id: obj.node.author.databaseId,
                        avatar_url: obj.node.author.avatar ? obj.node.author.avatar.url : undefined,
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
                    url: `${this.getBaseURL(language)}/${util_1.default.resolveWorkName(language.toLowerCase())}/${obj.node.databaseId}`
                };
                const answers = obj.node.answers.nodes.map(answerObj => ({
                    content: util_1.default.clearContent(answerObj.content),
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
                        url: `${this.getBaseURL(language.toLowerCase())}/app/profile/${answerObj.author.databaseId}`,
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
                };
            });
            return objects;
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }
    getRequestBody(question, length = 10) {
        return [{
                operationName: "SearchQuery",
                query: config_1.graphql_query,
                variables: {
                    after: null,
                    first: length,
                    query: question
                }
            }];
    }
    isValidLanguage(lang) {
        return config_1.languages.includes(lang.toLowerCase());
    }
    /**
     * This function will return brainly site url from your country selection in the constructor
     *
     * @returns {String} - A base url of your country selection
     */
    getBaseURL(lang) {
        return config_1.baseURLs[lang];
    }
    /**
     * Use this function if you want get random user agent.
     *
     */
    getAgent() {
        return random_useragent_1.default.getRandom();
    }
}
exports.default = Brainly;
