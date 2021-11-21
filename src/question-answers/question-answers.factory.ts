import { define } from 'typeorm-seeding';
import { QuestionAnswer } from './entities/question-answers.entity';

define(QuestionAnswer, (
  _,
  settings: {
    questionId: number;
    answer: string;
    correct: boolean;
  },
) => {
  const newQuestionAnswer = new QuestionAnswer();

  newQuestionAnswer.questionId = settings.questionId;
  newQuestionAnswer.answer = settings.answer;
  newQuestionAnswer.correct = settings.correct;

  return newQuestionAnswer;
});
