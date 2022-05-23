import { Injectable, BadRequestException } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import * as sgTransport from 'nodemailer-sendgrid-transport';
import { errorMessage } from '../../shared/error-messages/error-messages';

export interface MailI {
	from?: string;
	to?: string;
	subject?: string;
	text?: string;
	html?: any;
}

@Injectable()
export class UserHelperService {
	private transporter: Transporter;

	constructor() {
		this.transporter = createTransport(
			sgTransport({
				secure: true,
				auth: {
					api_key: process.env.SENDGRID_API_KEY,
				},
			})
		);
	}

	public async sendVerificationMail(emailPayload: MailI): Promise<void> {
		const { to, text, subject } = emailPayload;

		const sent = await this.transporter.sendMail({
			from: 'noreply@scanthepulp.com',
			to,
			subject,
			text,
		});

		const { message } = sent;

		if (message !== 'success')
			throw new BadRequestException(errorMessage.mailNotSent);
	}

	public async sendMailWithTemplate(emailPayload: MailI): Promise<void> {
		const { to, subject, html } = emailPayload;

		const sent = await this.transporter.sendMail({
			from: 'noreply@scanthepulp.com',
			to,
			subject: `${subject}`,
			html,
		});

		const { message } = sent;

		if (message !== 'success')
			throw new BadRequestException(errorMessage.mailNotSent);
	}

	generateVerifyUrl(token: string): string {
		return `${process.env.BASE_API_URL}/users/mail-verification?bearer=${token}`;
	}

	renameObjectKey(object: any, key: string, newKey: string): any {
		const clonedObject = Object.assign({}, object);
		const targetKey = clonedObject[key];
		delete clonedObject[key];
		clonedObject[newKey] = targetKey;
		return clonedObject;
	}
}
