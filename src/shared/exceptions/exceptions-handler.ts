import {
	Catch,
	ExceptionFilter,
	ArgumentsHost,
	BadRequestException,
	UnauthorizedException,
	NotFoundException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';
import { LoggerService } from '../../logger/logger.service';

@Catch()
export class ExceptionsHandler implements ExceptionFilter {
	private logger = new LoggerService();

	catch(
		exception: unknown,
		host: ArgumentsHost
	): Response<{ statusCode: number; message: string; error?: string }> {
		const ctx = host.switchToHttp();
		const response: Response = ctx.getResponse();

		const { user, url } = response.req;
		console.log(exception, ' ex');
		if (exception instanceof QueryFailedError)
			return this.queryErrorHandler(response, exception, {
				userId: this.userExist(user as { userId; username; role }),
				url,
			});

		if (exception instanceof BadRequestException)
			return this.badRequestHandler(response, exception, {
				userId: this.userExist(user as { userId; username; role }),
				url,
			});

		if (exception instanceof UnauthorizedException) {
			return this.unautorizedException(response, exception, {
				userId: this.userExist(user as { userId; username; role }),
				url,
			});
		}

		if (exception instanceof NotFoundException)
			return this.notFoundException(response, exception, {
				userId: this.userExist(user as { userId; username; role }),
				url,
			});

		if (exception instanceof TypeError)
			return this.typeErrorException(response, exception, {
				userId: this.userExist(user as { userId; username; role }),
				url,
			});

		const errorMessage = exception.toString();

		this.logger.error({
			message: errorMessage,
			userId: this.userExist(user as { userId; username; role }),
			url,
		});

		return response.status(500).json({
			statusCode: 500,
			message: errorMessage,
		});
	}

	userExist(user: { userId; username; role }): any {
		if (!user) return null;
		const { userId } = user;
		return userId;
	}

	private queryErrorHandler(
		res: Response,
		exception: any,
		logData: any
	): Response<any> {
		let message: string;

		const { code, detail } = exception;

		switch (+code) {
			case 23505:
				message = `Duplicate Key entry. ${detail}`;
			case 23503:
				message = `Not Found. ${detail}`;
			case 23502:
				message = `Not Null Violation. ${detail}`;
		}

		if (code === '22P02') message = `${exception.toString()}`;

		const { userId, url } = logData;

		this.logger.error({
			message,
			userId,
			url,
		});

		return res.status(400).json({
			statusCode: 400,
			message,
			error: 'QueryFailedError.',
		});
	}

	private badRequestHandler(
		res: Response,
		exception: any,
		logData: any
	): Response<any> {
		const { response } = exception;
		const { statusCode } = response;

		const { userId, url } = logData;

		this.logger.error({
			message: JSON.stringify(response),
			userId,
			url,
		});

		return res.status(statusCode).json(response);
	}

	private unautorizedException(
		res: Response,
		exception: any,
		logData: any
	): Response<any> {
		const { response } = exception;

		const { statusCode } = response;

		const { userId, url } = logData;

		this.logger.error({
			message: JSON.stringify(response),
			userId,
			url,
		});

		return res.status(statusCode).json({
			...response,
			error: 'UnauthorizedException',
		});
	}

	private notFoundException(res: Response, exception: any, logData: any) {
		const { response } = exception;

		const { statusCode } = response;

		const { userId, url } = logData;

		this.logger.error({
			message: JSON.stringify(response),
			userId,
			url,
		});

		return res.status(statusCode).json(response);
	}

	private typeErrorException(res: Response, exception, logData: any) {
		const message = exception.toString();
		const { userId, url } = logData;

		this.logger.error({
			message,
			userId,
			url,
		});

		return res.status(500).json({
			statusCode: 500,
			message: exception.toString(),
			error: 'TypeError',
		});
	}
}
