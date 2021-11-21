import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Question } from '../../questions/entities/questions.entity';
import { UserQuiz } from '../../user-quiz/entities/user-quiz.entity';
import { DailyDraw } from '../../daily-draws/entities/daily-draws.entity';
import { DrawWinner } from '../../draw-winners/entities/draw-winners.entity';
import { UserCode } from '../../user-code/entities/user-code.entity';
import { UserPoll } from '../../user-poll/entities/user-poll.entity';

@Index(['userId', 'code'], { unique: true })
@Entity({
  name: 'user_draw_qualifications',
})
export class UserDrawQualification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    name: 'user_id',
  })
  userId: number;

  @Column({
    type: 'int',
    name: 'user_quiz_id',
    nullable: true,
  })
  userQuizId: number;

  @Column({
    type: 'int',
    name: 'daily_draw_id',
    nullable: true,
  })
  dailyDrawId: number;

  @Column({
    type: 'int',
    name: 'user_code_id',
    nullable: true,
  })
  userCodeId: number;

  @Column({
    type: 'int',
    name: 'user_poll_id',
    nullable: true,
  })
  userPollId: number;

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    name: 'code',
    nullable: true,
  })
  code: string;

  @Column({
    type: 'int',
    name: 'type',
  })
  type: number; // code type

  @Column({
    type: 'boolean',
    name: 'extra_spent',
    default: () => 'false',
  })
  extraSpent: boolean;

  @Column({
    type: 'int',
    name: 'qualifications_count',
    default: () => '1',
  })
  qualificationsCount: number;

  @Column({
    type: 'boolean',
    name: 'quiz_finished',
    default: () => 'false',
  })
  quizFinished: boolean;

  @Column({
    type: 'int',
    name: 'quiz_correct_answers',
    default: () => '0',
  })
  quizCorrectAnswers: number;

  @Column({
    type: 'boolean',
    name: 'is_shared',
    default: () => 'false',
  })
  isShared: boolean;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: string;

  @ManyToOne(
    () => User,
    (user: User) => user.UserDrawQualifications,
  )
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(
    () => UserQuiz,
    (userQuiz: UserQuiz) => userQuiz.userDrawQualifications,
  )
  @JoinColumn({ name: 'user_quiz_id' })
  question: Question;

  @ManyToOne(
    () => DailyDraw,
    (dailyDraw: DailyDraw) => dailyDraw.userDrawQualifications,
  )
  @JoinColumn({ name: 'daily_draw_id' })
  dailyDraw: DailyDraw;

  @OneToMany(
    () => DrawWinner,
    (drawWinner: DrawWinner) => drawWinner.userDrawQualification,
  )
  drawWinners: DailyDraw[];

  @OneToOne(
    () => UserCode,
    (userCode: UserCode) => userCode.userDrawQualification,
  )
  @JoinColumn({ name: 'user_code_id' })
  userCode: UserCode;

  @OneToOne(
    () => UserPoll,
    (userPoll: UserPoll) => userPoll.userDrawQualification,
  )
  @JoinColumn({ name: 'user_poll_id' })
  userPoll: number;
}
