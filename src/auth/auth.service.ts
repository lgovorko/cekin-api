import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
	BadRequestException,
} from '@nestjs/common';
import { getRepository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { compare, hashSync } from 'bcrypt';
import { pick, pickBy } from 'lodash';
import * as moment from 'moment';

import { AuthAdminLoginI } from './interfaces/auth-admins-login.interface';
import { Admin } from '../admins/entities/admins.entity';
import { errorMessage } from '../shared/error-messages/error-messages';
import { User } from '../users/entities/users.entity';
import { AuthLoginResponseDTO, AuthLoginDTO } from './dto/auth-login.dto';
import { verify } from 'jsonwebtoken';
import { UserTokenPayloadI } from './interfaces';
import { validQueryStringParams } from './auth.constants';
import { UserRegisterDTO, UserRegisterResponseDTO } from '../users/dto';
import { UserHelperService } from '../users/services';
import { HelperService } from '../shared/services/helpers.service';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private userHelperService: UserHelperService,
		private helperService: HelperService
	) {}

	public async registerUser(
		userRegisterPayload: UserRegisterDTO
	): Promise<UserRegisterResponseDTO> {
		const modifiedUserPayload = this.userHelperService.renameObjectKey(
			userRegisterPayload,
			'email',
			'username'
		);
		const { password, birthDate } = modifiedUserPayload;

		const userDataToInsert: Partial<User> = pickBy({
			...modifiedUserPayload,
			password: password && hashSync(password, 10),
			birthDate: moment(birthDate).format('YYYY-MM-DD'),
			isVerified: true,
		});

		const newUser: User = await getRepository(User).save(userDataToInsert);

		const userTokenPayload = pick(newUser, [
			'id',
			'username',
			'role',
			'isVerified',
			'createdAt',
		]);

		const token = await this.jwtService.signAsync(userTokenPayload, {
			secret: `${process.env.JWT_SECRET}`,
			expiresIn: '7d',
		});

		/* const verificationRedirectUrl: string = this.userHelperService.generateVerifyUrl(
			token
		);

		const html = await this.helperService.createTemplate(
			`${process.env.PATH_TEMPLATE}/mail.template.hbs`,
			{
				verificationRedirectUrl,
				imagePath: `${process.env.DOMAIN}${process.env.MAIL_TEMPLATE_SVG}`,
				actionText: 'Verificiraj',
			}
		);

		const { username } = userTokenPayload;

		await this.userHelperService.sendMailWithTemplate({
			to: username,
			html,
			subject: 'Verifikacijski mail',
		}); */

		return { ...newUser, accessToken: token };
	}

	public async verifyAccessToken(
		accessToken: string,
		{ kind }: { kind: string }
	): Promise<AuthLoginResponseDTO> {
		if (!validQueryStringParams.includes(kind))
			throw new BadRequestException(errorMessage.wrongQueryStringValue);

		const { id: userId } = verify(
			accessToken,
			`${process.env.JWT_SECRET}`
		) as UserTokenPayloadI;

		if (kind === 'jwt') return this.verifyUser(userId);
		// if (kind === 'google') return this.verifyGoogleUser(userId);
		// return this.verifyFacebookUser(userId);
	}

	private async verifyUser(userId: number) {
		const user: User = await getRepository(User).findOne(userId);

		if (!user) throw new NotFoundException(errorMessage.userNotFound);

		const userTokenPayload: {
			id: number;
			username: string;
			role: number;
			createdAt: string;
			isVerified: boolean;
		} = pick(user, ['id', 'username', 'role', 'createdAt', 'isVerified']);

		return {
			...userTokenPayload,
			accessToken: await this.generateAccessToken(userTokenPayload),
		};
	}

	// private async verifyGoogleUser(userId: number) {}
	// private async verifyFacebookUser(userId: number) {}

	private async generateAccessToken(
		userTokenPayload: UserTokenPayloadI
	): Promise<string> {
		return this.jwtService.sign(userTokenPayload, {
			secret: `${process.env.JWT_SECRET}`,
			expiresIn: '7d',
		});
	}

	public async adminLogin({
		email,
		password,
	}: AuthAdminLoginI): Promise<AuthLoginResponseDTO> {
		const admin: Admin = await getRepository(Admin).findOne({
			username: email,
		});

		if (!admin) throw new NotFoundException(errorMessage.adminWrongCreds);

		const { password: adminPassword } = admin;

		if (!(await compare(password, adminPassword)))
			throw new UnauthorizedException(errorMessage.adminWrongCreds);

		const adminTokenPayload = pick(admin, [
			'id',
			'username',
			'role',
			'createdAt',
		]);

		return {
			...adminTokenPayload,
			accessToken: await this.jwtService.sign(adminTokenPayload, {
				secret: `${process.env.JWT_SECRET}`,
				expiresIn: '7d',
			}),
		};
	}

	public async userLogin({
		email,
		password,
	}: AuthLoginDTO): Promise<AuthLoginResponseDTO> {
		const user: User = await getRepository(User).findOne({
			where: { username: email },
		});

		if (!user) throw new BadRequestException(errorMessage.userWrongCreds);

		const { password: userPassword, isVerified } = user;
		console.log(password, ' password');
		if (!(await compare(password, userPassword)))
			throw new BadRequestException(errorMessage.userWrongCreds);

		if (!isVerified)
			throw new BadRequestException(errorMessage.userNotVerified);

		const userTokenPayload = pick(user, [
			'id',
			'username',
			'role',
			'isVerified',
			'createdAt',
		]);

		return {
			...userTokenPayload,
			accessToken: await this.jwtService.sign(userTokenPayload, {
				secret: `${process.env.JWT_SECRET}`,
				expiresIn: '7d',
			}),
		};
	}

	// public async facebookLogin() {}
	// public async googleLogin() {}
}
