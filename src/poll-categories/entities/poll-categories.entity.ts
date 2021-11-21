import { PollQuestion } from '../../poll-questions/entities/poll-questions.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PollCategoryStatusE } from '../enum';

@Entity({
  name: 'poll_categories',
})
export class PollCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    name: 'title',
    unique: true,
  })
  title: string;

  @Column({
    type: 'int',
    name: 'status',
    default: () => `${PollCategoryStatusE.UNLOCKED}`,
  })
  status: number;

  @Column({
    type: 'bool',
    name: 'extra_qualification',
    default: () => `true`,
  })
  extraQualification: boolean;

  @Column({
    type: 'int',
    name: 'qualification_reward',
  })
  qualificationReward: number;

  @Column({
    type: 'int',
    name: 'number_of_codes_required',
    default: () => `0`,
  })
  numberOfCodesRequired: number; // number of codes for unlocking poll

  @Column({
    type: 'varchar',
    name: 'code_types',
    nullable: true,
  })
  codeTypes: string;

  @Column({
    type: 'int',
    name: 'ordinal_number',
    default: () => `1`
  })
  ordinalNumber: number;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: string;

  @OneToMany(
    () => PollQuestion,
    (pollQuestion: PollQuestion) => pollQuestion.pollCategory,
  )
  pollQuestions: PollQuestion[];
}
