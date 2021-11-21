import { RoleE } from '../shared/enum';

export const adminsData = [
  {
    username: 'superadmin@mail.com',
    password: '123456',
    role: `${RoleE.SUPERADMIN}`,
  },
  {
    username: 'admin@mail.com',
    password: '123456',
    role: `${RoleE.ADMIN}`,
  },
  {
    username: 'leo.govorko@dings.solutions',
    password: '123456',
    role: `${RoleE.SUPERADMIN}`,
  },
  {
    username: 'leo.govorko@gmail.com',
    password: '123456',
    role: `${RoleE.SUPERADMIN}`,
  },
];
