import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import {
  GameScoreFinishDTO,
  GameScoreDTO,
  GameScoreLeaderboardDTO,
} from './dto';
import { GameScoresService } from './game-scores.service';

@Controller('game-scores')
export class GameScoresController {
  constructor(private readonly service: GameScoresService) {}

  @ApiOkResponse({ type: GameScoreDTO })
  @UseInterceptors(new TransformInterceptor(GameScoreDTO))
  @Post('start')
  startGame(): Promise<GameScoreDTO> {
    return this.service.startGame();
  }

  @ApiOkResponse({ type: GameScoreDTO })
  @UseInterceptors(new TransformInterceptor(GameScoreDTO))
  @Patch('finish/:gameScoreId')
  finishGame(
    @Param('gameScoreId') gameScoreId: number,
    @Body() gameScorePayload: GameScoreFinishDTO,
  ): Promise<GameScoreDTO> {
    return this.service.finishGame(gameScoreId, gameScorePayload);
  }

  @ApiOkResponse({ type: [GameScoreLeaderboardDTO] })
  @UseInterceptors(new TransformInterceptor(GameScoreLeaderboardDTO))
  @Get('leaderboard')
  getLeaderboard(
    @Query() queryPayload: { from: string; to: string },
  ): Promise<GameScoreLeaderboardDTO> {
    return this.service.getLeaderboard(queryPayload);
  }
}
