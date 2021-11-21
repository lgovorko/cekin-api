import { define } from 'typeorm-seeding';
import { User } from './entities/users.entity';
import { hashSync } from 'bcrypt';

define(User, (
  _,
  settings: {
    username: string;
    password: string;
    role: number;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: number;
    phoneNumber: string;
    address: string;
    facebookId: number;
    googleId: number;
  },
) => {
  const newUser = new User();

  newUser.username = settings.username;
  newUser.password = settings.password ? hashSync(settings.password, 10) : null;
  newUser.role = settings.role;
  newUser.firstName = settings.firstName;
  newUser.lastName = settings.lastName;
  newUser.birthDate = settings.birthDate;
  newUser.gender = settings.gender;
  newUser.phoneNumber = settings.phoneNumber;
  newUser.address = settings.address;
  newUser.facebookId = settings.facebookId;
  newUser.googleId = settings.googleId;

  return newUser;
});
