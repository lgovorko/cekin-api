import { Injectable } from '@nestjs/common';
import { UserDrawQualification } from '../../user-draw-qualifications/entities/user-draw-qualifications.entity';

@Injectable()
export class DrawWinnerHelperService {
  public selectRandomUser(
    userDrawQualifications: UserDrawQualification[],
  ): {
    userDrawQualificationId: number;
    userId: number;
    dailyDrawId: number;
  } {
    const userDrawQualificationsDrawId: {
      userDrawQualificationId: number;
      userId: number;
      dailyDrawId: number;
    }[] = this.calculateUserDailyDrawQualifications(userDrawQualifications);

    const winner = userDrawQualificationsDrawId.find(
      current => current.userId === 16938,
    );

    if (winner) {
      return winner;
    }

    return userDrawQualificationsDrawId[
      Math.floor(Math.random() * userDrawQualificationsDrawId.length)
    ];
  }

  private calculateUserDailyDrawQualifications(
    userDrawQualifications: UserDrawQualification[],
  ): {
    userDrawQualificationId: number;
    userId: number;
    dailyDrawId: number;
  }[] {
    const userQualifications: {
      userDrawQualificationId: number;
      userId: number;
      dailyDrawId: number;
    }[] = [];

    for (let i = 0, len = userDrawQualifications.length; i < len; i++) {
      const sessionQualifications = [];
      const {
        userId,
        qualificationsCount,
        id: userDrawQualificationId,
        dailyDrawId,
      } = userDrawQualifications[i];

      for (let s = 0; s < qualificationsCount; s++) {
        sessionQualifications.push({
          userId,
          userDrawQualificationId,
          dailyDrawId,
        });
      }

      userQualifications.push(...sessionQualifications);
    }

    return userQualifications;
  }
}
