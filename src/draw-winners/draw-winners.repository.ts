import { EntityRepository, Repository } from "typeorm";
import { DrawWinner } from "./entities/draw-winners.entity";


@EntityRepository(DrawWinner)
export class DrawWinnerRepository extends Repository<DrawWinner> {}