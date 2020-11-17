"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;
const axios_1 = __importDefault(require("axios"));
const random_useragent_1 = __importDefault(require("random-useragent"));
const Core_1 = require("./utils/Core");
const lists = {
    "id": "https://brainly.co.id",
    "us": "https://brainly.com",
    "es": "https://brainly.lat",
    "pt": "https://brainly.com.br",
    "ru": "https://znanija.com",
    "ro": "https://brainly.ro",
    "tr": "https://eodev.com",
    "ph": "https://brainly.ph",
    "pl": "https://brainly.pl",
    "hi": "https://brainly.in"
};
const countryCode = Object.keys(lists);
const BrainlyError_1 = __importDefault(require("./utils/BrainlyError"));
const format_graphql = `query SearchQuery($query: String!, $first: Int!, $after: ID) {\n	questionSearch(query: $query, first: $first, after: $after) {\n	edges {\n	  node {\ncontent\n		attachments{\nurl\n}\n		answers {\n			nodes {\ncontent\n				attachments{\nurl\n}\n}\n}\n}\n}\n}\n}\n`;
/**
 * @param {String} query Pertanyaan yang akan ditanyakan
 * @param {Integer} count Jumlah data yang akan ditampilkan
 * @param {Languages} lang Bahasa yang akan dipilih
 */
const Brainly = async (query, count, lang) => {
    let language = "";
    Core_1._required(query);
    Core_1._required(count);
    if (lang)
        language = lang;
    else
        language = "id";
    if (!countryCode.includes(language.toLowerCase()))
        throw new BrainlyError_1.default("LANGUAGE_DOESNT_EXIST", language.toLowerCase());
    const service = {
        method: "POST",
        url: `https://brainly.com/graphql/${language.toLowerCase()}`,
        headers: {
            'host': 'brainly.com',
            "content-type": "application/json; charset=utf-8",
            "user-agent": random_useragent_1.default.getRandom(o => o.browserName === "Chrome"),
            Cookie: "__cfduid=d09529a66d402ab3543218ec851b195391605619464; ocean_session=1605619467666.e3icoxub; _gcl_au=1.1.1168484837.1605619468; _ga=GA1.2.426419907.1605619471; _gid=GA1.2.155266724.1605619471; notice_behavior=implied,us; _hjid=20de5b6d-3500-4296-9225-7122fba9b118; _fbp=fb.1.1605619472894.1094241102; datadome=Ns8ZemF1Fm5rC_O979DbXVOY6n51DbHxGoLGIiE_jD3LL~J.5rBAgcBR0-WMlaaVpJuPXftePkozRCh57FHFdLyvaU6zqrk-5XWT1pvoqz; __qca=P0-781932269-1605619473513"
        },
        data: {
            "operationName": "SearchQuery",
            "variables": {
                "query": query,
                "after": null,
                "first": count
            },
            "query": format_graphql
        }
    };
    const response = await axios_1.default(service);
    let question_list = response.data.data.questionSearch.edges;
    if (question_list.length) {
        let final_data = [];
        question_list.forEach(question => {
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
            'headers': response.headers,
            'message': 'Request Success',
            'data': final_data
        };
    }
    else {
        return {
            'success': true,
            'length': 0,
            'headers': response.headers,
            'message': 'Data not found',
            'data': []
        };
    }
};
exports.default = Brainly;
