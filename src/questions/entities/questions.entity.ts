import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { QuestionAnswer } from '../../question-answers/entities/question-answers.entity';

@Entity({
  name: 'questions',
})
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    name: 'question',
  })
  question: string;

  @Column({
    type: 'int',
    name: 'status',
    default: () => `1`
  })
  status: number;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: string;

  @OneToMany(
    () => QuestionAnswer,
    (questionAnswer: QuestionAnswer) => questionAnswer.question,
  )
  questionAnswers: QuestionAnswer[];
}
