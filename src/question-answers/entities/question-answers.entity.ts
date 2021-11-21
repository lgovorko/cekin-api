import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Question } from '../../questions/entities/questions.entity';

@Entity({
  name: 'question_answers',
})
export class QuestionAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    name: 'question_id',
  })
  questionId: number;

  @Column({
    type: 'varchar',
    name: 'answer',
  })
  answer: string;

  @Column({
    type: 'bool',
    name: 'correct',
  })
  correct: boolean;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: string;

  @ManyToOne(
    () => Question,
    (question: Question) => question.questionAnswers,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'question_id' })
  question: Question;
}
