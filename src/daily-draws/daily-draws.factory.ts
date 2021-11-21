import { define } from 'typeorm-seeding';
import { DailyDraw } from './entities/daily-draws.entity';

define(DailyDraw, (
  _,
  settings: {
    prizeId: number;
    drawDate: string;
    totalCount: number;
    totalSpent: number;
    imageFilename: string;
    imagePath: string;
  },
) => {
  const newDailyDraw = new DailyDraw();
  newDailyDraw.prizeId = settings.prizeId;
  newDailyDraw.drawDate = settings.drawDate;
  return newDailyDraw;
});
