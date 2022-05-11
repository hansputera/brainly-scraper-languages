/**
 * Work names.
 */
export type WorkType =
	| 'tugas'
	| 'question'
	| 'zadanie'
	| 'tarefa'
	| 'tarea'
	| 'gorev'
	| 'tema'
	| 'task';
/**
 * Country List.
 */
export type CountryList =
	| 'id'
	| 'us'
	| 'es'
	| 'ru'
	| 'ro'
	| 'pt'
	| 'tr'
	| 'ph'
	| 'pl'
	| 'hi';
/**
 * The languages with their base url.
 */
export type BaseURLObject = Record<LanguageList, string>;
/**
 * The question/answer attachments.
 * Alias 'Array<String>'
 */
export type Attachments = string[];

/**
 * Raw JSON Response from Brainly.
 */
export type JsonRes = {
	data: {
		questionSearch: {
			edges: BrainlyResponse[];
		};
	};
}[];

/**
 * The question.
 */
export interface Question {
	/**
	 * Question ID
	 */
	id: number;
	/**
	 * The question contents.
	 */
	content: string;
	closed: boolean;
	/**
	 * Question created time.
	 */
	created: CreatedInterface;
	/**
	 * The question attachments, it could be an empty array!
	 */
	attachments: Attachments;
	/**
	 * The questioner, it could be undefined.
	 */
	author?: Author;
	/**
	 * Question's lesson category.
	 */
	education: string;
	education_level?: number;
	/**
	 * Can we answer the question?
	 */
	canBeAnswered: boolean;
	/**
	 * If we answer the question, how many points will we receive?
	 */
	points_answer: {
		forBest: number;
		normal: number;
	};
	/**
	 * Points issued by the questioner.
	 */
	points_question: number;
	/**
	 * The question's grade level
	 */
	grade: string;
	/**
	 * Last activity.
	 */
	lastActivity?: string;
	/**
	 * This question is have verified answer?
	 */
	verifiedAnswer: boolean;

	/**
	 * Database ID
	 */
	_id: string;
}

/**
 * Answer
 */
export interface Answer {
	/**
	 * The answer contents.
	 */
	content: string;
	/**
	 * The answerer, it could be undefined.
	 */
	author?: Author;
	/**
	 * Is this best answer?
	 */
	isBest: boolean;
	/**
	 * How many points are awarded to the answerer?
	 */
	points: number;
	confirmed: boolean;
	score: number;
	/**
	 * The answer's rates count.
	 */
	ratesCount: number;
	/**
	 * The answer's thanks count.
	 */
	thanksCount: number;
	/**
	 * Question attachments, it could be an empty array!
	 */
	attachments: Attachments;
	/**
	 * When the answer is created?
	 */
	created: CreatedInterface;
	/**
	 * Can we comment to this answer?
	 */
	canComment: boolean;
	verification?: OriginalVerification;
	/**
	 * The comments.
	 */
	comments: Comment[];
	/**
	 * Database ID
	 */
	_id: string;
}

export interface Comment {
	/**
	 * Comment ID (comment identifier)
	 */
	id: number;
	/**
	 * The comment's author.
	 */
	author?: OriginalComment['author'];
	/**
	 * The comment contents.
	 */
	content: string;
	/**
	 * Comment is already deleted?
	 */
	deleted?: boolean;
}

export interface OriginalComment {
	databaseId: number;
	deleted?: boolean;
	content: string;
	author: {
		databaseId: number;
		nick: string;
		avatar: {
			url: string;
			thumbnailUrl: string;
		};
		friends: { count: number };
		receivedThanks: number;
		points: number;
		created: string;
		description: string;
	};
}

export type OriginalAttachments = {
	url: string;
}[];

export interface OriginalAuthor {
	id: string;
	databaseId: number;
	nick: string;
	avatar: {
		url: string;
		thumbnailUrl: string;
	};
	description: string;
	helpedUsersCount: number;
	gender: string;
	created: string;
	specialRanks: {
		name: string;
	}[];
	bestAnswersCount: number;
	answererLevel: string;
	receivedThanks: number;
	points: number;
	rank: { name: string };
	friends: { count: number };
	answeringStreak?: {
		pointsForToday: number;
		pointForTommorow: number;
		progressIncreasedToday: boolean;
		progress: number;
		canLotteryPointsBeClaimed: boolean;
	};
	bestAnswersCountInLast30Days: number;
	questions: {
		count: number;
		edges: {
			node: {
				content: string;
				grade: { name: string };
				subject: { slug: string };
				points: number;
				pointsForBestAnswer: number;
				pointsForAnswer: number;
				isClosed: boolean;
				canBeAnswered: boolean;
				created: string;
				attachments: OriginalAttachments;
				eduLevel?: number;
			};
		}[];
	};
}

export interface OriginalVerification {
	approval: {
		approver: {
			nick: string;
			databaseId: number;
		};
	};
}

export interface OriginalQuestion {
	id: string;
	databaseId: number;
	content: string;
	author: OriginalAuthor;
	attachments: OriginalAttachments;
	points: number;
	pointsForAnswer: number;
	pointsForBestAnswer: number;
	created: string;
	isClosed: boolean;
	canBeAnswered: boolean;
	grade: { name: string };
	lastActivity?: string;
	subject: {
		slug: string;
	};
	eduLevel?: number;
	answers: {
		hasVerified: boolean;
		nodes: OriginalAnswer[];
	};
}

export interface OriginalQuestionAndSimilar extends OriginalQuestion {
	similar: {
		question: OriginalQuestion[];
	};
}

export interface OriginalAnswer {
	id: string;
	databaseId: number;
	content: string;
	created: string;
	isBest: boolean;
	isConfirmed: boolean;
	points: number;
	qualityScore: number;
	thanksCount: number;
	ratesCount: number;
	author: OriginalAuthor;
	verification: OriginalVerification;
	attachments: OriginalAttachments;
	canComment: boolean;
	comments: {
		count: number;
		edges: {
			node: OriginalComment;
		}[];
	};
}

export interface Author {
	/**
	 * The author's ID (author identifier).
	 */
	id: number;
	/**
	 * The author's username.
	 */
	username?: string;
	/**
	 * The author's avatar url.
	 */
	avatar_url?: string;
	/**
	 * The author's rank.
	 */
	rank: string;
	/**
	 * The author's bio.
	 */
	description?: string;
	/**
	 * The author's gender.
	 */
	gender: string;
	/**
	 * The author's points.
	 */
	points: number;
	/**
	 * The author's thank you points.
	 */
	receivedThanks: number;
	bestAnswersCount: number;
	helpedUsersCount: number;
	specialRanks: string[];
	friendsCount: number;
	created: CreatedInterface;
	bestAnswers: {
		count: number;
		InLast30Days: number;
	};
	answerStreak?: OriginalAuthor['answeringStreak'];
	questions: {
		count: number;
		data: AuthorQuestionData[];
	};
	_id: string;
}

export interface AuthorQuestionData {
	content: string;
	created: CreatedInterface;
	closed: boolean;
	education: string;
	canBeAnswered: boolean;
	attachments: string[];
	education_level: number;
	points_answer: {
		forBest: number;
		normal: number;
	};
	points_question: number;
	grade: string;
}

export interface CreatedInterface {
	iso: string;
	date: Date;
}

export interface BrainlyResponse {
	node: OriginalQuestionAndSimilar;
}

export type LanguageList = CountryList;
