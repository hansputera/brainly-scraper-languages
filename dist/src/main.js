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
    country;
    clientRequest = (lang) => got_1.default.extend({
        prefixUrl: `${this.getBaseURL(lang)}/graphql`,
        headers: {
            "user-agent": this.getAgent()
        }
    });
    /**
     *
     * @param country - Here, please put your application server country code, if your server are in United States. Enter region/country code `us` to this parameter. Because what? All brainly website is protected, if you do not enter valid region/country code. It will trigger an Error Exception.
     */
    constructor(country = "id") {
        this.country = country;
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
                author: {
                    id: obj.node.author.databaseId,
                    avatar_url: obj.node.author.avatar ? obj.node.author.avatar.thumbnailUrl : undefined,
                    deleted: obj.node.author.isDeleted,
                    url: `${this.getBaseURL(language)}/app/profile/${obj.node.author.databaseId}`,
                    rank: obj.node.author.rank.name,
                    username: obj.node.author.nick
                },
                url: `${this.getBaseURL(language)}/${language.toLowerCase() == "id" ? "tugas" : "question"}/${obj.node.databaseId}`
            };
            const answers = obj.node.answers.nodes.map(answerObj => ({
                content: util_1.default.clearContent(answerObj.content),
                attachments: answerObj.attachments.map(attach => attach.url),
                rates: answerObj.ratesCount,
                rating: answerObj.rating
            }));
            return {
                question, answers
            };
        });
        return objects;
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
