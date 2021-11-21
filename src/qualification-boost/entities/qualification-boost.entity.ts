import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'qualification_boost',
})
export class QualificationBoost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    name: 'start_datetime',
  })
  startDateTime: string;

  @Column({
    type: 'varchar',
    name: 'end_datetime',
  })
  endDateTime: string;

  @Column({
    type: 'int',
    name: 'min_postal_number',
  })
  minPostalNumber: number;

  @Column({
    type: 'int',
    name: 'max_postal_number',
  })
  maxPostalNumber: number;

  @Column({
    type: 'varchar',
    name: 'code_types',
  })
  codeTypes: string;

  @Column({
    type: 'int',
    name: 'number_of_qualifications',
  })
  numberOfQualifications: number;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: string;
}
