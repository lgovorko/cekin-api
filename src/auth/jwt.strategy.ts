import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, BadRequestException } from '@nestjs/common';
import { getRepository } from 'typeorm';

import { RoleE } from '../shared/enum';
import { User } from '../users/entities/users.entity';
import { errorMessage } from '../shared/error-messages/error-messages';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_SECRET}`,
    });
  }

  async validate(payload: {
    id: number;
    role: number;
    username: string;
  }): Promise<
    | {
        adminId: any;
        role: any;
        username: any;
        userId?: undefined;
      }
    | {
        userId: any;
        username: any;
        role: any;
        adminId?: undefined;
      }
  > {
    const { id, role, username } = payload;

    if (role !== RoleE.USER) return { adminId: id, role, username };

    const user: User = await getRepository(User).findOne(id);

    if (!user) throw new BadRequestException(errorMessage.userNotFound);

    const { isVerified } = user;
    
    if (!isVerified)
      throw new BadRequestException(errorMessage.userNotVerified);

    return { userId: id, username: username, role };
  }
}
