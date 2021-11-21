import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { DailyDraw } from '../../daily-draws/entities/daily-draws.entity';
import { DrawWinner } from '../../draw-winners/entities/draw-winners.entity';
import { PrizeTypeE } from '../enum/prizes-type.enum';
import { PrizeStatusE } from '../enum';

@Entity({
  name: 'prizes',
})
export class Prize {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    name: 'name',
  })
  name: string;

  @Column({
    type: 'varchar',
    name: 'description',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'int',
    name: 'type',
    default: () => `${PrizeTypeE.LOW_VALUE}`,
  })
  type: number;

  @Column({
    type: 'int',
    name: 'status',
    default: () => `${PrizeStatusE.ACTIVE}`,
  })
  status: number;

  @Column({
    type: 'int',
    name: 'total_count',
  })
  totalCount: number;

  @Column({
    type: 'int',
    name: 'total_spent',
    default: () => '0',
  })
  totalSpent: number;

  @Column({
    type: 'varchar',
    name: 'image_filename',
    nullable: true,
  })
  imageFilename: string;

  @Column({
    type: 'varchar',
    name: 'image_path',
    nullable: true,
  })
  imagePath: string;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: string;

  @OneToMany(
    () => DailyDraw,
    (dailyDraw: DailyDraw) => dailyDraw.prize,
  )
  dailyDraws: DailyDraw[];

  @OneToMany(
    () => DrawWinner,
    (drawWinner: DrawWinner) => drawWinner.prize,
  )
  drawWinners: DrawWinner[];
}
