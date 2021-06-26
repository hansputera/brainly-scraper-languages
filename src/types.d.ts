export type LanguageList = "id" | "us" | "es" | "ru" | "ro" | "pt" | "tr" | "ph" | "pl" | "hi"; 
export type BaseURLObject = Record<LanguageList, string>;
export type Attachments = string[];

export interface Question {
    id: number;
    content: string;
    author: Author;
    attachments: Attachments;
    url: string;
}

export interface Author {
    id: number;
    url: string;
    username: string;
    avatar_url?: string;
    deleted: boolean;
    rank: string;
}

export interface Answer {
    content: string;
    attachments: Attachments;
    rates: number;
    rating: number;
}

export interface BrainlyResponse {
    highlight: {
        contentFragments: string[];
    }
    node: {
        id: string;
        databaseId: number;
        content: string;
        author: {
            avatar: {
                thumbnailUrl: string;
            } | null;
            databaseId: number;
            id: string;
            isDeleted: boolean;
            nick: string;
            rank: {
                name: string;
            }
        }
        answers: {
            hasVerified: boolean;
            nodes: {
                ratesCount: number;
                rating: number;
                thanksCount: number;
                content: string;
                attachments: { url: string; }[];
            }[];
        }
        attachments: { url: string; }[];
    }
}