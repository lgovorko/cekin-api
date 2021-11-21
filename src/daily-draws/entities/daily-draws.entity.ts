import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	UpdateDateColumn,
	CreateDateColumn,
	Index,
	ManyToOne,
	JoinColumn,
	OneToMany,
} from 'typeorm';
import { DailyDrawStatusE } from '../enum/daily-draw-status.enum';
import { Prize } from '../../prizes/entities/prizes.entity';
import { UserDrawQualification } from '../../user-draw-qualifications/entities/user-draw-qualifications.entity';
import { DrawWinner } from '../../draw-winners/entities/draw-winners.entity';
import { DrawType } from '../enum/draw-type.enum';

@Entity()
export class DailyDraw {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'int',
		name: 'prize_id',
	})
	prizeId: number;

	@Column({
		type: 'int',
		name: 'status',
		default: () => `${DailyDrawStatusE.ACTIVE}`,
	})
	status: number;

	@Column({
		type: 'varchar',
		name: 'draw_date',
	})
	drawDate: string;

	@Column({
		type: 'varchar',
		name: 'type',
		default: DrawType.DAILY,
	})
	type: string;

	@UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
	updatedAt: string;

	@CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
	createdAt: string;

	@ManyToOne(
		() => Prize,
		(prize: Prize) => prize.dailyDraws
	)
	@JoinColumn({ name: 'prize_id' })
	prize: Prize;

	@OneToMany(
		() => DailyDraw,
		(dailyDraw: DailyDraw) => dailyDraw.userDrawQualifications
	)
	userDrawQualifications: UserDrawQualification[];

	@OneToMany(
		() => DrawWinner,
		(drawWinner: DrawWinner) => drawWinner.dailyDraw
	)
	drawWinner: DrawWinner[];
}
