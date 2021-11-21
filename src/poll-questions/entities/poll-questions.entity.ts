import { PollCategory } from '../../poll-categories/entities/poll-categories.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'poll_questions',
})
export class PollQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    name: 'poll_category_id',
  })
  pollCategoryId: number;

  @Column({
    type: 'varchar',
    name: 'question',
  })
  question: string;

  @Column({
    type: 'int',
    name: 'min_answers',
    default: () => `1`,
  })
  minAnswers: number; // minimal number of answers required

  @Column({
    type: 'int',
    name: 'max_answers',
    default: () => `1`,
  })
  maxAnswers: number;

  @Column({
    type: 'varchar',
    name: 'answers',
  })
  answers: string;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: string;

  @ManyToOne(
    () => PollCategory,
    (pollCategory: PollCategory) => pollCategory.pollQuestions,
  )
  @JoinColumn({ name: 'poll_category_id' })
  pollCategory: PollCategory;
}
