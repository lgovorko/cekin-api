import { define } from 'typeorm-seeding';
import { hashSync } from 'bcrypt';
import { Admin } from './entities/admins.entity';

define(Admin, (
  _,
  settings: {
    username: string;
    password: string;
    role: number;
  },
) => {
  const newAdmin = new Admin();

  newAdmin.username = settings.username;
  newAdmin.password = settings.password
    ? hashSync(settings.password, 10)
    : null;
  newAdmin.role = settings.role;

  return newAdmin;
});
