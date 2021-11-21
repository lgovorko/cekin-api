import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import * as moment from "moment";

export class CustomCodesDTO {
    @ApiProperty()
    type: number;

    @ApiProperty()
    @Transform(v => moment(v).format('YYYY-MM-DD'))
    date: string;

    @ApiProperty()
    count: number;
}