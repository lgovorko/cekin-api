import { define } from 'typeorm-seeding';
import { FunFact } from './entities/fun-facts.entity';

define(FunFact, (
  _,
  settings: {
    text: string;
  },
) => {
  const funFact = new FunFact();
  funFact.text = settings.text;
  return funFact;
});
