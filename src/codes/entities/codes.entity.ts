import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	Index,
	UpdateDateColumn,
	CreateDateColumn,
} from 'typeorm';
import { CodeStatusE } from '../enum/codes-status.enum';
import { CodeTypeE } from '../enum/codes-type.enum';

@Entity({
	name: 'codes',
})
export class Code {
	@PrimaryGeneratedColumn()
	id: number;

	@Index({ unique: true })
	@Column({
		type: 'varchar',
		name: 'code',
	})
	code: string;

	@Column({
		type: 'int',
		name: 'status',
		default: () => `${CodeStatusE.UNUSED}`,
	})
	status: number;

	@Column({
		type: 'int',
		name: 'type',
		default: () => `${CodeTypeE.GAVELINO}`,
	})
	type: number;

	@UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
	updatedAt: string;

	@CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
	createdAt: string;
}
