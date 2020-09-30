import { post } from "request-promise";
import { clean, _required } from "./utils/Core";
import { countryCode } from "./App";
import BrainlyError from "./utils/BrainlyError";

const format_graphql = `query SearchQuery($query: String!, $first: Int!, $after: ID) {\n	questionSearch(query: $query, first: $first, after: $after) {\n	edges {\n	  node {\ncontent\n		attachments{\nurl\n}\n		answers {\n			nodes {\ncontent\n				attachments{\nurl\n}\n}\n}\n}\n}\n}\n}\n`;
const Brainly = async (query: string, count: number, lang?: string) => {
    let language = "";
    _required(query);
    _required(count);
    if (lang) language = lang;
    else language = "id"; // default : id alias Indonesia

    if (!countryCode.includes(language.toLowerCase())) throw new BrainlyError("LANGUAGE_DOESNT_EXIST", language.toLowerCase());
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
    return await post(service).then(response => {
        let question_list = response.data.questionSearch.edges;
        if (question_list.length) {
            let final_data: { pertanyaan: string; jawaban: any[]; questionMedia: any; }[] = [];
            question_list.forEach((question: { node: { answers: { nodes: any; }; content: string; attachments: { url: string; }[]; }; }) => {
                let jawaban: any[] = [];
                let answers = question.node.answers.nodes;
                if (answers.length) {
                    answers.forEach((answer: { content: string; attachments: { url: string; }[]; }) => {
                        jawaban.push({
                            text: clean(answer.content),
                            media: (answer.attachments.length) ? answer.attachments.map((file: { url: string }) => file.url) : []
                        });
                    });
                }

                final_data.push({
                    "pertanyaan": clean(question.node.content),
					"jawaban": jawaban,
					"questionMedia": (question.node.attachments.length) ? question.node.attachments.map((file: { url: string }) => file.url) : [],
                });
            });

            return {
                    'success': true,
                    'length': final_data.length,
                    'message': 'Request Success',
                    'data': final_data
            };
        } else {
            return {
				'success': true,
				'length': 0,
				'message': 'Data not found',
				'data': []
			};
        }
    });
};

export { Brainly as default }