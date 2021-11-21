import * as handlebars from 'handlebars';
import { readFile } from 'fs-extra';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
  private readHTMLFile(path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      readFile(path, { encoding: 'utf-8' }, (err: Error, html: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(html);
        }
      });
    });
  }

  public async createTemplate(path: string, data: any): Promise<string> {
    try {
      const html = await this.readHTMLFile(path);
      const template = handlebars.compile(html);
      return template(data);
    } catch (error) {
      throw error;
    }
  }
}
