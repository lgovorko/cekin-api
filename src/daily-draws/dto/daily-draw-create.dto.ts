import { ApiProperty } from '@nestjs/swagger';
import {
	IsNumber,
	IsString,
	IsDefined,
	IsOptional,
	IsIn,
} from 'class-validator';
import { DailyDrawStatusE } from '../enum';

export class DailyDrawCreateDTO {
	@ApiProperty()
	@IsDefined()
	@IsNumber()
	prizeId: number;

	@ApiProperty()
	@IsOptional()
	@IsIn([DailyDrawStatusE.ACTIVE, DailyDrawStatusE.INACTIVE])
	@IsNumber()
	status: number;

	@ApiProperty()
	@IsNumber()
	type: number;

	@ApiProperty()
	@IsDefined()
	@IsString()
	drawDate: string;
}
