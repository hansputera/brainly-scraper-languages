"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.languages = exports.baseURLs = exports.graphql_query = void 0;
exports.graphql_query = "query SearchQuery($query: String!, $first: Int!, $after: ID) {\n  questionSearch(query: $query, first: $first, after: $after) {\n    count\n    edges {\n      node {\n        id\n        databaseId\n        author {\n          id\n          databaseId\n          isDeleted\n          nick\n          avatar {\n            thumbnailUrl\n            __typename\n          }\n          rank {\n            name\n            __typename\n          }\n          __typename\n        }\n        content\n        attachments{\nurl\n}\n        answers {\n          nodes {\n            thanksCount\n            ratesCount\n            rating\n            attachments{\nurl\n}\ncontent\n            __typename\n          }\n          hasVerified\n          __typename\n        }\n        __typename\n      }\n      highlight {\n        contentFragments\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n";
exports.baseURLs = {
    id: "https://brainly.co.id",
    us: "https://brainly.com",
    es: "https://brainly.lat",
    pt: "https://brainly.com.br",
    ru: "https://znanija.com",
    ro: "https://brainly.ro",
    tr: "https://eodev.com",
    ph: "https://brainly.ph",
    pl: "https://brainly.pl",
    hi: "https://brainly.in"
};
exports.languages = Object.keys(exports.baseURLs);
