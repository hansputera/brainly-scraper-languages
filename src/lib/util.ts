import type {
	Answer,
	Author,
	AuthorQuestionData,
	Comment,
	LanguageList,
	OriginalAnswer,
	OriginalAuthor,
	OriginalComment,
	OriginalQuestion,
	OriginalQuestionAndSimilar,
	Question,
	WorkType,
} from './types';

/**
 * @class Util
 */
export default class Util {
	/**
	 * Parse Node ID to [type, id]
	 * @param {string} id Node ID
	 * @return {[string, number]}
	 */
	static parseId(id: string): [string, number] {
		const [type, idSubject] = Buffer.from(id, 'base64')
			.toString('utf8')
			.split(':');
		return [type, parseInt(idSubject)];
	}

	/**
	 * Convert decoded ID
	 * @param {(string | number)[] | string | number} id The ID want to encode
	 * @param {string} type The ID type (e.g. user, grade, rank, subject, etc...)
	 * @return {string}
	 */
	static convertId(
		id: (string | number)[] | string | number,
		type?: string,
	): string {
		if (typeof id === 'number' && !type)
			throw new TypeError('You need to fill the type for this ID!');

		return Buffer.from(
			Array.isArray(id)
				? id.join(':')
				: type?.length
				? type + ':' + id.toString()
				: id.toString(),
		).toString('base64');
	}
	/**
	 * Normalize a text
	 *
	 * @param {string} text
	 * @return {string}
	 */
	static clearContent(text: string): string {
		const regex = new RegExp(/[[(?\/)]+tex]/gi);
		return text
			.replace(/(<br?\s?\/>)/gi, '\n')
			.replace(/(<([^>]+)>)/gi, '')
			.replace(regex, '')
			.replace(/&gt;/gi, '');
	}

	/**
	 * Resolve a language code to work name.
	 *
	 * @param {LanguageList} lang
	 * @return {WorkType}
	 */
	static resolveWorkName(lang: LanguageList): WorkType {
		switch (lang) {
			case 'id':
				return 'tugas';
			case 'us':
			case 'hi':
			case 'ph':
			default:
				return 'question';
			case 'pl':
				return 'zadanie';
			case 'pt':
				return 'tarefa';
			case 'es':
				return 'tarea';
			case 'tr':
				return 'gorev';
			case 'ro':
				return 'tema';
			case 'ru':
				return 'task';
		}
	}

	/**
	 * Convert raw author
	 *
	 * @param {OriginalAuthor} author - Raw Author
	 * @return {Author}
	 */
	public static convertAuthor(author: OriginalAuthor): Author {
		const parseId = Util.parseId(author.id);
		const expectedObject: Author = {
			username: author.nick,
			id: parseId.join(':'),
			helpedUsersCount: author.helpedUsersCount,
			receivedThanks: author.receivedThanks,
			avatar_url: author.avatar ? author.avatar.url : undefined,
			gender: author.gender,
			points: author.points,
			bestAnswersCount: author.bestAnswersCount,
			rank: author.rank ? author.rank.name : '-',
			specialRanks: author.specialRanks.length
				? author.specialRanks.map((r) => r.name)
				: [],
			created: {
				iso: author.created,
				date: new Date(author.created),
			},
			friendsCount: author.friends.count,
			bestAnswers: {
				count: author.bestAnswersCount,
				InLast30Days: author.bestAnswersCountInLast30Days,
			},
			answerStreak: author.answeringStreak,
			questions: {
				count: author.questions.count,
				data: author.questions.edges.map(
					(r) =>
						({
							content: this.clearContent(r.node.content),
							closed: r.node.isClosed,
							created: {
								iso: r.node.created,
								date: new Date(r.node.created),
							},
							education: r.node.subject.name,
							canBeAnswered: r.node.canBeAnswered,
							attachments: r.node.attachments.map((x) => x.url),
							education_level: r.node.eduLevel,
							points_answer: {
								forBest: r.node.pointsForBestAnswer,
								normal: r.node.pointsForAnswer,
							},
							points_question: r.node.points,
							grade: r.node.grade.name,
						} as AuthorQuestionData),
				),
			},
			databaseId: parseId[1],
		};
		return expectedObject;
	}

