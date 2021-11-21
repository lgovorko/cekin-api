import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { getRepository } from 'typeorm';
import { UserQuiz } from '../user-quiz/entities/user-quiz.entity';
import { UserDrawQualification } from './entities/user-draw-qualifications.entity';
import { Code } from '../codes/entities/codes.entity';
import { UserDrawQualificationTypeE } from './enum';
import { omit } from 'lodash';
import { UserQuizStatusE } from '../user-quiz/enum';
import { Settings } from '../settings/entities/settings.entity';
import { QuestionAnswer } from '../question-answers/entities/question-answers.entity';

let userJWT: string;
let userId: number;

let userQuizId: number;
let questionId: number;
let answerId: number;
let settings;
let answers;

describe('(e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const userDrawQualificationRepository = await getRepository(
      UserDrawQualification,
    ).query('DELETE FROM user_draw_qualifications');

    const userQuizRepository = await getRepository(UserQuiz).query(
      'DELETE FROM user_quiz',
    );

    const updateCodes = await getRepository(Code).query(`
      UPDATE codes set status = 1
    `);

    settings = await getRepository(Settings).find();
    answers = await getRepository(QuestionAnswer).find();
  });

  it('/(POST) user login', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'ipsum_user@mail.com',
        password: '123456',
      })
      .set('authorization', `Bearer ${userJWT}`)
      .expect(({ body }) => {
        const { accessToken, id, createdAt } = body;

        userJWT = accessToken;
        userId = id;
        return expect(body).toStrictEqual({
          id: 1,
          username: 'ipsum_user@mail.com',
          role: 3,
          isVerified: true,
          accessToken,
          createdAt,
        });
      });
  });

  it('/(POST) Code Entry', () => {
    const code = 'ABCDEF0A';
    return request(app.getHttpServer())
      .post('/user-draw-qualifications/code-entry')
      .send({
        code,
      })
      .set('authorization', `Bearer ${userJWT}`)
      .expect(({ body }) => {
        const filteredData = omit(body, ['createdAt', 'updatedAt']);

        const { id, dailyDrawId } = body;

        return expect(filteredData).toStrictEqual({
          id,
          code,
          userQuizId: null,
          type: UserDrawQualificationTypeE.CODE,
          userId,
          dailyDrawId,
        });
      });
  });

  it('/(POST) Start Quiz', () => {
    return request(app.getHttpServer())
      .post('/user-quiz/start')
      .send()
      .set('authorization', `Bearer ${userJWT}`)
      .expect(async ({ body }) => {
        const { userQuizId: uqId, question } = body;
        const updatedBody = omit(body, ['question', 'start']);
        userQuizId = uqId;

        const { id: qId, questionAnswers } = question;

        questionId = qId;

        const answersId = questionAnswers.map(({ id }) => id);

        answerId = answersId[Math.floor(Math.random() * answersId.length)];

        const questionsCount = settings.find(
          ({ key }) => key === 'quizQuestionsCount',
        );

        const { value } = questionsCount;

        const progress = `0/${value}`;

        return expect(updatedBody).toStrictEqual({
          userQuizId: uqId,
          userId,
          progress,
          status: UserQuizStatusE.ACTIVE,
          qualifications: 0,
          expired: false,
        });
      });
  });

  it('/(PATCH) answer first question', () => {
    return request(app.getHttpServer())
      .post(`/user-quiz/answer/${userQuizId}`)
      .send({
        questionId: questionId,
        answerId: answerId
      })
      .set('authorization', `Bearer ${userJWT}`)
      .expect(async ({ body }) => {

        const { userQuizId: uqId, question, previousAnswer } = body;
        const updatedBody = omit(body, ['question', 'start']);

        userQuizId = uqId;

        const answeredQuestion = answers.find(({ id }) => id === answerId);

        const { id: qId } = question;
        questionId = qId;

        answerId = answers[Math.floor(Math.random() * answers.length)];

        const questionsCount = settings.find(
          ({ key }) => key === 'quizQuestionsCount',
        );

        const { value } = questionsCount;
        const { correct } = answeredQuestion;

        let qualifications = 0;

        if (correct) qualifications = 1;

        const progress = `${qualifications}/${value}`;

        return expect(updatedBody).toStrictEqual({
          userQuizId: uqId,
          userId,
          progress,
          status: UserQuizStatusE.FINISHED,
          qualifications: qualifications,
          expired: false,
          previousAnswer: answeredQuestion,
        });
      });
  });
});
