import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';

export const renameFilename = (
  req: Request,
  file: Express.Multer.File,
  callback,
) => {
  const { originalname } = file;
  const extension = originalname.split('.').pop();
  const randomUuid = uuidv4();
  const newFilename = `${randomUuid}.${extension}`;
  callback(null, newFilename);
};

export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: any,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new BadRequestException('Only image files are allowed!'),
      false,
    );
  }

  callback(null, true);
};

export const removeRootDirFromPath = (path: string) => {
  const pathArr = path.split('/');
  pathArr.shift();
  const newPath =  pathArr.join('/');
  return `/${newPath}`;
};
