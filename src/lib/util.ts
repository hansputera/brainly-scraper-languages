import type {
	Answer,
	Author,
	AuthorQuestionData,
	Comment,
	LanguageList,
	OriginalAnswer,
	OriginalAuthor,
	OriginalComment,
	OriginalQuestionAndSimilar,
	Question,
	WorkType,
} from './types';

/**
 * @class Util
 */
export default class Util {
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
		const expectedObject: Author = {
			username: author.nick,
			id: author.databaseId,
			helpedUsersCount: author.helpedUsersCount,
			receivedThanks: author.receivedThanks,
			avatar_url: author.avatar ? author.avatar.url : undefined,
			gender: author.gender,
			points: author.points,
			description: author.description.length
				? author.description
				: undefined,
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
							education: r.node.subject.slug,
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
			_id: author.id,
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
		const expectedObject: Comment = {
			content: this.clearContent(comment.content),
			author: comment.author,
			id: comment.databaseId,
			deleted: comment.deleted,
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
			_id: answer.id,
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
		question: OriginalQuestionAndSimilar,
	): Question {
		const expectedObject: Question = {
			id: question.databaseId,
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
			education: question.subject.slug,
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
			_id: question.id,
		};

		return expectedObject;
	}
}
