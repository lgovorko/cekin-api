import { UserGenderE, UserStatusE } from './enum';
import { RoleE } from '../shared/enum';

export const usersData = [
  {
    username: 'ipsum_user@mail.com',
    password: '123456',
    role: RoleE.USER,
    gender: UserGenderE.NOT_DEFINED,
    firstName: 'Lorem Ipsum',
    lastName: 'Lorem Ipsum',
    isVerified: true
  },
  {
    username: 'lorem_user@mail.com',
    password: '123456',
    role: RoleE.USER,
    firstName: 'Lorem Ipsum',
    lastName: 'Lorem Ipsum',
    status: UserStatusE.ACTIVE,
    gender: UserGenderE.MALE,
    isVerified: true
  },
  {
    role: RoleE.USER,
    status: UserStatusE.ACTIVE,
    facebookId: 1312312412414,
    isVerified: true
  },
  {
    role: RoleE.USER,
    status: UserStatusE.ACTIVE,
    googleId: 234255363634564,
    isVerified: true
  },
  {
    role: RoleE.USER,
    status: UserStatusE.ACTIVE,
    facebookId: 42342423425252,
    isVerified: true
  },
  {
    role: RoleE.USER,
    status: UserStatusE.ACTIVE,
    googleId: 56453767647,
    isVerified: true
  },
  {
    username: 'leo.govorko@gmail.com',
    password: '123456',
    role: RoleE.USER,
    firstName: 'Lorem Ipsum',
    lastName: 'Lorem Ipsum',
    status: UserStatusE.ACTIVE,
    gender: UserGenderE.MALE,
    isVerified: true
  },
  {
    username: 'leo.govorko@dings.solutions',
    password: '123456',
    role: RoleE.USER,
    firstName: 'Lorem Ipsum',
    lastName: 'Lorem Ipsum',
    status: UserStatusE.ACTIVE,
    gender: UserGenderE.MALE,
    isVerified: true
  },
];
