import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Prize } from '../../prizes/entities/prizes.entity';
import { UserDrawQualification } from '../../user-draw-qualifications/entities/user-draw-qualifications.entity';
import { DailyDraw } from '../../daily-draws/entities/daily-draws.entity';
import { DrawWinnerStatusE } from '../enum/draw-winners.enum';

@Entity({
  name: 'draw_winners',
})
export class DrawWinner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    name: 'user_id',
  })
  userId: number;

  @Column({
    type: 'int',
    name: 'user_draw_qualification_id',
    nullable: true,
  })
  userDrawQualificationId: number;

  @Column({
    type: 'int',
    name: 'prize_id',
  })
  prizeId: number;

  @Column({
    type: 'int',
    name: 'daily_draw_id',
    nullable: true,
  })
  dailyDrawId: number;

  @Column({
    type: 'int',
    name: 'status',
    default: () => `${DrawWinnerStatusE.UNCONFIRMED}`,
  })
  status: number;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: string;

  @ManyToOne(
    () => User,
    (user: User) => user.drawWinners,
  )
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(
    () => Prize,
    (prize: Prize) => prize.dailyDraws,
  )
  @JoinColumn({ name: 'prize_id' })
  prize: Prize;

  @ManyToOne(
    () => UserDrawQualification,
    (userDrawQualification: UserDrawQualification) =>
      userDrawQualification.drawWinners,
  )
  @JoinColumn({ name: 'user_draw_qualification_id' })
  userDrawQualification: UserDrawQualification;

  @ManyToOne(
    () => DailyDraw,
    (dailyDraw: DailyDraw) => dailyDraw.drawWinner,
  )
  @JoinColumn({ name: 'daily_draw_id' })
  dailyDraw: DailyDraw;
}
