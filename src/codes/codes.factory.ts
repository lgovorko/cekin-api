import { define } from 'typeorm-seeding';
import { Code } from './entities/codes.entity';

define(Code, (
  _,
  settings: {
    code: string;
  },
) => {
  const newCode = new Code();
  newCode.code = settings.code;
  return newCode;
});
