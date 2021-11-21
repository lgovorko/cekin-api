import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import * as moment from 'moment';

import { User } from '../../users/entities/users.entity';
import { UserQuizStatusE } from '../enum';
import { UserDrawQualification } from '../../user-draw-qualifications/entities/user-draw-qualifications.entity';

@Entity()
export class UserQuiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    name: 'user_id',
  })
  userId: number;

  @Column({
    type: 'int',
    name: 'status',
    default: () => `${UserQuizStatusE.ACTIVE}`,
  })
  status: number;

  @Column({
    type: 'varchar',
    name: 'answers',
    nullable: true,
  })
  answers: string;

  @Column({
    type: 'int',
    name: 'question_start_timestamp',
  })
  questionStartTimestamp: number;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: string;

  @ManyToOne(
    () => User,
    (user: User) => user.userQuizzes,
  )
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(
    () => UserDrawQualification,
    (userDrawQualification: UserDrawQualification) => userDrawQualification,
  )
  userDrawQualifications: UserDrawQualification[];
}
