import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { DrawWinnersEmbeddedDTO } from '../../draw-winners/dto';

export class DailyDrawDTO {
	@ApiProperty()
	id: number;

	@ApiProperty()
	prizeId: number;

	@ApiProperty()
	status: number;

	@ApiProperty()
	type: number;

	@ApiProperty()
	drawDate: string;

	@ApiProperty()
	updatedAt: string;

	@ApiProperty()
	createdAt: string;
}

export class DailyDrawEmbeddedDTO {
	@ApiProperty()
	id: number;

	@ApiProperty()
	prizeId: number;

	@ApiProperty()
	status: number;

	@ApiProperty()
	drawDate: string;

	@ApiProperty()
	updatedAt: string;

	@ApiProperty()
	createdAt: string;

	@ApiProperty()
	@Type(() => DrawWinnersEmbeddedDTO)
	drawWinnersEmbeddedDTO: DrawWinnersEmbeddedDTO;
}
