export type LanguageList = "id" | "us" | "es" | "ru" | "ro" | "pt" | "tr" | "ph" | "pl" | "hi"; 
export type BaseURLObject = Record<LanguageList, string>;
export type Attachments = string[];

export interface Question {
    id: number;
    content: string;
    author?: Author;
    attachments: Attachments;
    url: string;
    created: string;
    points: {
        points: number;
        forBest: number;
    }
}

export interface Author {
    id: number;
    url: string;
    username: string;
    avatar_url?: string;
    deleted: boolean;
    rank: string;
    description: string;
    gender: string;
    points: number;
    receivedThanks: number;
    bestAnswersCount: number;
    helpedUsersCount: number;
}

export interface Answer {
    content: string;
    attachments: Attachments;
    rates: number;
    rating: number;
    author?: Author;
    isBest: boolean;
    created: string;
}

export interface BrainlyResponse {
    highlight: {
        contentFragments: string[];
    }
    node: {
        id: string;
        created: string;
        databaseId: number;
        content: string;
        points: number;
        pointsForBest: number;
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
            };
            description: string;
            points: number;
            receivedThanks: number;
            bestAnswersCount: number;
            helpedUsersCount: number;
            gender: string;
        }
        answers: {
            hasVerified: boolean;
            nodes: {
                ratesCount: number;
                rating: number;
                thanksCount: number;
                content: string;
                attachments: { url: string; }[];
                author: BrainlyResponse["node"]["author"];
                isBest: boolean;
                points: number;
                created: string;
            }[];
        }
        attachments: { url: string; }[];
    }
}