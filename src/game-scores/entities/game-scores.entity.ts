import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GameScoreStatusE } from '../enum';

@Entity({
  name: 'game_scores',
})
export class GameScore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    name: 'username',
    nullable: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    name: 'email',
    nullable: true,
  })
  email: string;

  @Column({
    type: 'int',
    name: 'score',
    nullable: true,
  })
  score: number;

  @Column({
    type: 'int',
    name: 'status',
    nullable: true,
    default: () => `${GameScoreStatusE.STARTED}`,
  })
  status: number;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: string;
}
