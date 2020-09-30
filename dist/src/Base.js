"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;
const request_promise_1 = require("request-promise");
const Core_1 = require("./utils/Core");
const App_1 = require("./App");
const BrainlyError_1 = __importDefault(require("./utils/BrainlyError"));
const format_graphql = `query SearchQuery($query: String!, $first: Int!, $after: ID) {\n	questionSearch(query: $query, first: $first, after: $after) {\n	edges {\n	  node {\ncontent\n		attachments{\nurl\n}\n		answers {\n			nodes {\ncontent\n				attachments{\nurl\n}\n}\n}\n}\n}\n}\n}\n`;
const Brainly = async (query, count, lang) => {
    let language = "";
    Core_1._required(query);
    Core_1._required(count);
    if (lang)
        language = lang;
    else
        language = "id"; // default : id alias Indonesia
    if (!App_1.countryCode.includes(language.toLowerCase()))
        throw new BrainlyError_1.default("LANGUAGE_DOESNT_EXIST", language.toLowerCase());
    const service = {
        uri: 'https://brainly.com/graphql/' + language.toLowerCase(),
        json: true,
        headers: {
            'host': 'brainly.com',
            "content-type": "application/json; charset=utf-8",
            "user-agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:65.0) Gecko/20100101 Firefox/65.0"
        },
        body: {
            "operationName": "SearchQuery",
            "variables": {
                "query": query,
                "after": null,
                "first": count
            },
            "query": format_graphql
        }
    };
    return await request_promise_1.post(service).then(response => {
        let question_list = response.data.questionSearch.edges;
        if (question_list.length) {
            let final_data = [];
            question_list.forEach((question) => {
                let jawaban = [];
                let answers = question.node.answers.nodes;
                if (answers.length) {
                    answers.forEach((answer) => {
                        jawaban.push({
                            text: Core_1.clean(answer.content),
                            media: (answer.attachments.length) ? answer.attachments.map((file) => file.url) : []
                        });
                    });
                }
                final_data.push({
                    "pertanyaan": Core_1.clean(question.node.content),
                    "jawaban": jawaban,
                    "questionMedia": (question.node.attachments.length) ? question.node.attachments.map((file) => file.url) : [],
                });
            });
            return {
                'success': true,
                'length': final_data.length,
                'message': 'Request Success',
                'data': final_data
            };
        }
        else {
            return {
                'success': true,
                'length': 0,
                'message': 'Data not found',
                'data': []
            };
        }
    });
};
exports.default = Brainly;
