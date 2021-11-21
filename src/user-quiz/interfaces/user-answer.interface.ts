export interface UserAnswerI {
    questionOrdinalNumber: number,
    questionId: number,
    answerId: number,
    correct: boolean,
    time: number,
    expired: boolean
}