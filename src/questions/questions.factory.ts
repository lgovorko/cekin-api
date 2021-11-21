import { define } from 'typeorm-seeding';
import { Question } from './entities/questions.entity';

define(Question, (
  _,
  settings: {
    question: string;
  },
) => {
  const newQuestion = new Question();

  newQuestion.question = settings.question;

  return newQuestion;
});
