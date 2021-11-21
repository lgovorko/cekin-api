import { define } from 'typeorm-seeding';
import { Prize } from './entities/prizes.entity';

define(Prize, (
  _,
  settings: {
    name: string;
    description: string;
    totalCount: number;
    totalSpent: number;
    imageFilename: string;
    imagePath: string;
  },
) => {
  const newPrize = new Prize();

  newPrize.name = settings.name;
  newPrize.description = settings.description;
  newPrize.totalCount = settings.totalCount;
  newPrize.totalSpent = settings.totalSpent;
  newPrize.imageFilename = settings.imageFilename;
  newPrize.imagePath = settings.imagePath;

  return newPrize;
});
