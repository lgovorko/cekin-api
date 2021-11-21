import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { UserStatusE, UserGenderE } from '../enum';
import { RoleE } from '../../shared/enum';
import { UserDrawQualification } from '../../user-draw-qualifications/entities/user-draw-qualifications.entity';
import { UserQuiz } from '../../user-quiz/entities/user-quiz.entity';
import { DrawWinner } from '../../draw-winners/entities/draw-winners.entity';
import { UserCode } from '../../user-code/entities/user-code.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({
    type: 'bigint',
    name: 'facebook_id',
    nullable: true,
  })
  facebookId: number;

  @Index({ unique: true })
  @Column({
    type: 'bigint',
    name: 'google_id',
    nullable: true,
  })
  googleId: number;

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    name: 'username',
    nullable: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    name: 'password',
    nullable: true,
  })
  password: string;

  @Column({
    type: 'int',
    name: 'status',
    default: () => `${UserStatusE.ACTIVE}`,
  })
  status: number;

  @Column({
    type: 'int',
    name: 'role',
    default: () => `${RoleE.USER}`,
  })
  role: number;

  @Column({
    type: 'varchar',
    name: 'first_name',
    nullable: true,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    name: 'last_name',
    nullable: true,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    name: 'birth_date',
    nullable: true,
  })
  birthDate: string;

  @Column({
    type: 'int',
    name: 'gender',
    default: () => `${UserGenderE.NOT_DEFINED}`,
  })
  gender: number;

  @Column({
    type: 'varchar',
    name: 'phone_number',
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    type: 'varchar',
    name: 'address',
    nullable: true,
  })
  address: string;

  @Column({
    type: 'varchar',
    name: 'city',
    nullable: true,
  })
  city: string;

  @Column({
    type: 'int',
    name: 'postal_number',
    nullable: true,
  })
  postalNumber: number;

  @Column({
    type: 'bool',
    name: 'is_verified',
    default: () => 'false',
  })
  isVerified: boolean;

  @Column({
    type: 'bool',
    name: 'use_terms',
    default: () => 'false',
  })
  useTerms: boolean;

  @Column({
    type: 'bool',
    name: 'privacy_terms',
    default: () => 'false',
  })
  privacyTerms: boolean;

  @Column({
    type: 'bool',
    name: 'prize_terms',
    default: () => 'false',
  })
  prizeTerms: boolean;

  @Column({
    type: 'bool',
    name: 'personal_terms',
    default: () => 'false',
  })
  personalTerms: boolean;

  @Column({
    type: 'bool',
    name: 'advert_terms',
    nullable: true,
    default: () => 'false',
  })
  advertTerms: boolean;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: string;

  @OneToMany(
    () => UserDrawQualification,
    (UserDrawQualification: UserDrawQualification) =>
      UserDrawQualification.user,
  )
  UserDrawQualifications: UserDrawQualification[];

  @OneToMany(
    () => UserQuiz,
    (userQuiz: UserQuiz) => userQuiz.user,
  )
  userQuizzes: UserQuiz[];

  @OneToMany(
    () => DrawWinner,
    (drawWinner: DrawWinner) => drawWinner.user,
  )
  drawWinners: DrawWinner[];

  @OneToMany(
    () => UserCode,
    (userCode: UserCode) => userCode.user,
  )
  userCodes: UserCode[];
}
