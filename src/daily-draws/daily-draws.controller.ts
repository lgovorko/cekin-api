import {
	Controller,
	UseGuards,
	Post,
	Body,
	UseInterceptors,
	Patch,
	Param,
	Delete,
	Get,
	Query,
	CacheInterceptor,
} from '@nestjs/common';
import { DailyDraw } from './entities/daily-draws.entity';
import { Crud } from '@nestjsx/crud';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/roles.guard';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import {
	DailyDrawDTO,
	DailyDrawCreateDTO,
	DailyDrawUpdateDTO,
	DailyDrawStatsDTO,
} from './dto';
import { DailyDrawsService } from './daily-draws.service';
import { CustomDailyDrawResponseDTO } from './dto/daily-draws-custom.dto';
import { PaginationI } from '../shared/interfaces';

@Crud({
	model: {
		type: DailyDraw,
	},
	query: {
		limit: 200,
		sort: [],
		join: {
			prize: {
				required: false,
			},
		},
	},
	routes: {
		getOneBase: {
			decorators: [
				Roles('SUPERADMIN', 'ADMIN'),
				UseGuards(JwtAuthGuard, RoleGuard),
				ApiOkResponse({ type: DailyDrawDTO }),
			],
			interceptors: [new TransformInterceptor(DailyDrawDTO)],
		},
		getManyBase: {
			decorators: [
				Roles('SUPERADMIN', 'ADMIN'),
				UseGuards(JwtAuthGuard, RoleGuard),
				ApiOkResponse({ type: [DailyDrawDTO] }),
			],
			interceptors: [new TransformInterceptor(DailyDrawDTO)],
		},
		only: ['getOneBase', 'getManyBase'],
	},
})
@ApiTags('daily-draws')
@Controller('daily-draws')
export class DailyDrawsController {
	constructor(private readonly service: DailyDrawsService) {}

	@ApiOkResponse({ type: [DailyDrawStatsDTO] })
	@UseInterceptors(new TransformInterceptor(DailyDrawStatsDTO))
	@Get('stats/:dailyDrawId')
	getDailyrawStats(@Param('dailyDrawId') dailyDrawId: string): Promise<any> {
		return this.service.getDailyDrawStats(+dailyDrawId);
	}

	@ApiOkResponse({ type: DailyDrawDTO })
	@UseInterceptors(new TransformInterceptor(DailyDrawDTO))
	@Get('history/web')
	getDailyDrawHistory(): Promise<DailyDraw[]> {
		return this.service.getDailyDrawHistory();
	}

	@ApiOkResponse({ type: CustomDailyDrawResponseDTO })
	@UseInterceptors(new TransformInterceptor(CustomDailyDrawResponseDTO))
	@Get('web')
	getDailyDrawsWithPrize(
		@Query() queryStringPayload: PaginationI
	): Promise<CustomDailyDrawResponseDTO> {
		return this.service.getDailyDrawsWithPrize(queryStringPayload);
	}

	@ApiOkResponse({ type: DailyDrawDTO })
	@UseInterceptors(new TransformInterceptor(DailyDrawDTO))
	@Get('web/:dailyDrawId')
	getDailyDrawWithPrize(
		@Param('dailyDrawId') dailyDrawId: number
	): Promise<DailyDrawDTO> {
		return this.service.getDailyDrawWithPrize(dailyDrawId);
	}

	@Roles('SUPERADMIN', 'ADMIN')
	@UseGuards(JwtAuthGuard, RoleGuard)
	@ApiOkResponse({ type: DailyDrawDTO })
	@UseInterceptors(new TransformInterceptor(DailyDrawDTO))
	@Post()
	createDailyDraw(
		@Body() dailyDrawPayload: DailyDrawCreateDTO
	): Promise<DailyDrawDTO> {
		return this.service.createDailyDraw(dailyDrawPayload);
	}

	@Roles('SUPERADMIN', 'ADMIN')
	@UseGuards(JwtAuthGuard, RoleGuard)
	@ApiOkResponse({ type: DailyDrawDTO })
	@UseInterceptors(new TransformInterceptor(DailyDrawDTO))
	@Patch(':dailyDrawId')
	updateDailyDraw(
		@Param('dailyDrawId') dailyDrawId: number,
		@Body() dailyDrawPayload: DailyDrawUpdateDTO
	): Promise<DailyDrawDTO> {
		return this.service.updateDailyDraw(dailyDrawId, dailyDrawPayload);
	}

	@Roles('SUPERADMIN', 'ADMIN')
	@UseGuards(JwtAuthGuard, RoleGuard)
	@ApiOkResponse({ type: DailyDrawDTO })
	@UseInterceptors(new TransformInterceptor(DailyDrawDTO))
	@Delete(':dailyDrawId')
	deleteDailyDraw(
		@Param('dailyDrawId') dailyDrawId: number
	): Promise<DailyDraw> {
		return this.service.deleteDailyDraw(dailyDrawId);
	}
}
