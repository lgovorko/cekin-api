import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserDrawQualification } from '../../user-draw-qualifications/entities/user-draw-qualifications.entity';
import { User } from '../../users/entities/users.entity';

@Entity()
export class UserCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    name: 'user_id',
  })
  userId: number;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'code',
    unique: true,
  })
  code: string | null;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'user_entry',
  })
  userEntry: string;

  @Column({
    type: 'int',
    nullable: false,
    unsigned: true,
    name: 'status',
  })
  status: number;

  @Column({
    type: 'int',
    name: 'code_type',
    nullable: true,
  })
  codeType: number;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: string;

  @OneToOne(
    () => UserDrawQualification,
    (userDrawQualification: UserDrawQualification) =>
      userDrawQualification.userCode,
  )
  userDrawQualification: UserDrawQualification;

  @ManyToOne(
    () => User,
    (user: User) => user.userCodes,
  )
  @JoinColumn({ name: 'user_id' })
  user: User;
}
