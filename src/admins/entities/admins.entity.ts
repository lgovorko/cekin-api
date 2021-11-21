import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { RoleE } from '../../shared/enum';

@Entity({
  name: 'admins',
})
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    name: 'username',
  })
  username: string;

  @Column({
    type: 'varchar',
    name: 'password',
  })
  password: string;

  @Column({
    type: 'int',
    name: 'role',
    default: () => `${RoleE.ADMIN}`,
  })
  role: number;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: string;
}
