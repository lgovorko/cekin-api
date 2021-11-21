import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import * as moment from 'moment';
import * as cryptoJS from 'crypto-js';
import * as BadWords from 'bad-words';
import { badWordsData } from '../shared/data/bad-words';

import {
  GameScoreFinishDTO,
  GameScoreDTO,
  GameScoreLeaderboardDTO,
} from './dto';
import { GameScore } from './entities/game-scores.entity';
import { GameScoreRepository } from './game-scores.repository';
import { errorMessage } from '../shared/error-messages/error-messages';
import { GameScoreStatusE } from './enum';

@Injectable()
export class GameScoresService extends TypeOrmCrudService<GameScore> {
  private filter;

  constructor(
    @InjectRepository(GameScoreRepository)
    private gameScoreRepository: GameScoreRepository,
  ) {
    super(gameScoreRepository);
    this.filter = new BadWords();
    this.filter.addWords(...badWordsData);
  }

  public async startGame(): Promise<GameScoreDTO> {
    return this.gameScoreRepository.save({});
  }

  public async finishGame(
    gameScoreId: number,
    gameScorePayload: GameScoreFinishDTO,
  ): Promise<GameScoreDTO> {

    const gameScore: GameScore = await this.gameScoreRepository.findOne(
      gameScoreId,
    );

    if (!gameScore)
      throw new NotFoundException(errorMessage.gameScoresNotFound);

    const { status: gameScoreStatus } = gameScore;

    if (gameScoreStatus === GameScoreStatusE.FINISHED)
      throw new BadRequestException(errorMessage.gameAlreadyFinished);

    const decrypted = this.decode(JSON.stringify(gameScorePayload));

    if (!decrypted)
      throw new BadRequestException('Problem prilikom dekriptiranja podataka');

    const decryptedGameScorePayload = JSON.parse(decrypted);

    const { username } = decryptedGameScorePayload;

    const filteredUsername = this.filter.clean(username);

    return this.gameScoreRepository.save({
      ...gameScore,
      ...decryptedGameScorePayload,
      username: filteredUsername,
      status: GameScoreStatusE.FINISHED,
    });
  }

  // public testEncryption() {
  //   const src = {
  //     username: 'kurac',
  //     email: 'dino@protonmail.com',
  //     score: 950,
  //   };

  //   const str = JSON.stringify(src);
  //   const enc = this.encode(str);
  //   console.log(enc);
  //   const dec = this.decode(enc);
  //   console.log(dec, ' dec');
  // }

  // private encode(data: string): any {
  //   return this.encrypt(data, `${process.env.AES_KEY}`);
  // }

  private decode(data: string): string {
    return cryptoJS.AES.decrypt(data, `${process.env.AES_KEY}`, {
      format: this.CryptoJSAesJson,
    }).toString(cryptoJS.enc.Utf8);
  }

  // private encrypt(data: string, secret: string) {
  //   return cryptoJS.AES.encrypt(data, secret, {
  //     format: this.CryptoJSAesJson,
  //   }).toString();
  // }

  // private decrypt(data: string, key: string): string {
  //   return cryptoJS.AES.decrypt(data, key, {
  //     format: this.CryptoJSAesJson,
  //   }).toString(cryptoJS.enc.Utf8);
  // }

  private CryptoJSAesJson = {
    stringify: cipherParams => {
      const j: any = {
        ct: cipherParams.ciphertext.toString(cryptoJS.enc.Base64),
      };
      if (cipherParams.iv) {
        j.iv = cipherParams.iv.toString();
      }
      if (cipherParams.salt) {
        j.s = cipherParams.salt.toString();
      }
      return JSON.stringify(j);
    },
    parse: jsonStr => {
      const j = JSON.parse(jsonStr);
      const cipherParams = (cryptoJS as any).lib.CipherParams.create({
        ciphertext: cryptoJS.enc.Base64.parse(j.ct),
      });
      if (j.iv) {
        cipherParams.iv = cryptoJS.enc.Hex.parse(j.iv);
      }
      if (j.s) {
        cipherParams.salt = cryptoJS.enc.Hex.parse(j.s);
      }
      return cipherParams;
    },
  };

  public async getLeaderboard({
    from = moment().format('YYYY-MM-DD'),
    to = moment().format('YYYY-MM-DD'),
  }: {
    from: string;
    to: string;
  }): Promise<GameScoreLeaderboardDTO> {
    return this.gameScoreRepository.getLeaderboard({ from, to });
  }
}
