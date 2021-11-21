import { Injectable } from '@nestjs/common';

@Injectable()
export class UserDrawQualificationsHelperService {
  public incrementCorrectAnswers(correctAnswers: number): number {
    let correctAnswersToUpdate = correctAnswers;
    correctAnswersToUpdate += 1;
    return correctAnswersToUpdate;
  }

  public incrementQualificationsCount(qualificationsCount: number): number {
    let qualificationsCountToUpdate = qualificationsCount;
    qualificationsCountToUpdate += 1;
    return qualificationsCountToUpdate;
  }
}
