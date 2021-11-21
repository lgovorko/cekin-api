import { Seeder, Factory, times } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import { usersData } from '../../users/users.map';
import { User } from '../../users/entities/users.entity';
import { adminsData } from '../../admins/admins.map';
import { Admin } from '../../admins/entities/admins.entity';
import { questionsData } from '../../questions/questions.map';
import { Question } from '../../questions/entities/questions.entity';
import { QuestionAnswer } from '../../question-answers/entities/question-answers.entity';
import { prizesData } from '../../prizes/prizes.map';
import { Prize } from '../../prizes/entities/prizes.entity';
import { settingsData } from '../../settings/settings.map';
import { Settings } from '../../settings/entities/settings.entity';
import { Code } from '../../codes/entities/codes.entity';
import { funFactData } from '../../fun-facts/fun-facts.map';
import { FunFact } from '../../fun-facts/entities/fun-facts.entity';
import { dailyDrawData } from '../../daily-draws/daily-draws.map';
import { DailyDraw } from '../../daily-draws/entities/daily-draws.entity';

export default class MainSeed implements Seeder {
  public async run(factory: Factory, _: Connection): Promise<void> {
    const users = usersData;
    const admins = adminsData;

    const newUsers = await times(users.length, async i => {
      const user = users[i];
      const newUser = await factory(User)(user).create();
      return newUser;
    });

    const newAdmins = await times(admins.length, async i => {
      const admin = admins[i];
      const newAdmins = await factory(Admin)(admin).create();
      return newAdmins;
    });

    const newQuestions = await times(questionsData.length, async i => {
      const questionPayload = questionsData[i];

      const { question, questionAnswers } = questionPayload;

      const newQuestion = await factory(Question)({ question }).create();

      const { id: questionId } = newQuestion;

      const newQuestionAnswer = await times(questionAnswers.length, async s => {
        const questionAnswer = questionAnswers[s];
        const newQuestionAnswers = await factory(QuestionAnswer)({
          ...questionAnswer,
          questionId,
        }).create();
        return newQuestionAnswers;
      });

      return newQuestion;
    });

    const newPrizes = await times(prizesData.length, async n => {
      const prize = prizesData[n];
      const newPrize = factory(Prize)(prize).create();
      return newPrize;
    });

    const newSeetings = await times(settingsData.length, async t => {
      const setting = settingsData[t];
      const newSetting = factory(Settings)(setting).create();
      return newSetting;
    });

    const newCodes = await times(100, async g => {
      const code = g <= 9 ? `ABCDEF${g}A` : `ABCDEF${g}`;
      const newCode = factory(Code)({ code }).create();
      return newCode;
    });

    const newFunFacts = await times(1, async o => {
      const { text } = funFactData;
      const newFunFacts = factory(FunFact)({ text }).create();
      return newFunFacts;
    });

    const newDailyDraws = await times(10, async p => {
      const { drawDate } = dailyDrawData[p];
      const prizesId = [1,2,3,4];
      const prizeId = prizesId[Math.floor(Math.random() * prizesId.length)];
      const newDailyDraw = factory(DailyDraw)({ drawDate, prizeId }).create();
      return newDailyDraw;
    });
  }
}