	/**
	 * Convert a raw comment
	 *
	 * @param {OriginalComment} comment - Raw comment
	 * @return {Comment}
	 */
	public static convertComment(comment: OriginalComment): Comment {
		const parseId = Util.parseId(comment.id);
		const expectedObject: Comment = {
			content: this.clearContent(comment.content),
			author: comment.author,
			id: parseId.join(':'),
			deleted: comment.deleted,
			databaseId: parseId[1],
		};

		return expectedObject;
	}

	/**
	 * Convert a raw answer
	 *
	 * @param {OriginalAnswer} answer - Raw answer
	 * @return {Answer}
	 */
	public static convertAnswer(answer: OriginalAnswer): Answer {
		const parseId = Util.parseId(answer.id);
		const expectedObject: Answer = {
			content: this.clearContent(answer.content),
			author: answer.author
				? this.convertAuthor(answer.author)
				: undefined,
			isBest: answer.isBest,
			points: answer.points,
			confirmed: answer.isConfirmed,
			score: answer.qualityScore ? answer.qualityScore : 0,
			ratesCount: answer.ratesCount,
			thanksCount: answer.thanksCount,
			attachments: answer.attachments.map((x) => x.url),
			created: {
				iso: answer.created,
				date: new Date(answer.created),
			},
			canComment: answer.canComment,
			verification: answer.verification,
			comments: answer.comments.edges.map((x) =>
				this.convertComment(x.node),
			),
			databaseId: parseId[1],
			id: parseId.join(':'),
		};
		return expectedObject;
	}

	/**
	 * Convert a raw question
	 *
	 * @param {OriginalQuestionAndSimilar} question - Raw question
	 * @return {Question}
	 */
	public static convertQuestion(
		question: OriginalQuestionAndSimilar | OriginalQuestion,
	): Question {
		const parseId = Util.parseId(question.id);
		const expectedObject: Question = {
			id: parseId.join(':'),
			content: this.clearContent(question.content),
			closed: question.isClosed,
			created: {
				iso: question.created,
				date: new Date(question.created),
			},
			attachments: question.attachments.map((x) => x.url),
			author: question.author
				? this.convertAuthor(question.author)
				: undefined,
			education: question.subject.name,
			education_level: question.eduLevel ?? undefined,
			canBeAnswered: question.canBeAnswered,
			points_answer: {
				forBest: question.pointsForBestAnswer,
				normal: question.pointsForAnswer,
			},
			points_question: question.points,
			grade: question.grade.name,
			lastActivity: question.lastActivity,
			verifiedAnswer: question.answers.hasVerified,
			// answers: question.answers.nodes.map((x) => this.convertAnswer(x)),
			databaseId: parseId[1],
			similars:
				'similar' in question
					? question.similar?.question.map((q) =>
							Util.convertQuestion(q),
					  )
					: [],
		};

		return expectedObject;
	}

	/**
	 * Generate zadane cookie
	 * @return {string}
	 */
	static generateZadaneCookieGuest(): string {
		// src
		// var COOKIE_TOKEN_GUEST = 'Zadanepl_cookie[Token][Guest]';
		// var COOKIE_TOKEN_GUEST_LENGHT = 80;
		// var COOKIE_TOKEN_GUEST_TTL = 2 * 365 * 24 * 3600;

		const chars =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
			'abcdefghijklmnopqrstuvwxyz0123456789';
		let token = '';

		for (let i = 0; i < 80; i++) {
			token += chars.charAt(Math.floor(Math.random() * chars.length));
		}

		return (
			'Zadanepl_cookie[Token][Guest]=' +
			token +
			';path=/;max-age=' +
			2 * 365 * 24 * 3600
		);
	}
}
