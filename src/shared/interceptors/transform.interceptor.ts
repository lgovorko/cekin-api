import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { LoggerService } from '../../logger/logger.service';
import { Request, Response } from 'express';

type ClassType<T> = new () => T;

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<Partial<T>, T> {
  private logger = new LoggerService();

  constructor(private readonly classType: ClassType<T>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    return next.handle().pipe(
      map(res => {
        const { data } = res;

        const http = context.switchToHttp();
        const response: Response = http.getResponse();
        const req = response.req;

        const { user, url } = req;

        let userId;

        if (user) {
          const { userId: id } = user as { userId; username; role };
          userId = id;
        }

        this.logger.log({
          url,
          userId,
        });

        if (res?.data) {
          return {
            ...res,
            data: plainToClass(this.classType, data, {
              enableImplicitConversion: true,
            }),
          };
        }
        return plainToClass(this.classType, JSON.parse(JSON.stringify(res)), {
          enableImplicitConversion: true,
        });
      }),
    );
  }
}
