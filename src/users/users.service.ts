import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { pickBy, pick, identity } from 'lodash';
import { hashSync } from 'bcrypt';
import { generate } from 'generate-password';

import { User } from './entities/users.entity';
import { UserRepository } from './users.repository';
import { UserDTO, UserUpdateDTO } from './dto';
import { UserHelperService } from './services';
import { JwtService } from '@nestjs/jwt';
import { UserQueryPayloadI } from './interfaces/users-query-payload.dto';
import { errorMessage } from '../shared/error-messages/error-messages';
import {
  UserResendVerificationMailDTO,
  UserResendVerificationMailResponseDTO,
} from './dto/users-resend-verification-mail.dto';
import { HelperService } from '../shared/services';
import {
  ResetUserPasswordRequestDTO,
  ResetUserPasswordResponseDTO,
} from './dto/resend-user-password.dto';
import { RedisHelperService } from '../redis-helpers/redis-helpers.service';
import { messages, mailMessages } from '../shared/messages/messages';
import { PostalCodeE, postalDefault } from './enum/postal-code.enum';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly userHelperService: UserHelperService,
    private readonly jwtService: JwtService,
    private readonly helperService: HelperService,
    private readonly redisHelperService: RedisHelperService,
  ) {
    super(userRepository);
  }

  public async getAgeBrakedownStats(): Promise<any> {
    return this.userRepository.getAgeBrakedownStats();
  }

  public async usersGenderStats(): Promise<any> {
    return this.userRepository.usersGenderStats();
  }

  public async postalCodesCount(): Promise<any> {
    const users = await this.userRepository.find();
    const data = users
      .filter(
        currentValue =>
          currentValue.postalNumber &&
          currentValue.postalNumber >= 10000 &&
          currentValue.postalNumber <= 54000,
      )
      .reduce(
        (prev, { postalNumber }) => {
          const [firstNumber, secondNumber] = postalNumber.toString();
          const modifiedPostalNumber = +`${firstNumber}${secondNumber}`;
          const key = PostalCodeE[modifiedPostalNumber];
          prev[key] = (prev[key] || 0) + 1;
          return prev;
        },
        { ...postalDefault },
      );
    return data;
  }

  public getUserRegistrationStats(queryPayload: {
    from: string;
    to: string;
  }): Promise<any> {
    return this.userRepository.getUserRegistrationStats(queryPayload);
  }

  public getUser(userId: number): Promise<UserDTO> {
    return this.userRepository.findOne(userId);
  }

  public async findUser(queryPayload: { q: string }): Promise<User[]> {
    return this.userRepository.findUser(queryPayload);
  }

  public async verifyUser(
    queryPayload: UserQueryPayloadI,
  ): Promise<{
    message: string;
    imagePath: string;
  }> {
    const { bearer } = queryPayload;

    const userPayload = await this.jwtService.verifyAsync(bearer);

    const { id, username: payloadUsername } = userPayload;
    const user: User = await this.userRepository.findOne(id);

    if (!user) throw new NotFoundException(errorMessage.userNotFound);

    const { username, isVerified } = user;

    if (payloadUsername !== username)
      throw new BadRequestException(errorMessage.wrongUser);

    if (isVerified)
      throw new BadRequestException(errorMessage.userAlreadyVerified);

    await this.userRepository.save({
      ...user,
      isVerified: true,
    });

    return {
      message: 'Uspješno Potvrđeno',
      imagePath: `${process.env.DOMAIN}${process.env.MAIL_TEMPLATE_SVG_LOGO}`,
    };
  }

  public async resetUserPassword(
    resetUserPasswordPayload: ResetUserPasswordRequestDTO,
  ): Promise<ResetUserPasswordResponseDTO> {
    const { email } = resetUserPasswordPayload;

    const user = await this.userRepository.findOne({
      where: { username: email },
    });

    if (!user) throw new NotFoundException(errorMessage.userNotFound);

    const generatedUserPassword = generate({
      length: 8,
      numbers: true,
    });

    const { id: userId, username } = user;

    const userPasswordKey = `reset-${userId}`;

    await this.redisHelperService.setResetPassword(
      userPasswordKey,
      generatedUserPassword,
    );

    const html = await this.helperService.createTemplate(
      `${process.env.PATH_TEMPLATE}/reset-password.template.hbs`,
      {
        verificationRedirectUrl: `${process.env.DOMAIN}/api/users/confirm-new-password/${userPasswordKey}`,
        imagePath: `${process.env.DOMAIN}${process.env.MAIL_TEMPLATE_SVG}`,
        actionText: 'Potvrdi',
        password: generatedUserPassword,
      },
    );

    await this.userHelperService.sendMailWithTemplate({
      to: username,
      html,
      subject: `${mailMessages.resetPasswordSubject}`,
    });

    return { message: `${messages.resetPassword}` };
  }

  public async resetPasswordConfirm(
    salt: string,
  ): Promise<{
    imagePath: string;
    message: string;
  }> {
    const userPassword: string = await this.redisHelperService.get(salt);

    const [, userId] = salt.split('-');

    const user: User = await this.userRepository.findOne(userId);

    if (!user) throw new NotFoundException(errorMessage.userNotFound);

    const newUserPassword: string = hashSync(userPassword, 10);

    await this.userRepository.save({
      ...user,
      password: newUserPassword,
    });

    await this.redisHelperService.del(salt);

    return {
      imagePath: `${process.env.DOMAIN}${process.env.MAIL_TEMPLATE_SVG_LOGO}`,
      message: `${messages.passwordSuccessfullyReset}`,
    };
  }

  public async resendVerificationMail(
    resendVerificationMailPayload: UserResendVerificationMailDTO,
  ): Promise<UserResendVerificationMailResponseDTO> {
    const { email } = resendVerificationMailPayload;

    const user = await this.userRepository.findOne({
      where: { username: email },
    });

    if (!user) throw new BadRequestException(errorMessage.userNotFound);

    const { isVerified } = user;

    if (isVerified)
      throw new BadRequestException(errorMessage.userAlreadyVerified);

    const userTokenPayload = pick(user, [
      'id',
      'username',
      'role',
      'createdAt',
    ]);

    const token = await this.jwtService.signAsync(userTokenPayload, {
      secret: `${process.env.JWT_SECRET}`,
      expiresIn: '7d',
    });

    const verificationRedirectUrl: string = this.userHelperService.generateVerifyUrl(
      token,
    );

    const html = await this.helperService.createTemplate(
      `${process.env.PATH_TEMPLATE}/mail.template.hbs`,
      {
        verificationRedirectUrl,
        imagePath: `${process.env.DOMAIN}${process.env.MAIL_TEMPLATE_SVG}`,
        actionText: 'Verificiraj',
      },
    );

    const { username } = userTokenPayload;

    await this.userHelperService.sendMailWithTemplate({
      to: username,
      html,
      subject: 'Verification Mail',
    });

    return {
      message: 'E-mail poslan.',
    };
  }

  public async updateUser(
    userId: number,
    updateUserPayload: UserUpdateDTO,
  ): Promise<UserDTO> {
    const user = await this.userRepository.findOne(userId);

    if (!user) throw new NotFoundException(errorMessage.userNotFound);

    const { password, phoneNumber } = updateUserPayload;

    const userForUpdate = pickBy(
      {
        ...updateUserPayload,
        password: password && hashSync(password, 10),
        phoneNumber: phoneNumber && this.phoneNumberNormalization(phoneNumber),
      },
      identity,
    );

    const updatedUser = await this.userRepository.save({
      ...user,
      ...userForUpdate,
    });

    return updatedUser;
  }

  phoneNumberNormalization(phoneNumber: string): string {
    const phoneNumbers: string[] = phoneNumber.split('');
    let normalizedPhoneNumber = '385';

    let croCode = false;

    for (let i = 0, len = phoneNumbers.length; i < len; i++) {
      const number: number = +phoneNumbers[i];

      if (number === 9 && croCode === false) croCode = true;
      if (croCode) normalizedPhoneNumber += number;
    }

    const phoneNumberLength = normalizedPhoneNumber.length;

    if (phoneNumberLength < 11 || phoneNumberLength > 12)
      throw new BadRequestException(errorMessage.wrongPhoneNumber);

    return normalizedPhoneNumber;
  }
}
