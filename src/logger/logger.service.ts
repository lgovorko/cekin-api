import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import * as winston from 'winston';
import { LoggerErrorI, LoggerI } from './interfaces';

@Injectable()
export class LoggerService {
  private readonly instance: winston.Logger;

  constructor() {
    const now = moment().format('YYYY-MM-DD');
    this.instance = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console({
          stderrLevels: ['error'],
        }),
        new winston.transports.File({
          filename: `${process.env.ROOT_PATH}/logs/error-${now}.log`,
          level: 'error',
        }),
        new winston.transports.File({
          filename: `${process.env.ROOT_PATH}/logs/info-${now}.log`,
          level: 'info',
        }),
      ],
    });
  }

  log(logData: LoggerI): winston.Logger {
    const now = moment();
    const { url, userId } = logData;
    return this.instance.info(
      `Date: ${now.format(
        'YYYY-MM-DD HH:mm:ss',
      )} | Url: ${url} | userId: ${userId}`,
    );
  }

  error(logData: LoggerErrorI): winston.Logger {
    const now = moment();
    const { message, url } = logData;
    return this.instance.error(
      `Date: ${now.format(
        'YYYY-MM-DD HH:mm:ss',
      )} | Message: ${message} | Url: ${url}`,
    );
  }
}
