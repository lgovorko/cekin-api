import { UserDrawQualification } from '../../user-draw-qualifications/entities/user-draw-qualifications.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserPollStatusE } from '../enum';

@Entity({
  name: 'user_poll',
})
export class UserPoll {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    name: 'user_id',
  })
  userId: number;

  @Column({
    type: 'int',
    name: 'poll_category_id',
  })
  pollCategoryId: number;

  @Column({
    type: 'varchar',
    name: 'answers',
    nullable: true,
  })
  answers: string;

  @Column({
    type: 'int',
    name: 'status',
    default: () => `${UserPollStatusE.PENDING}`,
  })
  status: number;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: string;

  @OneToOne(
    () => UserDrawQualification,
    (userDrawQualification: UserDrawQualification) =>
      userDrawQualification.userPoll,
  )
  userDrawQualification: UserDrawQualification;
}
