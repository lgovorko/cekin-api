import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserQuizRepository } from './user-quiz.repository';
import { getRepository } from 'typeorm';
import { User } from '../users/entities/users.entity';
import { errorMessage } from '../shared/error-messages/error-messages';
import { QuizService } from './services/quiz.service';
import {
  UserQuizAnswerDTO,
  UserQuizStartResponseDTO,
  UserQuizStartRequestDTO,
} from './dto';
import { Question } from '../questions/entities/questions.entity';
import { QuestionAnswer } from '../question-answers/entities/question-answers.entity';
import { UserQuizStatusE } from './enum';
import { SettingsService } from '../settings/settings.service';
import { QuestionsService } from '../questions/questions.service';
import { UserDrawQualification } from '../user-draw-qualifications/entities/user-draw-qualifications.entity';

@Injectable()
export class UserQuizService {
  constructor(
    @InjectRepository(UserQuizRepository)
    private readonly userQuizRepository: UserQuizRepository,
    private readonly quizService: QuizService,
    private readonly settingsService: SettingsService,
    private readonly questionsService: QuestionsService,
  ) {}

  public async startUserQuiz(
    userId: number,
    userQuizStartPayload: UserQuizStartRequestDTO,
  ): Promise<UserQuizStartResponseDTO> {
    const user: User = await getRepository(User).findOne(userId);
    if (!user) throw new NotFoundException(errorMessage.userNotFound);

    const { userDrawQualificationId } = userQuizStartPayload;

    const userDrawQualification: UserDrawQualification = await getRepository(
      UserDrawQualification,
    ).findOne(userDrawQualificationId);

    if (!userDrawQualification)
      throw new NotFoundException(errorMessage.userDrawQualificationNotFound);

    const { extraSpent } = userDrawQualification;

    if (extraSpent)
      throw new BadRequestException(
        errorMessage.alreadySpentExtraQualifications,
      );

    const quizQuestionsCount = await this.settingsService.getSetting(
      'quizQuestionsCount',
    );

    const questionsId = await this.questionsService.getQuestionsId();

    return this.quizService.start(
      userId,
      questionsId,
      +quizQuestionsCount,
      userDrawQualification,
    );
  }

  public async answerQuestion(
    userId: number,
    userQuizId: number,
    userAnswerPayload: UserQuizAnswerDTO,
  ): Promise<UserQuizStartResponseDTO> {
    const user = await getRepository(User).findOne(userId);
    if (!user) throw new NotFoundException(errorMessage.userNotFound);

    const userQuiz = await this.userQuizRepository.findOne(userQuizId);
    if (!userQuiz) throw new NotFoundException(errorMessage.userQuizNotFound);

    const { status } = userQuiz;
    if (status !== UserQuizStatusE.ACTIVE)
      throw new BadRequestException(errorMessage.userQuizFinished);

    const { questionId, answerId } = userAnswerPayload;

    const question = await getRepository(Question).findOne(questionId);
    if (!question) throw new NotFoundException(errorMessage.questionNotFound);

    const userDrawQualification = await getRepository(
      UserDrawQualification,
    ).findOne({ where: { userQuizId } });

    if (!userDrawQualification)
      throw new NotFoundException(errorMessage.userDrawQualificationNotFound);

    const questionAnswer: QuestionAnswer = await getRepository(
      QuestionAnswer,
    ).findOne(answerId);
    if (!questionAnswer)
      throw new NotFoundException(errorMessage.questionAnswerNotFound);

    const questionsCount: string = await this.settingsService.getSetting(
      'quizQuestionsCount',
    );

    const questionDuration: string = await this.settingsService.getSetting(
      'quizDuration',
    );

    return this.quizService.answerQuestion(
      userQuiz,
      questionAnswer,
      userDrawQualification,
      {
        questionsCount: +questionsCount,
        questionDuration: +questionDuration,
      },
    );
  }
}
