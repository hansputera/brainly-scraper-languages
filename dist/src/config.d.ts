export declare const graphql_query = "query SearchQuery($query: String!, $first: Int!, $after: ID) {\n  questionSearch(query: $query, first: $first, after: $after) {\n    count\n    edges {\n      node {\n        id\n        databaseId\n        author {\n          id\n          databaseId\n          isDeleted\n          nick\n          avatar {\n            thumbnailUrl\n            __typename\n          }\n          rank {\n            name\n            __typename\n          }\n          __typename\n        }\n        content\n        attachments{\nurl\n}\n        answers {\n          nodes {\n            thanksCount\n            ratesCount\n            rating\n            attachments{\nurl\n}\ncontent\n            __typename\n          }\n          hasVerified\n          __typename\n        }\n        __typename\n      }\n      highlight {\n        contentFragments\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n";
export declare const baseURLs: {
    id: string;
    us: string;
    es: string;
    pt: string;
    ru: string;
    ro: string;
    tr: string;
    ph: string;
    pl: string;
    hi: string;
};
export declare const languages: string[];
